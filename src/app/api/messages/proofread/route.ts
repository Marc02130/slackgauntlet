import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { embeddingsManager } from "@/lib/embeddings-manager";
import { db } from "@/lib/db";

const openai = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL,
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const proofreadPrompt = PromptTemplate.fromTemplate(`
You are a helpful message proofreader. Review the following message considering:
1. The user's writing style based on similar messages provided
2. The conversation context
3. The type of message (question, task, information, social)

Similar messages for style reference:
{similarMessages}

Conversation context:
{context}

Message to review: {message}

Provide your response in JSON format with this structure (do not include these brackets in output):
{{
  "suggested": "complete suggested text",
  "changes": [
    {{
      "type": "addition|deletion|modification",
      "original": "original text",
      "suggested": "suggested text",
      "position": [start, end]
    }}
  ]
}}

Only make necessary changes while preserving the author's voice and intent.
`);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, channelId } = await req.json();
    if (!content?.trim()) {
      return new NextResponse("Message content is required", { status: 400 });
    }

    // Get similar messages from vector DB
    const similarMessages = await embeddingsManager.findSimilarMessages(content, {
      userId,
      topK: 5,
      minScore: 0.7
    });

    // Get recent conversation context
    const recentMessages = await db.message.findMany({
      where: { channelId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: true }
    });

    const formattedPrompt = await proofreadPrompt.format({
      message: content,
      similarMessages: similarMessages
        .map(m => m.metadata.content)
        .join('\n'),
      context: recentMessages
        .reverse()
        .map(m => `${m.user.username}: ${m.content}`)
        .join('\n')
    });

    const response = await openai.invoke(formattedPrompt);
    const result = JSON.parse(String(response.content));
    
    return NextResponse.json(result);

  } catch (error) {
    console.error("Proofing error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to proofread message" }), 
      { status: 500 }
    );
  }
} 