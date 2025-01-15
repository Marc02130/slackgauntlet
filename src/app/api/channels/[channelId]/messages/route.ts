import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { embeddingsManager } from "@/lib/embeddings-manager";
import { NextResponse } from "next/server";

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
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, fileUrls, parentId } = await req.json();

    if (!content?.trim() && (!fileUrls || fileUrls.length === 0)) {
      return new NextResponse("Message content or files are required", { status: 400 });
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

    // Get all channel members except the sender
    const channelMembers = await db.channelUser.findMany({
      where: {
        channelId: params.channelId,
        NOT: {
          userId: dbUser.id
        }
      },
      select: {
        userId: true
      }
    });

    // Create message with files
    const message = await db.message.create({
      data: {
        content: content || '',
        userId: dbUser.id,
        channelId: params.channelId,
        parentId,
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

    // Generate embedding for the channel message
    await embeddingsManager.generateMessageEmbedding(
      content,
      {
        userId: dbUser.id,
        messageId: message.id,
        username: dbUser.username,
        type: 'message',
        channelId: params.channelId,
        threadId: parentId || undefined
      }
    );

    // Create message read records for all channel members except sender
    if (channelMembers.length > 0) {
      await db.messageRead.createMany({
        data: channelMembers.map(member => ({
          messageId: message.id,
          userId: member.userId,
          channelId: params.channelId
        }))
      });
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