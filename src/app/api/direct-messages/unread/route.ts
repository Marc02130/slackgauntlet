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

    // Get unread counts for each sender
    const unreadMessages = await db.messageRead.findMany({
      where: {
        userId: dbUser.id,
        read: false,
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
      if (msg.message.userId) {
        unreadMap[msg.message.userId] = (unreadMap[msg.message.userId] || 0) + 1;
      }
    });

    return NextResponse.json(unreadMap);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 