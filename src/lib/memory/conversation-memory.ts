import { db } from '../db';
import { embeddingsManager } from '../embeddings-manager';

interface ConversationContext {
  recentMessages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }[];
  relevantContext?: string;
}

export class ConversationMemory {
  private readonly MAX_RECENT_MESSAGES = 10;
  private readonly RELEVANCE_THRESHOLD = 0.7;

  async getContext(params: {
    avatarId: string;
    userId: string;
    message: string;
  }): Promise<ConversationContext> {
    const { avatarId, userId, message } = params;

    // Get recent conversation history
    const recentMessages = await db.avatarConversation.findMany({
      where: {
        avatarId,
        userId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: this.MAX_RECENT_MESSAGES,
    });

    // Search for relevant past context using embeddings
    const relevantContext = await this.findRelevantContext({
      avatarId,
      message,
    });

    return {
      recentMessages: recentMessages.map(msg => ({
        role: 'assistant',
        content: msg.response,
        timestamp: msg.createdAt.getTime()
      })),
      relevantContext
    };
  }

  private async findRelevantContext(params: {
    avatarId: string;
    message: string;
  }): Promise<string | undefined> {
    const { avatarId, message } = params;

    // Search for semantically similar past conversations
    const similarConversations = await embeddingsManager.searchSimilarMessages({
      message,
      avatarId,
      threshold: this.RELEVANCE_THRESHOLD,
      limit: 3
    });

    if (similarConversations.length === 0) {
      return undefined;
    }

    // Combine relevant context
    return similarConversations
      .map(conv => conv.content)
      .join('\n\n');
  }
}

export const conversationMemory = new ConversationMemory(); 