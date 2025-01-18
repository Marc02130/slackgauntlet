import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      logger.error('Avatar creation', 'Unauthorized request');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find database user
    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      logger.error('Avatar creation', 'Database user not found', { email: user.emailAddresses[0].emailAddress });
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    logger.info('Avatar creation', 'Received request', { body });

    const { name, description, personality, contextLimit, temperature } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Create new avatar
    const avatar = await db.avatar.create({
      data: {
        userId: dbUser.id,
        name,
        description: description || '',
        personality: personality || 'helpful',
        contextLimit: contextLimit || 2000,
        temperature: temperature || 0.7
      }
    });

    logger.info('Avatar creation', 'Avatar created successfully', { avatarId: avatar.id });
    return NextResponse.json(avatar);

  } catch (error) {
    logger.error('Avatar creation', error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create avatar" }), 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Get all avatars and include description field
    const avatars = await db.avatar.findMany({
      select: {
        id: true,
        name: true,
        description: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    logger.info('Avatar fetch', 'Retrieved avatars', { count: avatars.length });
    return NextResponse.json(avatars);

  } catch (error) {
    logger.error('Avatar fetch', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 