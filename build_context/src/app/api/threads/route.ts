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

    // Find all threads where the user has participated (either as author or replied)
    const threads = await db.message.findMany({
      where: {
        OR: [
          // Messages the user has replied to
          {
            replies: {
              some: {
                userId: dbUser.id
              }
            }
          },
          // User's messages that have replies
          {
            AND: [
              { userId: dbUser.id },
              { replyCount: { gt: 0 } }
            ]
          }
        ],
        // Only get parent messages
        parentId: null
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true
          }
        },
        channel: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            replies: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform the response
    const transformedThreads = threads.map(thread => ({
      ...thread,
      replyCount: thread._count.replies,
      _count: undefined
    }));

    return NextResponse.json(transformedThreads);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 