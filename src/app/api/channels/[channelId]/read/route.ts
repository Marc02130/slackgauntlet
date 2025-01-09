import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

    // Mark all messages in this channel as read for the user
    await db.messageRead.updateMany({
      where: {
        userId: dbUser.id,
        channelId: params.channelId,
        read: false
      },
      data: {
        read: true
      }
    });

    return new NextResponse("Messages marked as read");
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 