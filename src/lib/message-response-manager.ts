import { OpenAIEmbeddings } from '@langchain/openai';
import { index } from './pinecone';
import { db } from './db';
import { ChatOpenAI } from '@langchain/openai';

export class MessageResponseManager {
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

  async generateResponse(params: {
    userId: string;
    avatarId: string;
    message: string;
    threadId?: string;
    contextMessages?: any[];
  }) {
    try {
      // 1. Generate embedding for incoming message
      const messageEmbedding = await this.embeddings.embedQuery(params.message);

      // 2. Get avatar's knowledge base documents
      const avatarDocs = await db.avatarDocument.findMany({
        where: { avatarId: params.avatarId },
        select: {
          content: true,
          embedding: true
        }
      });

      // 3. Find similar documents using embeddings
      const similarDocs = await index.query({
        vector: messageEmbedding,
        filter: {
          avatarId: params.avatarId,
          type: 'document'
        },
        topK: 5,
        includeMetadata: true
      });

      // 4. Generate contextual response with document knowledge
      const response = await this.model.invoke([
        {
          role: 'system',
          content: `You are an AI avatar responding based on your knowledge base. 
                   Use the provided documents to inform your responses.`
        },
        {
          role: 'user',
          content: `Question: "${params.message}"
                   Relevant documents: ${JSON.stringify(similarDocs)}
                   Knowledge base: ${JSON.stringify(avatarDocs)}`
        }
      ]);

      // Convert response content to string
      return typeof response.content === 'string' 
        ? response.content 
        : JSON.stringify(response.content);

    } catch (error) {
      console.error('Failed to generate AI response:', error);
      throw error;
    }
  }
}

export const messageResponseManager = new MessageResponseManager(); 