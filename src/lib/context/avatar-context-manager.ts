import { db } from '../db';
import { messageResponseManager } from '../message-response-manager';
import { embeddingsManager } from '../embeddings-manager';
import { EmbeddingData, EmbeddingResult } from '../../types/embeddings';
import { Prisma } from '@prisma/client';

export class AvatarContextManager {
  async getFullContext({
    avatarId,
    message,
    limit = 5
  }: {
    avatarId: string;
    message: string;
    limit?: number;
  }): Promise<EmbeddingResult> {
    try {
      // Get avatar's knowledge base documents
      const avatarDocs = await db.avatarDocument.findMany({
        where: { avatarId },
        select: {
          id: true,
          content: true,
          embedding: true
        }
      });

      // Get all user messages
      const userMessages = await db.message.findMany({
        where: {
          OR: [
            { channelId: { not: null } },
            { recipientId: { not: null } }
          ],
          NOT: {
            content: { startsWith: '[AI]' }
          }
        },
        select: {
          id: true,
          content: true,
          embedding: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 100
      });

      const messageEmbedding = await embeddingsManager.generateEmbedding(message);

      const mapToEmbeddingData = <T extends { id: string; content: string; embedding: Prisma.JsonValue | null }>(
        item: T
      ): EmbeddingData => ({
        id: item.id,
        content: item.content,
        embedding: (item.embedding as number[]) || [],
        score: 0
      });

      const relevantContext = await embeddingsManager.getRelevantContext({
        embedding: messageEmbedding,
        messages: userMessages.map(mapToEmbeddingData),
        documents: avatarDocs.map(mapToEmbeddingData),
        limit
      });

      return {
        relevantMessages: relevantContext.messages,
        relevantDocuments: relevantContext.documents,
        messageEmbedding
      };
    } catch (error) {
      console.error('Error getting context:', error);
      throw error;
    }
  }
}

export const avatarContextManager = new AvatarContextManager(); 