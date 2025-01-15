'use client';

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MessageInput } from "./MessageInput";
import { usePathname } from "next/navigation";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDirectMessage = pathname.startsWith('/messages/');

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 