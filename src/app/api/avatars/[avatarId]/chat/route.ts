import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { avatarManager } from "@/lib/avatar-manager";
import { avatarMonitor } from "@/lib/monitoring/avatar-monitor";
import { logger } from "@/lib/utils/logger";
import { messageResponseManager } from "@/lib/message-response-manager";

export async function POST(
  req: Request,
  { params }: { params: { avatarId: string } }
) {
  const startTime = Date.now();
  
  try {
    logger.info('Avatar chat', 'Received chat request', { avatarId: params.avatarId });
    
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      logger.error('Avatar chat', 'Unauthorized request');
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get message from request body
    const { message } = await req.json();
    logger.info('Avatar chat', 'Processing message', { message });

    if (!message?.trim()) {
      logger.error('Avatar chat', 'Empty message received');
      return new NextResponse(
        JSON.stringify({ error: "Message is required" }),
        { status: 400 }
      );
    }

    // Get avatar
    const avatar = await db.avatar.findUnique({
      where: { id: params.avatarId }
    });

    if (!avatar) {
      logger.error('Avatar chat', 'Avatar not found', { avatarId: params.avatarId });
      return new NextResponse(
        JSON.stringify({ error: "Avatar not found" }),
        { status: 404 }
      );
    }

    logger.info('Avatar chat', 'Generating response', { 
      avatarId: params.avatarId,
      messageLength: message.length 
    });

    // Generate response
    const startGeneration = Date.now();
    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      logger.error('Avatar chat', 'Database user not found');
      return new NextResponse("User not found", { status: 404 });
    }

    const response = await messageResponseManager.generateResponse({
      userId: dbUser.id,
      avatarId: params.avatarId,
      message: message
    });
    const endGeneration = Date.now();

    logger.info('Avatar chat', 'Response generated', { 
      responseLength: response.length,
      generationTime: endGeneration - startGeneration 
    });

    // Track metrics
    await avatarMonitor.trackResponse({
      avatarId: params.avatarId,
      userId,
      message,
      response,
      metrics: {
        latency: Date.now() - startTime,
        tokensUsed: 0, // Add token counting if needed
        cacheHit: false,
        status: 'success'
      }
    });

    return NextResponse.json({ 
      content: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Avatar chat', 'Error processing chat request', { error });
    
    // Track error metrics
    if (params.avatarId) {
      await avatarMonitor.trackResponse({
        avatarId: params.avatarId,
        userId: 'unknown',
        message: '',
        response: '',
        metrics: {
          latency: Date.now() - startTime,
          tokensUsed: 0,
          cacheHit: false,
          status: 'error',
          errorType: error instanceof Error ? error.name : 'Unknown'
        }
      });
    }

    return new NextResponse(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500 }
    );
  }
}

// Add history endpoint
export async function GET(
  req: Request,
  { params }: { params: { avatarId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversations = await db.avatarConversation.findMany({
      where: {
        avatarId: params.avatarId,
        userId
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        id: true,
        response: true,
        createdAt: true,
        isMemoryContext: true
      }
    });

    // Transform to chat message format
    const messages = conversations.map(conv => ({
      id: conv.id,
      content: conv.response,
      isUser: !conv.isMemoryContext,
      createdAt: conv.createdAt.toISOString()
    }));

    return NextResponse.json(messages);

  } catch (error) {
    logger.error('Avatar chat history', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 