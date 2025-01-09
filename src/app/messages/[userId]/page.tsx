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
      <div className="flex-1 flex flex-col">
        <div className="border-b px-4 py-2">
          <h1 className="text-xl font-semibold">{otherUser.username}</h1>
        </div>
        <MessageList recipientId={params.userId} />
        <DirectMessageInput />
      </div>
    </MainLayout>
  );
} 