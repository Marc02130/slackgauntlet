import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { embeddingsManager } from "@/lib/embeddings-manager";
import { responseManager } from "@/lib/response-manager";
import { NextResponse } from "next/server";
import { handleMessageSend } from '@/lib/message-middleware';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    const user = await currentUser();

    if (!currentUserId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: currentUserId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            userId: dbUser.id,
            recipientId: params.userId
          },
          {
            userId: params.userId,
            recipientId: dbUser.id
          }
        ]
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
          }
        },
        files: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    const user = await currentUser();

    if (!currentUserId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, fileUrls } = await req.json();
    const recipientId = params.userId;

    // Process message through middleware
    const processedMessage = await handleMessageSend({
      content,
      userId: currentUserId,
      recipientId
    });

    if (!processedMessage.content?.trim() && (!fileUrls || fileUrls.length === 0)) {
      return new NextResponse("Message content or files are required", { status: 400 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: currentUserId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create message with files relation
    const message = await db.message.create({
      data: {
        content: processedMessage.content,
        userId: dbUser.id,
        recipientId: params.userId,
        isAIResponse: processedMessage.isAIResponse || false,
        files: {
          create: fileUrls?.map((url: string) => ({
            url,
            fileType: url.split('.').pop() || 'unknown'
          })) || []
        }
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
          }
        },
        files: true
      }
    });

    // Create read record for the recipient without the read field
    await db.messageRead.create({
      data: {
        messageId: message.id,
        userId: params.userId
      }
    });

    // Generate embedding for the message
    await embeddingsManager.generateMessageEmbedding(
      message.content,
      {
        userId: dbUser.id,
        messageId: message.id,
        username: dbUser.username,
        type: 'message',
        threadId: message.parentId,
        channelId: message.channelId
      }
    );

    // Check if recipient is busy and handle AI response
    const recipient = await db.user.findUnique({
      where: { id: params.userId }
    });

    if (recipient?.status === 'busy') {
      try {
        const aiResponse = await responseManager.generateResponse(processedMessage.content, params.userId);
        
        if (aiResponse) {
          // Evaluate response
          const evaluation = await responseManager.evaluateResponse(aiResponse);
          
          if (!evaluation.isSensitive && evaluation.confidence > 0.7) {
            // Create AI response message
            await db.message.create({
              data: {
                content: aiResponse,
                userId: params.userId,
                recipientId: dbUser.id,
                isAIResponse: true
              }
            });
          }
        } else if (recipient.statusMessage) {
          // Send static away message
          await db.message.create({
            data: {
              content: recipient.statusMessage,
              userId: params.userId,
              recipientId: dbUser.id,
              isAIResponse: false
            }
          });
        }
      } catch (error) {
        console.error('Error generating AI response:', error);
      }
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
} 