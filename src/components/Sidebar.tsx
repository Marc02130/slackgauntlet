'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Plus, Hash, MessageSquare, MessageCircle, User, Circle } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import { UserSelectDialog } from './UserSelectDialog';
import { ChannelCreateDialog } from './ChannelCreateDialog';

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
}

interface DirectMessageUser {
  id: string;
  username: string;
  profilePicture?: string | null;
  status?: string | null;
}

export const Sidebar = () => {
  const { userId } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [directMessageUsers, setDirectMessageUsers] = useState<DirectMessageUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const [isChannelCreateOpen, setIsChannelCreateOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    status: string | null;
  } | null>(null);

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    if (userId) {
      fetchCurrentUser();
    }
  }, [userId]);

  const toggleStatus = async () => {
    if (!currentUser) return;
    
    const newStatus = currentUser.status === 'available' ? 'busy' : 'available';
    
    try {
      const response = await fetch('/api/users/me/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setCurrentUser(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <>
      <div className="w-64 bg-gray-800 text-white h-full flex flex-col">
        {/* Updated Home Section */}
        <div className="p-4 border-b border-gray-700">
          <Link 
            href="/"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded mb-2"
          >
            <Home size={20} />
            <span className="font-semibold">Home</span>
          </Link>
          
          {/* Add User Status Section */}
          <div className="flex items-center gap-2 p-2">
            <User size={20} className="text-gray-400" />
            <div className="flex-1">
              <div className="font-medium">{currentUser?.username}</div>
              <button
                onClick={toggleStatus}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
              >
                <Circle
                  size={8}
                  fill={currentUser?.status === 'available' ? '#4ade80' : '#ef4444'}
                  className={currentUser?.status === 'available' ? 'text-green-400' : 'text-red-400'}
                />
                {currentUser?.status || 'Set status'}
              </button>
            </div>
          </div>
        </div>

        {/* Add this section before the Channels section */}
        <div className="p-4">
          <Link 
            href="/threads"
            className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
          >
            <MessageCircle size={16} />
            <span>Threads</span>
          </Link>
        </div>

        {/* Channels Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Channels</h2>
            <button 
              onClick={() => setIsChannelCreateOpen(true)} 
              className="p-1 hover:bg-gray-700 rounded"
            >
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
            <button 
              onClick={() => setIsUserSelectOpen(true)} 
              className="p-1 hover:bg-gray-700 rounded"
            >
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
                      alt={user.username}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <MessageSquare size={16} />
                  )}
                  <span className="truncate">{user.username}</span>
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

      <ChannelCreateDialog 
        isOpen={isChannelCreateOpen} 
        onClose={() => setIsChannelCreateOpen(false)} 
      />
      <UserSelectDialog 
        isOpen={isUserSelectOpen} 
        onClose={() => setIsUserSelectOpen(false)} 
      />
    </>
  );
}; 