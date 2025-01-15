import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    const clerkUser = await currentUser();

    if (!userId || !clerkUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USERS_ME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 