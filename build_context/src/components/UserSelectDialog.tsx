'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface User {
  id: string;
  username: string;
  profilePicture?: string | null;
}

interface UserSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserSelectDialog({ isOpen, onClose }: UserSelectDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/direct-messages/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const handleUserSelect = (userId: string) => {
    router.push(`/messages/${userId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center text-gray-500">No users found</div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md transition"
                >
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
                  <span className="flex-1 text-left">{user.username}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 