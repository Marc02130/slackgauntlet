import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const document = await db.avatarDocument.findUnique({
      where: { id: params.documentId },
      include: { avatar: true }
    });

    if (!document) return new NextResponse("Document not found", { status: 404 });
    if (document.avatar.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await db.avatarDocument.delete({
      where: { id: params.documentId }
    });

    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('[AVATAR_DOCUMENT_DELETE]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 