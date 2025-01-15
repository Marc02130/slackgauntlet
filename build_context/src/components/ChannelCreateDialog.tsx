'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface User {
  id: string;
  username: string;
  profilePicture?: string | null;
}

interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount?: number;
  creatorId?: string;
  users?: User[];
}

interface ChannelCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'join' | 'create' | 'edit';

export function ChannelCreateDialog({ isOpen, onClose }: ChannelCreateDialogProps) {
  const [activeTab, setActiveTab] = useState<Tab>('join');
  const [availableChannels, setAvailableChannels] = useState<Channel[]>([]);
  const [myChannels, setMyChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [channelName, setChannelName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [channelsRes, myChannelsRes, usersRes] = await Promise.all([
          fetch('/api/channels/available'),
          fetch('/api/channels/my'),
          fetch('/api/users')
        ]);

        if (!channelsRes.ok || !myChannelsRes.ok || !usersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [channelsData, myChannelsData, usersData] = await Promise.all([
          channelsRes.json(),
          myChannelsRes.json(),
          usersRes.json()
        ]);
        
        setAvailableChannels(channelsData);
        setMyChannels(myChannelsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleChannelSelect = async (channel: Channel) => {
    setSelectedChannel(channel);
    const response = await fetch(`/api/channels/${channel.id}/users`);
    if (response.ok) {
      const users = await response.json();
      setSelectedUsers(users.map((u: User) => u.id));
    }
  };

  const handleUpdateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;

    try {
      setError('');
      const response = await fetch(`/api/channels/${selectedChannel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: channelName.trim() || selectedChannel.name,
          userIds: selectedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update channel');
      }

      router.refresh();
      onClose();
    } catch (error) {
      setError('Failed to update channel');
    }
  };

  const handleJoinChannel = async (channelId: string) => {
    try {
      const response = await fetch(`/api/channels/${channelId}/join`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to join channel');

      router.refresh();
      router.push(`/channels/${channelId}`);
      onClose();
    } catch (error) {
      setError('Failed to join channel');
    }
  };

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    try {
      setError('');
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: channelName.trim(),
          userIds: [...selectedUsers, users[0]?.id], // Include current user
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create channel');
      }

      const channel = await response.json();
      router.refresh();
      router.push(`/channels/${channel.id}`);
      onClose();
    } catch (error) {
      setError('Failed to create channel');
    }
  };

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Channels</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 p-2 text-center ${
              activeTab === 'join' ? 'border-b-2 border-blue-500' : ''
            }`}
          >
            Join Channel
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 p-2 text-center ${
              activeTab === 'create' ? 'border-b-2 border-blue-500' : ''
            }`}
          >
            Create Channel
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 p-2 text-center ${
              activeTab === 'edit' ? 'border-b-2 border-blue-500' : ''
            }`}
          >
            Edit Channel
          </button>
        </div>

        {activeTab === 'edit' ? (
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center text-gray-500">Loading channels...</div>
            ) : myChannels.length === 0 ? (
              <div className="text-center text-gray-500">No channels to edit</div>
            ) : (
              <div className="space-y-4">
                {!selectedChannel ? (
                  // Channel selection view
                  <div className="space-y-2">
                    {myChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelSelect(channel)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-md border"
                      >
                        #{channel.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  // Channel editing view
                  <form onSubmit={handleUpdateChannel} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Channel Name
                      </label>
                      <input
                        type="text"
                        value={channelName || selectedChannel.name}
                        onChange={(e) => setChannelName(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Members
                      </label>
                      <div className="space-y-2">
                        {users.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => {
                                setSelectedUsers(prev =>
                                  prev.includes(user.id)
                                    ? prev.filter(id => id !== user.id)
                                    : [...prev, user.id]
                                );
                              }}
                              className="rounded border-gray-300"
                            />
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={user.username}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                {user.username[0]}
                              </div>
                            )}
                            <span>{user.username}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedChannel(null)}
                        className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Update Channel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            {activeTab === 'join' ? (
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="text-center text-gray-500">Loading channels...</div>
                ) : availableChannels.length === 0 ? (
                  <div className="text-center text-gray-500">No channels available to join</div>
                ) : (
                  <div className="space-y-2">
                    {availableChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => handleJoinChannel(channel.id)}
                        className="w-full text-left p-3 hover:bg-gray-50 rounded-md border flex items-center justify-between"
                      >
                        <span>#{channel.name}</span>
                        <span className="text-sm text-blue-500">Join</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleCreateChannel} className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="Enter channel name"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Members
                  </label>
                  {isLoading ? (
                    <div className="text-center text-gray-500">Loading users...</div>
                  ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                  ) : (
                    <div className="space-y-2">
                      {users.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => toggleUser(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.username}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                              {user.username[0]}
                            </div>
                          )}
                          <span className="flex-1">{user.username}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <button
                    type="submit"
                    disabled={!channelName.trim() || selectedUsers.length === 0}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Channel
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 border-t">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 