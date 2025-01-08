import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/MainLayout";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to SlackGauntlet</h1>
        <p>Select a workspace or channel to get started.</p>
      </div>
    </MainLayout>
  );
} 