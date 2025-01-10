import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
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

    // Get unread messages grouped by sender
    const unreadMessages = await db.messageRead.findMany({
      where: {
        userId: dbUser.id,
        channelId: null
      },
      include: {
        message: {
          select: {
            userId: true
          }
        }
      }
    });

    // Count messages by sender
    const unreadMap: Record<string, number> = {};
    unreadMessages.forEach(msg => {
      if (msg.message?.userId) {  // Add null check
        unreadMap[msg.message.userId] = (unreadMap[msg.message.userId] || 0) + 1;
      }
    });

    // Get all users who have sent messages to the current user
    const senders = await db.user.findMany({
      where: {
        messages: {
          some: {
            recipientId: dbUser.id,
            channelId: null
          }
        }
      },
      select: {
        id: true
      }
    });

    // Initialize counts for all senders
    senders.forEach(sender => {
      if (!(sender.id in unreadMap)) {
        unreadMap[sender.id] = 0;
      }
    });

    return NextResponse.json(unreadMap);
  } catch (error) {
    console.error("[DIRECT_MESSAGES_UNREAD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 