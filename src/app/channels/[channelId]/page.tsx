import { MainLayout } from "@/components/MainLayout";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ChannelPage({ params }: { params: { channelId: string } }) {
  const channel = await db.channel.findUnique({
    where: { id: params.channelId },
    select: { name: true }
  });

  if (!channel) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="border-b px-4 py-2">
          <h1 className="text-xl font-semibold">#{channel.name}</h1>
        </div>
        <div className="flex-1 min-h-0">
          <MessageList channelId={params.channelId} />
        </div>
        <MessageInput />
      </div>
    </MainLayout>
  );
} 