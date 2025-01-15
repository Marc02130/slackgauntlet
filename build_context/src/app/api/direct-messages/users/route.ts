import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get all users except the current user
    const users = await db.user.findMany({
      where: {
        NOT: {
          id: dbUser.id
        }
      },
      select: {
        id: true,
        username: true,
        profilePicture: true
      },
      orderBy: {
        username: 'asc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 