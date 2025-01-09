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

    // Find users who have exchanged direct messages with the current user
    const usersWithMessages = await db.user.findMany({
      where: {
        OR: [
          // Users who sent messages to current user
          {
            messages: {
              some: {
                recipientId: dbUser.id
              }
            }
          },
          // Users who received messages from current user
          {
            receivedMessages: {
              some: {
                userId: dbUser.id
              }
            }
          }
        ],
        // Exclude current user
        NOT: {
          id: dbUser.id
        }
      },
      select: {
        id: true,
        name: true,
        profilePicture: true,
        status: true,
        messages: {
          where: {
            OR: [
              { userId: dbUser.id },
              { recipientId: dbUser.id }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
          select: {
            content: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(usersWithMessages);
  } catch (error) {
    console.error("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 