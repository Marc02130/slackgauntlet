import { handleMessageSend } from '../message-middleware';
import { logger } from './logger';
import type { MessagePayload } from '@/types/message';

interface ProcessMessageOptions {
  content: string;
  userId: string;
  email?: string;
  channelId?: string;
  recipientId?: string;
  files?: Array<{ url: string; fileType: string }>;
}

export async function processMessage({
  content,
  userId,
  email,
  channelId,
  recipientId,
  files = []
}: ProcessMessageOptions) {
  try {
    // Process through middleware
    const processedMessage = await handleMessageSend({
      content,
      userId,
      email,
      channelId,
      recipientId
    });

    // Create base message data
    const messageData = {
      content: processedMessage.content,
      userId,
      isAIResponse: processedMessage.isAIResponse,
      files: {
        create: files.map(file => ({
          url: file.url,
          fileType: file.fileType
        }))
      }
    };

    // Add channel or recipient specific data
    if (channelId) {
      return { ...messageData, channelId };
    } else if (recipientId) {
      return { ...messageData, recipientId };
    }

    throw new Error('Either channelId or recipientId must be provided');
  } catch (error) {
    logger.error('MessageProcessor', error);
    throw error;
  }
} 