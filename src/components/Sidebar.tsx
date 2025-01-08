'use client';

import Link from "next/link";
import { Home, Plus, Hash } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 h-full flex flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Workspaces</h2>
          <button className="p-1 hover:bg-gray-200 rounded">
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-2">
          <Link 
            href="/"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Channels</h2>
          <button className="p-1 hover:bg-gray-200 rounded">
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-2">
          <Link 
            href="/channels/general"
            className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded"
          >
            <Hash size={20} />
            <span>general</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 