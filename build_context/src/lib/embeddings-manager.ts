import { OpenAIEmbeddings } from '@langchain/openai';
import { index } from './pinecone';
import { db } from './db';

export class EmbeddingsManager {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_KEY,
      modelName: "text-embedding-3-large",
      stripNewLines: true,
    });
  }

  async generateMessageEmbedding(message: string, metadata: {
    userId: string;
    messageId: string;
    username: string;
    type: 'message' | 'response';
    language?: string;
    threadId?: string;
    channelId?: string;
  }) {
    try {
      const embedding = await this.embeddings.embedQuery(message);
      
      // Clean metadata by removing undefined/null values
      const cleanMetadata = {
        ...metadata,
        content: message,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      // Remove any null or undefined values
      Object.keys(cleanMetadata).forEach(key => {
        if (cleanMetadata[key] === null || cleanMetadata[key] === undefined) {
          delete cleanMetadata[key];
        }
      });
      
      await index.upsert([{
        id: metadata.messageId,
        values: embedding,
        metadata: cleanMetadata
      }]);

      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async findSimilarMessages(message: string, options: {
    userId: string;
    topK?: number;
    minScore?: number;
    language?: string;
  }) {
    const embedding = await this.embeddings.embedQuery(message);
    
    const results = await index.query({
      vector: embedding,
      topK: options.topK || 5,
      includeMetadata: true,
      filter: {
        userId: options.userId,
        ...(options.language && { language: options.language })
      }
    });

    return results.matches.filter(match => 
      match.score && match.score >= (options.minScore || 0.7)
    );
  }

  async updateUserStyleEmbeddings(userId: string) {
    // Get user's recent messages
    const messages = await db.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    // Combine messages to create style context
    const styleText = messages.map(m => m.content).join(' ');
    const embedding = await this.embeddings.embedQuery(styleText);

    // Store style embedding
    await index.upsert([{
      id: `style-${userId}`,
      values: embedding,
      metadata: {
        userId,
        type: 'style',
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    }]);
  }

  async cleanupOldEmbeddings(options: {
    olderThan?: Date;
    userId?: string;
    type?: string;
  }) {
    // Implementation depends on Pinecone's deletion capabilities
    // This is a placeholder for the cleanup logic
    const filter = {
      ...(options.userId && { userId: options.userId }),
      ...(options.type && { type: options.type })
    };

    // Delete vectors matching the filter
    await index.deleteMany({ filter });
  }
}

export const embeddingsManager = new EmbeddingsManager(); 