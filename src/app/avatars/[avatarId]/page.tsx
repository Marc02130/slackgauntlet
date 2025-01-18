import { MainLayout } from "@/components/MainLayout";
import { AvatarChat } from "@/components/AvatarChat";
import { Bot } from 'lucide-react';
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function AvatarChatPage({ 
  params 
}: { 
  params: { avatarId: string } 
}) {
  const avatar = await db.avatar.findUnique({
    where: { id: params.avatarId },
    select: { name: true }
  });

  if (!avatar) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="border-b px-4 py-2">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Bot size={20} />
            {avatar.name}
          </h1>
        </div>
        <div className="flex-1 min-h-0">
          <AvatarChat avatarId={params.avatarId} />
        </div>
      </div>
    </MainLayout>
  );
} 