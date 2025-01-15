import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { embeddingsManager } from "@/lib/embeddings-manager";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, messageId, type, language, threadId, channelId } = await req.json();

    const embedding = await embeddingsManager.generateMessageEmbedding(
      message,
      {
        userId,
        messageId,
        type,
        language,
        threadId,
        channelId,
        username: 'user' // Get from clerk or db
      }
    );

    return NextResponse.json({ success: true, embedding });
  } catch (error) {
    console.error('Embedding generation error:', error);
    return NextResponse.json(
      { error: "Failed to generate embedding" },
      { status: 500 }
    );
  }
} 