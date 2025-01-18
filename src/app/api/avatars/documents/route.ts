import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils/logger";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { avatarId, documents } = await req.json();
    logger.info('Document creation', 'Received documents:', { documents });

    if (!documents?.length) {
      return new NextResponse("No documents provided", { status: 400 });
    }

    // Helper function to get MIME type from file name
    const getMimeType = (fileName: string): string => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      const mimeTypes: Record<string, string> = {
        'txt': 'text/plain',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // Add more mime types as needed
      };
      return mimeTypes[ext || ''] || 'application/octet-stream';
    };

    // Create documents with mime type
    const createdDocuments = await db.avatarDocument.createMany({
      data: documents.map((doc: { name: string; fileUrl: string }) => ({
        avatarId,
        name: doc.name,
        fileUrl: doc.fileUrl,
        mimeType: getMimeType(doc.name),
        content: '', // Initial empty content
        vectorId: 'pending'
      }))
    });

    // Get the updated avatar with documents
    const updatedAvatar = await db.avatar.findUnique({
      where: { id: avatarId },
      include: { documents: true }
    });

    return NextResponse.json(updatedAvatar);
  } catch (error) {
    logger.error('Document creation', error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create documents" }), 
      { status: 500 }
    );
  }
} 