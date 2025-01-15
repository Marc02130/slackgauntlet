import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function isAdmin() {
  const { userId } = auth();
  const clerkUser = await currentUser();
  
  if (!userId || !clerkUser) return false;

  const user = await db.user.findFirst({
    where: {
      OR: [
        { id: userId },
        { email: clerkUser.emailAddresses[0].emailAddress }
      ]
    },
    select: {
      id: true,
      userRole: true
    }
  });

  return user?.userRole === "ADMIN";
}

export async function getCurrentUser() {
  const { userId } = auth();
  const clerkUser = await currentUser();
  
  if (!userId || !clerkUser) return null;

  const user = await db.user.findFirst({
    where: {
      OR: [
        { id: userId },
        { email: clerkUser.emailAddresses[0].emailAddress }
      ]
    },
    select: {
      id: true,
      username: true,
      email: true,
      userRole: true,
      profilePicture: true,
      status: true,
      firstName: true,
      lastName: true
    }
  });

  return user;
} 