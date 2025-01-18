import { db } from './db';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAIEmbeddings } from '@langchain/openai';
import { index } from './pinecone';
import { logger } from './utils/logger';

const openai = new ChatOpenAI({
  modelName: process.env.OPENAI_MODEL,
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const embeddings = new OpenAIEmbeddings({
  modelName: process.env.OPENAI_EMBEDDING_MODEL,
});

const proofreadPrompt = PromptTemplate.fromTemplate(`
You are a helpful message proofreader. Review and improve this message while maintaining the user's writing style.

Previous messages from this user for style reference:
{context}

Message to improve: {message}

Writing style guidance:
{userStyle}

Improve the message while:
1. Maintaining the user's vocabulary and tone
2. Preserving message intent and meaning
3. Fixing any grammar or clarity issues
4. Keeping the same level of formality

Provide only the improved message without any explanations.
`);

interface MessageResponse {
  content: string;
  userId: string;
  channelId?: string;
  recipientId?: string;
  isAIResponse: boolean;
}

export async function handleMessageSend(message: {
  content: string;
  userId: string;
  email: string;
  channelId?: string;
  recipientId?: string;
}): Promise<MessageResponse> {
  try {
    logger.info('MessageMiddleware', 'Processing message', { 
      userId: message.userId,
      email: message.email,
      channelId: message.channelId,
      recipientId: message.recipientId 
    });

    const dbUser = await db.user.findUnique({
      where: { email: message.email },
      include: { aiProofingSettings: true }
    });

    logger.info('User lookup result', JSON.stringify({
      email: message.email,
      found: !!dbUser,
      hasSettings: !!dbUser?.aiProofingSettings
    }));

    if (!(dbUser?.aiProofingSettings?.proofingMode === 'after')) {
      logger.info('MessageMiddleware', 'Proofing disabled, returning original message');
      return { ...message, isAIResponse: false };
    }

    logger.info('MessageMiddleware', 'Finding similar messages for context');
    const embedding = await embeddings.embedQuery(message.content);
    const similar = await index.query({
      vector: embedding,
      topK: 5,
      filter: {
        userId: message.userId,
        ...(message.channelId ? { channelId: message.channelId } : { recipientId: message.recipientId })
      },
      includeMetadata: true
    });

    // Build context from similar messages
    const context = similar.matches
      .map(m => m.metadata.content)
      .join('\n');

    const formattedPrompt = await proofreadPrompt.format({
      message: message.content,
      context,
      userStyle: "Based on the context messages, maintain the user's writing style."
    });

    const response = await openai.invoke(formattedPrompt);
    logger.info('MessageMiddleware', 'Message processed successfully', {
      isModified: response.content !== message.content
    });

    return {
      ...message,
      content: `[AI edited] ${response.content}`,
      isAIResponse: true
    };

  } catch (error) {
    logger.error('MessageMiddleware', error);
    return { ...message, isAIResponse: false };
  }
} 