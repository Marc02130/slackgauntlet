import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    const user = await currentUser();

    if (!currentUserId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: currentUserId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const messages = await db.message.findMany({
      where: {
        OR: [
          {
            userId: dbUser.id,
            recipientId: params.userId
          },
          {
            userId: params.userId,
            recipientId: dbUser.id
          }
        ]
      },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          }
        },
        files: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    const user = await currentUser();

    if (!currentUserId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, fileUrls } = await req.json();

    if (!content?.trim() && (!fileUrls || fileUrls.length === 0)) {
      return new NextResponse("Message content or files are required", { status: 400 });
    }

    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: currentUserId },
          { email: user.emailAddresses[0].emailAddress }
        ]
      }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create message with files
    const message = await db.message.create({
      data: {
        content: content || '',
        userId: dbUser.id,
        recipientId: params.userId,
        files: {
          create: fileUrls?.map((url: string) => ({
            url,
            fileType: url.split('.').pop() || 'unknown'
          })) || []
        }
      },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          }
        },
        files: true
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[MESSAGES_POST]", error);
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
} 