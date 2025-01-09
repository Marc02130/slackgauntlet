'use client';

import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { X, Send, Paperclip } from 'lucide-react';
import { useUploadThing } from "@/lib/hooks/useUploadThing";
import { EmojiPicker } from './EmojiPicker';

interface MessageThreadProps {
  isOpen: boolean;
  onClose: () => void;
  parentMessage: {
    id: string;
    content: string;
    createdAt: string;
    channelId: string;
    user: {
      username: string;
      profilePicture?: string | null;
    };
  };
  channelId: string;
}

export function MessageThread({ isOpen, onClose, parentMessage, channelId }: MessageThreadProps) {
  const [replies, setReplies] = useState<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      username: string;
      profilePicture?: string | null;
    };
  }[]>([]);
  const [newReply, setNewReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout>();
  const { startUpload } = useUploadThing("messageAttachment");

  const handleEmojiSelect = (emoji: string) => {
    setNewReply(prev => prev + emoji);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/channels/${channelId}/messages/${parentMessage.id}/replies`);
      if (!response.ok) throw new Error('Failed to fetch replies');
      const data = await response.json();
      setReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReplies();
      pollingInterval.current = setInterval(fetchReplies, 2000);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [isOpen, parentMessage.id]);

  useEffect(() => {
    if (replies.length > 0) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [replies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newReply.trim() && files.length === 0) || isLoading) return;

    try {
      setIsLoading(true);
      
      let fileUrls: string[] = [];
      
      if (files.length > 0) {
        const uploadResult = await startUpload(files);
        
        if (!uploadResult) {
          throw new Error("File upload failed");
        }
        fileUrls = uploadResult.map(file => file.url);
      }

      const response = await fetch(`/api/channels/${channelId}/messages/${parentMessage.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: newReply.trim(),
          fileUrls: fileUrls
        }),
      });

      if (!response.ok) throw new Error('Failed to send reply');
      
      setNewReply('');
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchReplies();
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-96 h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Thread</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Parent Message */}
          <div className="border-b pb-4">
            <div className="flex items-start gap-3">
              {parentMessage.user.profilePicture ? (
                <img
                  src={parentMessage.user.profilePicture}
                  alt={parentMessage.user.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {parentMessage.user.username[0]}
                </div>
              )}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{parentMessage.user.username}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(parentMessage.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700">{parentMessage.content}</p>
              </div>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-4">
            {replies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-3">
                {reply.user.profilePicture ? (
                  <img
                    src={reply.user.profilePicture}
                    alt={reply.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {reply.user.username[0]}
                  </div>
                )}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{reply.user.username}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700">{reply.content}</p>
                </div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>
        </div>

        {/* Updated Reply Input with fixed button styling */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          {files.length > 0 && (
            <div className="mb-2 text-sm text-gray-600">
              Selected files: {files.map(f => f.name).join(', ')}
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 flex-shrink-0"
            >
              <Paperclip size={20} />
            </button>
            <EmojiPicker onEmojiSelect={handleEmojiSelect} />
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
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Reply to thread..."
              disabled={isLoading}
              className="flex-1 min-w-0 rounded-md border border-gray-300 p-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading || (!newReply.trim() && files.length === 0)}
              className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 