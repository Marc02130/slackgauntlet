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

    const settings = await db.aIProofingSettings.findUnique({
      where: {
        userId: dbUser.id
      }
    });

    return NextResponse.json({
      id: settings?.id,
      userId: dbUser.id,
      proofBeforeSend: settings?.proofBeforeSend ?? false,
      proofAfterSend: settings?.proofAfterSend ?? false,
      autoAcceptChanges: settings?.autoAcceptChanges ?? false,
      checkGrammar: settings?.checkGrammar ?? true,
      checkTone: settings?.checkTone ?? true,
      checkClarity: settings?.checkClarity ?? true,
      checkSensitivity: settings?.checkSensitivity ?? true,
      preferredTone: settings?.preferredTone ?? 'professional',
      formality: settings?.formality ?? 5,
      createdAt: settings?.createdAt ?? new Date(),
      updatedAt: settings?.updatedAt ?? new Date()
    });
  } catch (error) {
    console.error('Error in GET /api/users/me/proofing-settings:', error);
    if (error?.code === 'P2021') {
      return new NextResponse(
        JSON.stringify({
          error: "Database setup required. Please run migrations.",
          details: error.message
        }),
        { status: 500 }
      );
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
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

    const settings = await req.json();
    console.log('Updating settings for user:', dbUser.id, settings);

    const updatedSettings = await db.aIProofingSettings.upsert({
      where: {
        userId: dbUser.id
      },
      create: {
        userId: dbUser.id,
        ...settings
      },
      update: settings
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating proofing settings:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to update settings",
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
} 