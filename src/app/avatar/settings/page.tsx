import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { AvatarConfig } from "@/components/AvatarConfig";
import { MainLayout } from "@/components/MainLayout";
import { logger } from "@/lib/utils/logger";

export default async function AvatarSettingsPage() {
  const { userId } = auth();
  const user = await currentUser();
  
  if (!userId || !user) {
    redirect('/sign-in');
  }

  try {
    // Find user by email first, then by Clerk ID
    const dbUser = await db.user.findFirst({
      where: {
        email: user.emailAddresses[0].emailAddress
      }
    });

    if (!dbUser) {
      logger.error('Avatar settings', 'User not found', { 
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress 
      });
      throw new Error("User not found");
    }

    // Get avatar
    const avatar = await db.avatar.findFirst({
      where: {
        userId: dbUser.id
      }
    });

    logger.info('Avatar settings', 'Avatar lookup result', { 
      userId: dbUser.id,
      avatarFound: !!avatar 
    });

    return (
      <MainLayout>
        <AvatarConfig avatarId={avatar?.id} />
      </MainLayout>
    );
  } catch (error) {
    logger.error('Avatar settings', 'Failed to load avatar', { error });
    throw error;
  }
} 