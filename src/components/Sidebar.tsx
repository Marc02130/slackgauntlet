'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Plus, Hash, MessageSquare } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

interface DirectMessageUser {
  id: string;
  name: string;
  profilePicture?: string | null;
  status?: string | null;
}

export const Sidebar = () => {
  const { userId } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [directMessageUsers, setDirectMessageUsers] = useState<DirectMessageUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        
        // Fetch channels
        const channelsResponse = await fetch('/api/channels');
        if (!channelsResponse.ok) {
          throw new Error('Failed to fetch channels');
        }
        const channelsData = await channelsResponse.json();
        setChannels(channelsData);

        // Fetch direct message users
        const dmResponse = await fetch('/api/direct-messages');
        if (!dmResponse.ok) {
          throw new Error('Failed to fetch direct messages');
        }
        const dmData = await dmResponse.json();
        setDirectMessageUsers(dmData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
      {/* Home Section */}
      <div className="p-4">
        <Link 
          href="/"
          className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded mb-4"
        >
          <Home size={20} />
          <span className="font-semibold">Home</span>
        </Link>
      </div>

      {/* Channels Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Channels</h2>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-1">
          {isLoading ? (
            <div className="text-gray-400">Loading channels...</div>
          ) : channels.length > 0 ? (
            channels.map((channel) => (
              <Link
                key={channel.id}
                href={`/channels/${channel.id}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-gray-300"
              >
                <Hash size={16} />
                <span>{channel.name}</span>
              </Link>
            ))
          ) : (
            <div className="text-gray-400">No channels found</div>
          )}
        </div>
      </div>

      {/* Direct Messages Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Direct Messages</h2>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-1">
          {isLoading ? (
            <div className="text-gray-400">Loading messages...</div>
          ) : directMessageUsers.length > 0 ? (
            directMessageUsers.map((user) => (
              <Link 
                key={user.id}
                href={`/messages/${user.id}`}
                className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
              >
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <MessageSquare size={16} />
                )}
                <span className="truncate">{user.name}</span>
                {user.status && (
                  <span className="text-xs text-gray-400">• {user.status}</span>
                )}
              </Link>
            ))
          ) : (
            <div className="text-gray-400">No messages yet</div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}; 