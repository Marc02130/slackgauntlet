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

    // Get non-private channels that the user is not a member of
    const availableChannels = await db.channel.findMany({
      where: {
        isPrivate: false,
        users: {
          none: {
            userId: dbUser.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        isPrivate: true,
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Return channels directly without transformation
    return NextResponse.json(availableChannels.map(channel => ({
      id: channel.id,
      name: channel.name,
      isPrivate: channel.isPrivate,
      memberCount: channel._count.users
    })));
  } catch (error) {
    console.error('Error in available channels:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 