import React, { useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Popup({ isOpen, onClose, children, title }: PopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(popupRef, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div 
        ref={popupRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {title && (
          <div className="px-4 py-3 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
} 