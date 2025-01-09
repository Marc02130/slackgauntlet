import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
) {
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

    // Check if user is a member of the channel
    const membership = await db.channelUser.findFirst({
      where: {
        channelId: params.channelId,
        userId: dbUser.id
      }
    });

    if (!membership) {
      return new NextResponse("Not a member of this channel", { status: 403 });
    }

    const messages = await db.message.findMany({
      where: {
        channelId: params.channelId,
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { content, fileUrls } = await req.json();

    if (!content?.trim() && (!fileUrls || fileUrls.length === 0)) {
      return new NextResponse("Message content or files are required", { status: 400 });
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

    // Check if user is a member of the channel
    const membership = await db.channelUser.findFirst({
      where: {
        channelId: params.channelId,
        userId: dbUser.id
      }
    });

    if (!membership) {
      return new NextResponse("Not a member of this channel", { status: 403 });
    }

    // Create message first
    const message = await db.message.create({
      data: {
        content: content || '',
        channelId: params.channelId,
        userId: dbUser.id,
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
    return new NextResponse(
      error instanceof Error ? error.message : "Internal Error", 
      { status: 500 }
    );
  }
} 