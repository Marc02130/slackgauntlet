'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Bot } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUploadThing } from "@/lib/hooks/useUploadThing";
import { EmojiPicker } from './EmojiPicker';
import { MessageProofingDialog } from './MessageProofingDialog';

export function MessageInput() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProofing, setIsProofing] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const { startUpload } = useUploadThing("messageAttachment");

  // Add state for proofing dialog
  const [isProofingDialogOpen, setIsProofingDialogOpen] = useState(false);
  const [proofingResult, setProofingResult] = useState<{
    suggested: string;
    changes: Array<{
      type: 'addition' | 'deletion' | 'modification';
      original: string;
      suggested: string;
      position: [number, number];
    }>;
  } | null>(null);

  const handleProofread = async () => {
    if (!message.trim()) return;

    try {
      setIsProofing(true);
      const response = await fetch('/api/messages/proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: message,
          channelId: params.channelId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to proofread message');
      }

      const result = await response.json();
      setProofingResult(result);
      setIsProofingDialogOpen(true);
    } catch (error) {
      setError('Failed to proofread message');
      console.error('Proofread error:', error);
    } finally {
      setIsProofing(false);
    }
  };

  const handleAcceptProofing = (editedContent: string) => {
    setMessage(editedContent);
    setIsProofingDialogOpen(false);
    setProofingResult(null);
  };

  const handleRejectProofing = () => {
    setIsProofingDialogOpen(false);
    setProofingResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) return;
    if (!params.channelId) {
      console.error('Channel ID is required');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      let fileUrls: string[] = [];
      
      // Upload files first if any
      if (files.length > 0) {
        const uploadResult = await startUpload(files);
        if (!uploadResult) {
          throw new Error("File upload failed");
        }
        fileUrls = uploadResult.map(file => file.url);
      }

      // Send message with file URLs
      const response = await fetch(`/api/channels/${params.channelId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: message,
          fileUrls
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Clear form on success
      setMessage('');
      setFiles([]);
    } catch (error) {
      setError('Failed to send message');
      console.error('Send message error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Paperclip size={20} />
            </button>
            
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
            
            <button
              type="button"
              onClick={handleProofread}
              disabled={isProofing || !message.trim()}
              className={`p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 ${
                isProofing ? 'animate-spin' : ''
              }`}
            >
              <Bot size={20} />
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

      {/* Add the MessageProofingDialog */}
      {proofingResult && (
        <MessageProofingDialog
          isOpen={isProofingDialogOpen}
          onClose={() => setIsProofingDialogOpen(false)}
          original={message}
          suggested={proofingResult.suggested}
          changes={proofingResult.changes}
          onAccept={handleAcceptProofing}
          onReject={handleRejectProofing}
        />
      )}
    </>
  );
} 