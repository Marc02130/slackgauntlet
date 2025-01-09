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

    // Get unread counts for each channel
    const unreadCounts = await db.messageRead.groupBy({
      by: ['channelId'],
      where: {
        userId: dbUser.id,
        read: false,
        channelId: { not: null }
      },
      _count: {
        messageId: true
      }
    });

    // Transform to a map of channelId -> count
    const unreadMap = Object.fromEntries(
      unreadCounts.map(({ channelId, _count }) => [
        channelId,
        _count.messageId
      ])
    );

    return NextResponse.json(unreadMap);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 