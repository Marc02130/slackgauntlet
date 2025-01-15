'use client';

import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { DirectMessageSearch, DirectMessageSearchRef } from './DirectMessageSearch';

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
    username: string;
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
  const lastMessagesRef = useRef<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { ref: bottomRef, inView: bottomInView } = useInView();
  const lastCheckedRef = useRef<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const searchRef = useRef<DirectMessageSearchRef>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${recipientId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      const newMessagesString = JSON.stringify(data);
      
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
      await fetch(`/api/messages/${recipientId}/read`, {
        method: 'POST'
      });
      setUnreadCount(0);
      const event = new CustomEvent('refreshUnreadCounts');
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/messages/${recipientId}/unread`);
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
      if (isAtBottom && !isSearching) {
        await fetchMessages();
        await markMessagesAsRead();
      } else if (!isSearching) {
        await fetchUnreadCount();
      }
    };

    // Initial fetch
    fetchData();

    // Only poll when at bottom and not searching
    let interval: NodeJS.Timeout;
    if (isAtBottom && !isSearching) {
      interval = setInterval(fetchData, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recipientId, isAtBottom, isSearching]);

  useEffect(() => {
    if (messages.length > 0 && isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    if (recipientId) {
      setIsLoading(true);
      lastMessagesRef.current = ''; // Reset when recipient changes
      fetchMessages().then(() => {
        scrollToBottom();
      });
    }
  }, [recipientId]);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      try {
        await fetch(`/api/messages/${recipientId}/read`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    // Mark messages as read when component mounts
    if (recipientId) {
      markMessagesAsRead();
    }
  }, [recipientId]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearching(!!term);
    
    if (term) {
      const filtered = messages.filter(message => 
        message.content.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages([]);
      setIsSearching(false);
    }
  };

  const handleSearchResultClick = async (messageId: string) => {
    // Clear search input and states
    searchRef.current?.clearSearch();
    setSearchTerm('');
    setIsSearching(false);
    setFilteredMessages([]);

    // Wait for next render cycle
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Now scroll to message
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

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
    <div className="flex flex-col h-full">
      <DirectMessageSearch ref={searchRef} onSearch={handleSearch} />
      <div className="flex-1 min-h-0 relative">
        {!isAtBottom && unreadCount > 0 && !isSearching && (
          <button
            onClick={scrollToBottom}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10
                     bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
          >
            {unreadCount} new messages
          </button>
        )}

        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4">
          {isSearching ? (
            filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  id={`message-${message.id}`}
                  onClick={() => handleSearchResultClick(message.id)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
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
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500">No messages found</div>
            )
          ) : (
            messages.map((message) => (
              <div key={message.id} id={`message-${message.id}`}>
                <div className="flex items-start gap-3">
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
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
} 