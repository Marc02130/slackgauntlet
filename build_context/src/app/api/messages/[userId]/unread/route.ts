import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

    // Count unread messages from this sender
    const count = await db.messageRead.count({
      where: {
        userId: dbUser.id,
        message: {
          userId: params.userId,
          recipientId: dbUser.id
        }
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("[MESSAGES_UNREAD_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 