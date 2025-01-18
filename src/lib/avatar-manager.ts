import { OpenAIEmbeddings } from '@langchain/openai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { db } from './db';
import { logger } from './utils/logger';
import { avatarContextManager } from './context/avatar-context-manager';
import { conversationMemory } from './memory/conversation-memory';
import { HumanMessage } from "@langchain/core/messages";
import { cacheManager } from './cache-manager';

interface AvatarDocument {
  id: string;
  content: string;
  embedding?: number[] | null;
}

interface RelevantDocument {
  content: string;
  relevance: number;
}

export class AvatarManager {
  private embeddings: OpenAIEmbeddings;
  private model: ChatOpenAI;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-large"
    });
    
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.7
    });
  }

  async getRelevantDocuments(
    avatarId: string,
    message: string,
    documents: AvatarDocument[]
  ): Promise<RelevantDocument[]> {
    try {
      // Generate embedding for the user message
      const queryEmbedding = await this.embeddings.embedQuery(message);

      // Calculate similarity scores for each document
      const scoredDocs = await Promise.all(
        documents.map(async (doc) => {
          // Generate embedding if not exists
          const docEmbedding = doc.embedding || 
            await this.embeddings.embedQuery(doc.content);

          // Calculate cosine similarity
          const similarity = this.cosineSimilarity(queryEmbedding, docEmbedding);

          return {
            content: doc.content,
            relevance: similarity
          };
        })
      );

      // Sort by relevance and take top 3
      return scoredDocs
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 3);

    } catch (error) {
      logger.error('getRelevantDocuments', error);
      return [];
    }
  }

  async getResponse(params: {
    avatarId: string;
    message: string;
    userId: string;
  }) {
    const { avatarId, message, userId } = params;
    
    try {
      logger.info('AvatarManager', 'Getting response', { avatarId, messageLength: message.length });
      
      // Get avatar settings and documents
      const avatar = await db.avatar.findUnique({
        where: { id: avatarId },
        select: {
          name: true,
          personality: true,
          contextLimit: true
        }
      });

      if (!avatar) {
        throw new Error('Avatar not found');
      }

      // Get full context
      const context = await avatarContextManager.getFullContext({
        avatarId,
        message,
        limit: avatar.contextLimit || 5
      });

      // Build context strings
      const messageContext = context.relevantMessages
        .map(msg => `Previous Conversation: ${msg.content}`)
        .join('\n\n');

      const documentContext = context.relevantDocuments
        .map(doc => `Knowledge: ${doc.content}`)
        .join('\n\n');

      // Create prompt with all context
      const prompt = PromptTemplate.fromTemplate(`
        You are ${avatar.name}, with the following personality:
        ${avatar.personality}

        Use this knowledge to inform your responses:
        ${documentContext}

        Previous conversations for context:
        ${messageContext}

        Current user message: {message}

        Respond naturally in character, using the provided knowledge and context. 
        Do not mention being an AI or having limitations - respond as your character would.
      `);

      const response = await this.model.invoke([
        await prompt.format({ message })
      ]);

      const responseText = typeof response.content === 'string' 
        ? response.content 
        : JSON.stringify(response.content);

      return responseText;

    } catch (error) {
      logger.error('AvatarManager', 'Failed to get response', { error });
      throw error;
    }
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const normB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (normA * normB);
  }

  async updateAvatar(avatarId: string): Promise<void> {
    // Invalidate cache when avatar is updated
    await cacheManager.invalidate(avatarId);
  }
}

export const avatarManager = new AvatarManager(); 