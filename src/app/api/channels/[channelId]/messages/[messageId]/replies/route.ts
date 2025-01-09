import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string; messageId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const replies = await db.message.findMany({
      where: {
        parentId: params.messageId,
        channelId: params.channelId,
      },
      include: {
        user: {
          select: {
            username: true,
            profilePicture: true,
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(replies);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { channelId: string; messageId: string } }
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

    // Create reply and update parent message reply count
    const [reply] = await db.$transaction([
      db.message.create({
        data: {
          content: content || '',
          userId: dbUser.id,
          channelId: params.channelId,
          parentId: params.messageId,
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
              username: true,
              profilePicture: true,
            }
          },
          files: true
        }
      }),
      db.message.update({
        where: { id: params.messageId },
        data: { replyCount: { increment: 1 } }
      })
    ]);

    return NextResponse.json(reply);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 