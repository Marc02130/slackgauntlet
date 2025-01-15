'use client';

import { Search } from 'lucide-react';
import { useState, forwardRef, useImperativeHandle } from 'react';

export interface ChannelSearchRef {
  clearSearch: () => void;
}

interface ChannelSearchProps {
  onSearch: (term: string) => void;
}

export const ChannelSearch = forwardRef<ChannelSearchRef, ChannelSearchProps>(
  ({ onSearch }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');

    useImperativeHandle(ref, () => ({
      clearSearch: () => setSearchTerm('')
    }));

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);
      onSearch(term);
    };

    return (
      <div className="px-4 py-2 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search channel messages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    );
  }
);

ChannelSearch.displayName = 'ChannelSearch'; 