import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

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

    // Delete all message read records for this conversation
    await db.messageRead.deleteMany({
      where: {
        userId: dbUser.id,
        message: {
          userId: params.userId,
          recipientId: dbUser.id
        }
      }
    });

    return new NextResponse("Messages marked as read");
  } catch (error) {
    console.error("[MESSAGES_READ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 