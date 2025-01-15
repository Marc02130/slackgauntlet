import { MainLayout } from "@/components/MainLayout";
import { MessageList } from "@/components/DirectMessageList";
import { DirectMessageInput } from "@/components/DirectMessageInput";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs";

export default async function DirectMessagePage({ params }: { params: { userId: string } }) {
  const { userId: currentUserId } = auth();
  
  if (!currentUserId) {
    notFound();
  }

  const otherUser = await db.user.findUnique({
    where: { id: params.userId },
    select: { username: true }
  });

  if (!otherUser) {
    notFound();
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="border-b px-4 py-2">
          <h1 className="text-xl font-semibold">{otherUser.username}</h1>
        </div>
        <div className="flex-1 min-h-0">
          <MessageList recipientId={params.userId} />
        </div>
        <DirectMessageInput />
      </div>
    </MainLayout>
  );
} 