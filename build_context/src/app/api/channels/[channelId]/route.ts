import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, userIds } = await req.json();

    const channel = await db.channel.update({
      where: { id: params.channelId },
      data: {
        name: name,
        users: {
          deleteMany: {},
          create: userIds.map((userId: string) => ({
            userId: userId
          }))
        }
      }
    });

    return NextResponse.json(channel);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
} 