'use client';

import { useRef, useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Change {
  type: 'addition' | 'deletion' | 'modification';
  original: string;
  suggested: string;
  position: [number, number];
}

interface MessageProofingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  original: string;
  suggested: string;
  changes: Change[];
  onAccept: (content: string) => void;
  onReject: () => void;
}

export function MessageProofingDialog({
  isOpen,
  onClose,
  original,
  suggested,
  changes,
  onAccept,
  onReject,
}: MessageProofingDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [editedContent, setEditedContent] = useState(suggested);
  useClickOutside(dialogRef, onClose);

  useEffect(() => {
    setEditedContent(suggested);
  }, [suggested]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl"
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Review Changes</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Original Message */}
          <div>
            <h3 className="font-medium mb-2">Original Message:</h3>
            <div className="p-3 bg-gray-50 rounded-md">
              {original}
            </div>
          </div>

          {/* Editable Suggested Message */}
          <div>
            <h3 className="font-medium mb-2">Suggested Message:</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 border rounded-md min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Edit suggested message here..."
            />
          </div>

          {/* Detailed Changes - Only this section scrolls */}
          <div>
            <h3 className="font-medium mb-2">Detailed Changes:</h3>
            <div className="border rounded-md">
              <div className="max-h-[200px] overflow-y-auto p-3 space-y-2">
                {changes.map((change, i) => (
                  <div key={i} className="flex gap-2 items-start p-2 hover:bg-gray-50 rounded">
                    <span className={`px-2 py-1 rounded text-xs ${
                      change.type === 'addition' ? 'bg-green-100 text-green-800' :
                      change.type === 'deletion' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {change.type}
                    </span>
                    <div className="flex-1 text-sm">
                      {change.original && (
                        <div className="bg-red-50 p-2 rounded mb-1">
                          {change.original}
                        </div>
                      )}
                      {change.suggested && (
                        <div className="bg-green-50 p-2 rounded">
                          {change.suggested}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onReject}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Keep Original
          </button>
          <button
            onClick={() => onAccept(editedContent)}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md"
          >
            Accept Changes
          </button>
        </div>
      </div>
    </div>
  );
} 