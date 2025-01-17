import { embeddingsManager } from './embeddings-manager';
import { db } from './db';
import { ChatOpenAI } from '@langchain/openai';

export class ResponseManager {
  private openai: ChatOpenAI;
  
  constructor() {
    this.openai = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL,
    });
  }

  async generateResponse(message: string, recipientId: string) {
    try {
      const recipient = await db.user.findUnique({
        where: { id: recipientId }
      });

      if (!recipient) {
        throw new Error('Recipient not found');
      }

      if (recipient.status !== 'busy' || !recipient.useAIResponse) {
        return recipient.statusMessage || null;
      }

      const similarMessages = await embeddingsManager.findSimilarMessages(message, {
        userId: recipientId,
        topK: 5,
        minScore: 0.7
      });

      const styleVector = await embeddingsManager.findSimilarMessages('style', {
        userId: recipientId,
        topK: 1
      });

      const context = {
        userStyle: typeof styleVector[0]?.metadata?.content === 'string' 
          ? styleVector[0].metadata.content 
          : '',
        similarMessages: similarMessages
          .map(m => (typeof m.metadata?.content === 'string' ? m.metadata.content : ''))
          .join('\n'),
        statusMessage: recipient.statusMessage || 'Away',
        username: recipient.username
      };

      const response = await this.generateAIResponse(message, context);
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  private async generateAIResponse(message: string, context: {
    userStyle: string;
    similarMessages: string;
    statusMessage: string;
    username: string;
  }) {
    const prompt = `You are ${context.username}. 
    Respond to: "${message}"
    Include in response: "I am currently ${context.statusMessage}"
    Keep response brief and professional.
    Sign response as: ${context.username}`;

    const response = await this.openai.invoke([
      { role: 'human', content: prompt }
    ]);

    return `[AI] ${String(response.content)}`;
  }

  async evaluateResponse(response: string): Promise<{
    confidence: number;
    needsReview: boolean;
    isSensitive: boolean;
  }> {
    const prompt = `Evaluate this AI response for quality and appropriateness.
    Response to evaluate: "${response}"
    
    Respond in exactly this format:
    Confidence: [0-1]
    Needs review: [true/false]
    Sensitive: [true/false]`;

    const aiResponse = await this.openai.invoke([
      { role: 'human', content: prompt }
    ]);

    const evaluation = String(aiResponse.content);
    const confidence = parseFloat(evaluation.match(/Confidence: ([\d.]+)/)?.[1] || '0');
    const needsReview = evaluation.includes('Needs review: true');
    const isSensitive = evaluation.includes('Sensitive: true');

    return {
      confidence,
      needsReview,
      isSensitive
    };
  }
}

export const responseManager = new ResponseManager(); 