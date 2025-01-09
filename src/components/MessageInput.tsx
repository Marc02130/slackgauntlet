'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUploadThing } from "@/lib/hooks/useUploadThing";

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const { startUpload, isUploading } = useUploadThing("messageAttachment");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || files.length > 0) && !isLoading) {
      try {
        setIsLoading(true);
        setError('');
        
        let fileUrls: string[] = [];
        
        if (files.length > 0) {
          const uploadResult = await startUpload(files);
          
          if (!uploadResult) {
            throw new Error("File upload failed");
          }
          fileUrls = uploadResult.map(file => file.url);
        }

        const response = await fetch(`/api/channels/${params.channelId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            content: message,
            fileUrls: fileUrls
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'Failed to send message');
        }

        setMessage('');
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to send message');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="border-t bg-white">
      {error && (
        <div className="p-2 text-sm text-red-500 bg-red-50">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4">
        {files.length > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            Selected files: {files.map(f => f.name).join(', ')}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            accept="image/*,.pdf,text/*,video/*,audio/*"
            className="hidden"
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading || (!message.trim() && files.length === 0)}
            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
} 