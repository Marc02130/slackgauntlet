import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function isAdmin() {
  const { userId } = auth();
  
  if (!userId) return false;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      userRole: true
    }
  });

  return user?.userRole === "ADMIN";
}

export async function getCurrentUser() {
  const { userId } = auth();
  
  if (!userId) return null;

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      userRole: true,
      profilePicture: true,
      status: true
    }
  });

  return user;
} 