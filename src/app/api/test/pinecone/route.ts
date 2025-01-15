import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { index, embeddings } from "@/lib/pinecone";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get test message from request
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Generate embedding for the message
    const embedding = await embeddings.embedQuery(message);

    // Store in Pinecone with metadata
    const upsertResponse = await index.upsert([{
      id: `test-${Date.now()}`,
      values: embedding,
      metadata: {
        userId,
        message,
        type: 'test',
        timestamp: new Date().toISOString()
      }
    }]);

    // Test similarity search
    const queryResponse = await index.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true
    });

    return NextResponse.json({
      status: "success",
      upsert: upsertResponse,
      similar: queryResponse.matches
    });

  } catch (error) {
    console.error("Pinecone test error:", error);
    return NextResponse.json(
      { error: "Failed to test Pinecone connection" },
      { status: 500 }
    );
  }
}

// Test similarity search
export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchQuery = new URL(req.url).searchParams.get('q');
    if (!searchQuery) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    // Generate embedding for search query
    const queryEmbedding = await embeddings.embedQuery(searchQuery);

    // Search for similar vectors
    const searchResponse = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true
    });

    return NextResponse.json({
      success: true,
      results: searchResponse.matches.map(match => ({
        score: match.score,
        metadata: match.metadata
      }))
    });

  } catch (error) {
    console.error('Pinecone search error:', error);
    return NextResponse.json(
      { error: "Failed to search vectors" },
      { status: 500 }
    );
  }
} 