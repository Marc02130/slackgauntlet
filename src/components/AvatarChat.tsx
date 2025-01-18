'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  createdAt: string;
}

export function AvatarChat({ avatarId }: { avatarId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView();

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log('Fetching chat history for avatar:', avatarId);
        const response = await fetch(`/api/avatars/${avatarId}/chat/history`);
        console.log('History response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Received chat history:', data);
          setMessages(data);
        } else {
          const errorText = await response.text();
          console.error('History fetch error:', errorText);
        }
      } catch (error) {
        console.error('Failed to fetch chat history:', {
          error,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };
    fetchHistory();
  }, [avatarId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    console.log('Starting chat submission:', { input, avatarId });

    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    scrollToBottom();

    try {
      setIsLoading(true);
      console.log('Sending request to API...');
      
      const response = await fetch(`/api/avatars/${avatarId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to send message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      // Create AI message object from response
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        content: data.response || data.content || data, // Handle different response formats
        isUser: false,
        createdAt: new Date().toISOString()
      };
      
      console.log('Created AI message:', aiMessage);
      setMessages(prev => [...prev, aiMessage]);
      scrollToBottom();
    } catch (error) {
      console.error('Detailed chat error:', {
        error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Show error message to user
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        content: 'Failed to get response. Please try again.',
        isUser: false,
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.isUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
} 