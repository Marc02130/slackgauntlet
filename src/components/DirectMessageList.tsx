'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon } from 'lucide-react';

interface File {
  id: string;
  url: string;
  fileType: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  files: File[];
  user: {
    name: string;
    profilePicture?: string | null;
  };
}

interface DirectMessageListProps {
  recipientId: string;
}

export function MessageList({ recipientId }: DirectMessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout>();
  const lastMessagesRef = useRef<string>('');

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${recipientId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch messages');
      }
      
      const data = await response.json();
      const newMessagesString = JSON.stringify(data);
      
      // Only update state if messages have changed
      if (newMessagesString !== lastMessagesRef.current) {
        setMessages(data);
        lastMessagesRef.current = newMessagesString;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (recipientId) {
      setIsLoading(true);
      lastMessagesRef.current = ''; // Reset counter when recipient changes
      fetchMessages();

      // Set up polling every 2 seconds
      pollingInterval.current = setInterval(fetchMessages, 2000);
    }

    // Cleanup function
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [recipientId]);

  const renderFile = (file: File) => {
    const fileType = file.fileType.toLowerCase();
    
    if (fileType.match(/^(jpg|jpeg|png|gif|webp)$/)) {
      return (
        <a href={file.url} target="_blank" rel="noopener noreferrer" className="block max-w-sm">
          <img src={file.url} alt="Attached image" className="rounded-lg max-h-48 object-cover" />
        </a>
      );
    }
    
    if (fileType.match(/^(mp4|webm)$/)) {
      return (
        <video controls className="max-w-sm rounded-lg">
          <source src={file.url} type={`video/${fileType}`} />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    if (fileType.match(/^(mp3|wav|ogg)$/)) {
      return (
        <audio controls className="max-w-sm">
          <source src={file.url} type={`audio/${fileType}`} />
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return (
      <a 
        href={file.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
      >
        <FileIcon size={20} />
        <span>Download file</span>
      </a>
    );
  };

  if (error) {
    return (
      <div className="flex-1 p-4 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex-1 p-4">Loading messages...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">No messages yet</div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="flex items-start gap-3">
            {message.user.profilePicture ? (
              <img
                src={message.user.profilePicture}
                alt={message.user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                {message.user.name[0]}
              </div>
            )}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">{message.user.name}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </span>
              </div>
              {message.content && (
                <p className="text-gray-700 mb-2">{message.content}</p>
              )}
              {message.files && message.files.length > 0 && (
                <div className="space-y-2">
                  {message.files.map((file) => (
                    <div key={file.id}>
                      {renderFile(file)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
} 