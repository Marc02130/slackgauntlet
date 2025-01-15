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

    const channels = await db.channel.findMany({
      where: {
        users: {
          some: {
            userId: dbUser.id
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(channels);
  } catch (error) {
    console.error("[CHANNELS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, userIds } = await req.json();

    if (!name?.trim()) {
      return new NextResponse("Channel name is required", { status: 400 });
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

    // Ensure userIds is an array and doesn't include current user
    const uniqueUserIds = Array.from(new Set(userIds))
      .filter(id => id !== dbUser.id);

    // Create channel and add all users including current user
    const channel = await db.channel.create({
      data: {
        name: name.trim(),
        users: {
          create: [
            { userId: dbUser.id }, // Current user
            ...uniqueUserIds.map((id: string) => ({ userId: id }))
          ]
        }
      },
      include: {
        users: true
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.error("Channel creation error:", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
} 