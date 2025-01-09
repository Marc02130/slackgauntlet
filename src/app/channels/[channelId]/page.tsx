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
      <div className="flex-1 flex flex-col">
        <div className="border-b px-4 py-2">
          <h1 className="text-xl font-semibold">#{channel.name}</h1>
        </div>
        <MessageList channelId={params.channelId} />
        <MessageInput />
      </div>
    </MainLayout>
  );
} 