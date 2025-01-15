'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageThread } from './MessageThread';

interface Thread {
  id: string;
  content: string;
  createdAt: string;
  channelId: string;
  replyCount: number;
  user: {
    username: string;
    profilePicture?: string | null;
  };
  channel: {
    name: string;
  };
}

export function ThreadsList() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isThreadOpen, setIsThreadOpen] = useState(false);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/threads');
        if (!response.ok) throw new Error('Failed to fetch threads');
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        setError('Failed to load threads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading threads...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold">Threads</h1>
      </div>
      <div className="p-4 space-y-4">
        {threads.length === 0 ? (
          <div className="text-gray-500">No threads yet</div>
        ) : (
          threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                setSelectedThread(thread);
                setIsThreadOpen(true);
              }}
              className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg border"
            >
              <div className="flex items-start gap-3">
                {thread.user.profilePicture ? (
                  <img
                    src={thread.user.profilePicture}
                    alt={thread.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {thread.user.username[0]}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{thread.user.username}</span>
                    {thread.channel && (
                      <span className="text-gray-500">in #{thread.channel.name}</span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{thread.content}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">#{thread.channel.name}</span>
                    <span className="mx-2">•</span>
                    <span>{thread.replyCount} replies</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedThread && (
        <MessageThread
          isOpen={isThreadOpen}
          onClose={() => {
            setIsThreadOpen(false);
            setSelectedThread(null);
          }}
          parentMessage={selectedThread}
          channelId={selectedThread.channelId}
        />
      )}
    </div>
  );
} 