import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { embeddingsManager } from "@/lib/embeddings-manager";
import { NextResponse } from "next/server";
import { handleMessageSend } from '@/lib/message-middleware';

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if user is a member of the channel
    const membership = await db.channelUser.findFirst({
      where: {
        channelId: params.channelId,
        userId: dbUser.id
      }
    });

    if (!membership) {
      return new NextResponse("Not a member of this channel", { status: 403 });
    }

    const messages = await db.message.findMany({
      where: {
        channelId: params.channelId,
        parentId: null, // Only fetch top-level messages
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
          }
        },
        files: true,
        _count: {
          select: {
            replies: true // Get reply count
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Transform the messages to include replyCount from _count
    const transformedMessages = messages.map(message => ({
      ...message,
      replyCount: message._count.replies,
      _count: undefined // Remove _count from the response
    }));

    return NextResponse.json(transformedMessages);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    console.log('Channel message POST started');
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find database user by email
    const dbUser = await db.user.findFirst({
      where: {
        email: user.emailAddresses[0].emailAddress
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { content, fileUrls } = await req.json();
    const channelId = params.channelId;

    if (!content?.trim() && (!fileUrls || fileUrls.length === 0)) {
      return new NextResponse("Message content or files are required", { status: 400 });
    }

    // Process message through middleware
    const processedMessage = await handleMessageSend({
      content,
      userId: dbUser.id, // Use database userId here
      channelId
    });

    console.log('Processed message:', processedMessage);

    // Create message with files relation
    const message = await db.message.create({
      data: {
        content: processedMessage.content,
        userId: dbUser.id, // Use database userId here
        channelId,
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

    return NextResponse.json(message);
  } catch (error) {
    console.error('[MESSAGES_POST]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 