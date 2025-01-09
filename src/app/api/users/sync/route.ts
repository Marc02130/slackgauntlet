import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check existing user
    const existingUser = await db.user.findFirst({
      where: {
        email: user.emailAddresses[0].emailAddress
      }
    });

    // Create or update user in our database
    const dbUser = await db.user.upsert({
      where: { 
        id: existingUser?.id || userId 
      },
      create: {
        id: existingUser?.id || userId,
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        userRole: "USER",
        profilePicture: user.imageUrl,
      },
      update: {
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        profilePicture: user.imageUrl,
      },
    });

    return NextResponse.json(dbUser);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 