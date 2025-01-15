'use client';

import { useState } from 'react';
import { Circle, MessageSquare, Bot } from 'lucide-react';

interface StatusManagerProps {
  currentStatus: string | null;
  statusMessage: string | null;
  useAIResponse: boolean;
  onUpdate: (data: {
    status: string;
    statusMessage?: string;
    useAIResponse: boolean;
  }) => void;
}

export function StatusManager({ 
  currentStatus, 
  statusMessage, 
  useAIResponse, 
  onUpdate 
}: StatusManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(statusMessage || '');
  const [useAI, setUseAI] = useState(useAIResponse);

  const handleStatusChange = async (newStatus: string) => {
    try {
      onUpdate({
        status: newStatus,
        statusMessage: message,
        useAIResponse: useAI
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating status:', error);
      // Optionally show error to user
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
      >
        <Circle
          size={8}
          fill={currentStatus === 'available' ? '#4ade80' : '#ef4444'}
          className={currentStatus === 'available' ? 'text-green-400' : 'text-red-400'}
        />
        {currentStatus || 'Set status'}
      </button>
    );
  }

  return (
    <div className="absolute z-50 bg-white rounded-lg shadow-lg p-4 w-80">
      <h3 className="font-semibold mb-4">Update Status</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusChange('available')}
            className={`flex-1 p-2 rounded ${
              currentStatus === 'available' 
                ? 'bg-green-100 text-green-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Circle size={8} className="inline mr-2 text-green-500" fill="currentColor" />
            Available
          </button>
          
          <button
            onClick={() => handleStatusChange('busy')}
            className={`flex-1 p-2 rounded ${
              currentStatus === 'busy' 
                ? 'bg-red-100 text-red-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Circle size={8} className="inline mr-2 text-red-500" fill="currentColor" />
            Busy
          </button>
        </div>

        {currentStatus === 'busy' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Away Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter custom message..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="useAI" className="flex items-center gap-2">
                <Bot size={16} />
                Use AI Response
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 