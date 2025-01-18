import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";
import { avatarManager } from "@/lib/avatar-manager";

export async function PATCH(
  req: Request,
  { params }: { params: { avatarId: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      logger.error('Avatar update', 'Unauthorized request');
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
      logger.error('Avatar update', 'Database user not found', { email: user.emailAddresses[0].emailAddress });
      return new NextResponse("User not found", { status: 404 });
    }

    const body = await req.json();
    logger.info('Avatar update', 'Received request', { avatarId: params.avatarId, body });

    const { name, description, personality, contextLimit, temperature } = body;

    // Verify avatar ownership
    const avatar = await db.avatar.findFirst({
      where: {
        id: params.avatarId,
        userId: dbUser.id
      }
    });

    if (!avatar) {
      logger.error('Avatar update', 'Avatar not found or unauthorized', { avatarId: params.avatarId });
      return new NextResponse("Avatar not found", { status: 404 });
    }

    // Update avatar
    const updatedAvatar = await db.avatar.update({
      where: { id: params.avatarId },
      data: {
        name: name || avatar.name,
        description: description || avatar.description,
        personality: personality || avatar.personality,
        contextLimit: contextLimit || avatar.contextLimit,
        temperature: temperature || avatar.temperature
      }
    });

    // Invalidate cache
    await avatarManager.updateAvatar(params.avatarId);

    logger.info('Avatar update', 'Avatar updated successfully', { avatarId: params.avatarId });
    return NextResponse.json(updatedAvatar);

  } catch (error) {
    logger.error('Avatar update', error);
    return new NextResponse(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to update avatar" }), 
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { avatarId: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      logger.error('Avatar fetch', 'Unauthorized request');
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
      logger.error('Avatar fetch', 'Database user not found', { 
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress 
      });
      return new NextResponse("User not found", { status: 404 });
    }

    logger.info('Avatar fetch', 'Looking up avatar', { 
      avatarId: params.avatarId,
      userId: dbUser.id 
    });

    // Get avatar with documents
    const avatar = await db.avatar.findUnique({
      where: { id: params.avatarId },
      include: {
        documents: true
      }
    });

    if (!avatar) {
      logger.error('Avatar fetch', 'Avatar not found', { avatarId: params.avatarId });
      return new NextResponse("Avatar not found", { status: 404 });
    }

    // Verify ownership
    if (avatar.userId !== dbUser.id) {
      logger.error('Avatar fetch', 'Unauthorized access', { 
        avatarId: params.avatarId,
        avatarUserId: avatar.userId,
        requestUserId: dbUser.id 
      });
      return new NextResponse("Unauthorized", { status: 401 });
    }

    logger.info('Avatar fetch', 'Avatar found successfully', { 
      avatarId: params.avatarId,
      documentCount: avatar.documents.length 
    });

    return NextResponse.json(avatar);
  } catch (error) {
    logger.error('Avatar fetch', 'Failed to fetch avatar', { 
      error,
      avatarId: params.avatarId 
    });
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch avatar" }), 
      { status: 500 }
    );
  }
} 