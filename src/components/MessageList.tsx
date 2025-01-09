'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon, MessageCircle } from 'lucide-react';
import { MessageThread } from './MessageThread';
import { useInView } from 'react-intersection-observer';

interface File {
  id: string;
  url: string;
  fileType: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  channelId: string;
  files: File[];
  user: {
    username: string;
    profilePicture?: string | null;
  };
  replyCount: number;
}

interface MessageListProps {
  channelId: string;
}

export function MessageList({ channelId }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout>();
  const lastMessagesRef = useRef<string>('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { ref: bottomRef, inView: bottomInView } = useInView();
  const lastCheckedRef = useRef<Date>(new Date());

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
      const response = await fetch(`/api/channels/${channelId}/messages`);
      
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

  const markMessagesAsRead = async () => {
    try {
      await fetch(`/api/channels/${channelId}/messages/read`, {
        method: 'POST'
      });
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/channels/${channelId}/messages/unread`);
      if (response.ok) {
        const { count } = await response.json();
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  useEffect(() => {
    if (bottomInView) {
      setIsAtBottom(true);
      markMessagesAsRead();
    } else {
      setIsAtBottom(false);
    }
  }, [bottomInView]);

  useEffect(() => {
    const fetchData = async () => {
      if (isAtBottom) {
        await fetchMessages();
        lastCheckedRef.current = new Date();
      } else {
        await fetchUnreadCount();
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [channelId, isAtBottom]);

  useEffect(() => {
    const markChannelAsRead = async () => {
      try {
        await fetch(`/api/channels/${channelId}/read`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error marking channel as read:', error);
      }
    };

    if (isAtBottom) {
      markChannelAsRead();
    }
  }, [channelId, isAtBottom]);

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

    // Default file link with icon
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
    <div className="flex-1 flex flex-col relative">
      {!isAtBottom && unreadCount > 0 && (
        <button
          onClick={() => {
            scrollToBottom();
            markMessagesAsRead();
          }}
          className="absolute top-4 left-1/2 transform -translate-x-1/2 
                     bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
        >
          {unreadCount} new messages
        </button>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              {message.user.profilePicture ? (
                <img
                  src={message.user.profilePicture}
                  alt={message.user.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  {message.user.username[0]}
                </div>
              )}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold">{message.user.username}</span>
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
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedMessage(message);
                    setIsThreadOpen(true);
                  }}
                  className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <MessageCircle size={16} />
                  {message.replyCount > 0 && (
                    <span className="text-xs">{message.replyCount}</span>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        {selectedMessage && (
          <MessageThread
            isOpen={isThreadOpen}
            onClose={() => {
              setIsThreadOpen(false);
              setSelectedMessage(null);
            }}
            parentMessage={selectedMessage}
            channelId={channelId}
          />
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  );
} 