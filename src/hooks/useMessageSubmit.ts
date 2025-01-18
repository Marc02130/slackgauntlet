import { useState } from 'react';
import { useUploadThing } from "@/lib/hooks/useUploadThing";
import type { MessagePayload, MessageResponse } from '@/types/message';

interface UseMessageSubmitProps {
  channelId: string;
  onSuccess?: (message: MessageResponse) => void;
  onError?: (error: Error) => void;
}

export function useMessageSubmit({ channelId, onSuccess, onError }: UseMessageSubmitProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startUpload } = useUploadThing("messageAttachment");

  const submitMessage = async (content: string, files: File[]) => {
    try {
      setIsLoading(true);
      setError(null);

      // Handle file uploads
      const uploadedFiles = files.length > 0 
        ? (await startUpload(files))?.map(file => ({
            url: file.url,
            fileType: file.name?.split('.').pop() || 'unknown'  // Extract from filename
          })) || []
        : [];

      // Prepare message payload
      const payload: MessagePayload = {
        content: content.trim(),
        files: uploadedFiles
      };

      // Send message
      const response = await fetch(`/api/channels/${channelId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to send message');
      }

      const messageResponse = await response.json();
      onSuccess?.(messageResponse);
      return messageResponse;

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message');
      setError(error.message);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitMessage,
    isLoading,
    error,
  };
} 