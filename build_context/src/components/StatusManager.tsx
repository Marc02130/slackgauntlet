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
    <div className="absolute z-50 bg-gray-800 rounded-lg shadow-lg p-4 w-80">
      <h3 className="font-semibold mb-4 text-white">Update Status</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusChange('available')}
            className={`flex-1 p-2 rounded ${
              currentStatus === 'available' 
                ? 'bg-green-700 text-white' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            <Circle size={8} className="inline mr-2 text-green-500" fill="currentColor" />
            Available
          </button>
          
          <button
            onClick={() => handleStatusChange('busy')}
            className={`flex-1 p-2 rounded ${
              currentStatus === 'busy' 
                ? 'bg-red-700 text-white' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            <Circle size={8} className="inline mr-2 text-red-500" fill="currentColor" />
            Busy
          </button>
        </div>

        {currentStatus === 'busy' && (
          <>
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Away Message
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter custom message..."
              />
            </div>

            <div className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                id="useAI"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
              />
              <label htmlFor="useAI" className="flex items-center gap-2">
                <Bot size={16} />
                Use AI Response
              </label>
            </div>

            <button
              onClick={() => handleStatusChange('busy')}
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
} 