import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { embeddingsManager } from "@/lib/embeddings-manager";
import { NextResponse } from "next/server";
import { handleMessageSend } from '@/lib/message-middleware';
import { withUser } from '@/middleware/user-resolver';
import { validateChannelMembership } from '@/lib/utils/user-resolver';
import { logger } from '@/lib/utils/logger';
import { processMessage } from '@/lib/utils/message-processor';

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
    const { userId: clerkUserId } = auth();
    const user = await currentUser();

    if (!clerkUserId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get database user first
    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: clerkUserId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    await validateChannelMembership(dbUser.id, params.channelId);
    const { content, fileUrls } = await req.json();

    // Use dbUser.id for message processing
    const messageData = await processMessage({
      content,
      userId: dbUser.id,
      email: user.emailAddresses[0].emailAddress,
      channelId: params.channelId,
      files: fileUrls
    });

    const message = await db.message.create({
      data: messageData,
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true
          }
        },
        files: true
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
} 