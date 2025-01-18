import { OpenAIEmbeddings } from '@langchain/openai';
import { index } from './pinecone';
import { db } from './db';
import { EmbeddingData } from '../types/embeddings';

type MessageType = 'message' | 'response' | 'document';

interface EmbeddingMetadata {
  userId: string;
  messageId: string;
  type: MessageType;
  username: string;
  language?: string;
  threadId?: string;
  channelId?: string;
}

interface RelevantContextResult {
  messages: EmbeddingData[];
  documents: EmbeddingData[];
}

export class EmbeddingsManager {
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-3-large",
      stripNewLines: true,
    });
  }

  private cleanMessage(message: string): string {
    // Remove AI tags
    return message
      .replace(/\[AI\]\s*/g, '')
      .replace(/\[AI edited\]\s*/g, '')
      .trim();
  }

  async generateMessageEmbedding(message: string, metadata: {
    userId: string;
    messageId: string;
    username: string;
    type: MessageType;
    language?: string;
    threadId?: string;
    channelId?: string;
  }) {
    try {
      // Clean the message before generating embedding
      const cleanedMessage = this.cleanMessage(message);
      const embedding = await this.embeddings.embedQuery(cleanedMessage);
      
      // Clean metadata by removing undefined/null values
      const cleanMetadata = {
        ...metadata,
        content: cleanedMessage, // Store cleaned message in metadata
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

  async searchSimilarMessages(params: {
    message: string;
    avatarId: string;
    threshold: number;
    limit: number;
  }) {
    const embedding = await this.embeddings.embedQuery(params.message);
    
    const results = await index.query({
      vector: embedding,
      filter: { avatarId: params.avatarId },
      topK: params.limit,
      includeMetadata: true
    });

    return results.matches
      .filter(match => (match.score || 0) >= params.threshold)
      .map(match => ({
        content: match.metadata?.content || '',
        score: match.score || 0
      }));
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (!text) {
      throw new Error('Text is required for generating embeddings');
    }

    try {
      // Clean the text before generating embedding
      const cleanedText = this.cleanMessage(text);
      return await this.embeddings.embedQuery(cleanedText);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async getRelevantContext({
    embedding,
    messages,
    documents,
    limit
  }: {
    embedding: number[];
    messages: EmbeddingData[];
    documents: EmbeddingData[];
    limit: number;
  }): Promise<RelevantContextResult> {
    // Use the parameters to find relevant context
    const results = await index.query({
      vector: embedding,
      topK: limit,
      includeMetadata: true
    });

    const relevantMessages: EmbeddingData[] = [];
    const relevantDocuments: EmbeddingData[] = [];

    results.matches.forEach(match => {
      if (match.metadata?.type === 'message') {
        relevantMessages.push({
          content: String(match.metadata?.content || ''),
          score: match.score || 0
        });
      } else if (match.metadata?.type === 'document') {
        relevantDocuments.push({
          content: String(match.metadata?.content || ''),
          score: match.score || 0
        });
      }
    });

    return {
      messages: relevantMessages,
      documents: relevantDocuments
    };
  }

  async processAvatarDocument(params: {
    documentId: string;
    avatarId: string;
    content: string;
    fileUrl: string;
    mimeType: string;
  }) {
    try {
      const { documentId, avatarId, content, fileUrl, mimeType } = params;

      // Generate embedding for document content
      const embedding = await this.embeddings.embedQuery(content);
      
      // Store in Pinecone with metadata
      await index.upsert([{
        id: documentId,
        values: embedding,
        metadata: {
          avatarId,
          type: 'document',
          content,
          fileUrl,
          mimeType,
          timestamp: new Date().toISOString()
        }
      }]);

      // Update document with vector ID
      await db.avatarDocument.update({
        where: { id: documentId },
        data: { vectorId: documentId }
      });

      return embedding;
    } catch (error) {
      console.error('Error processing avatar document:', error);
      throw error;
    }
  }
}

export const embeddingsManager = new EmbeddingsManager(); 