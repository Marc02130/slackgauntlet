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

    // Return default settings if none exist
    return NextResponse.json(settings || {
      userId: dbUser.id,
      proofingMode: "none",
      autoAcceptChanges: false,
      checkGrammar: true,
      checkTone: true,
      checkClarity: true,
      checkSensitivity: true,
      preferredTone: "professional",
      formality: 5
    });
  } catch (error) {
    console.error('Error in GET /api/users/me/proofing-settings:', error);
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
    
    // Validate proofingMode
    if (!['after', 'none'].includes(settings.proofingMode)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid proofing mode" }), 
        { status: 400 }
      );
    }

    // Create the settings data object
    const settingsData = {
      proofingMode: settings.proofingMode,
      autoAcceptChanges: Boolean(settings.autoAcceptChanges),
      checkGrammar: Boolean(settings.checkGrammar),
      checkTone: Boolean(settings.checkTone),
      checkClarity: Boolean(settings.checkClarity),
      checkSensitivity: Boolean(settings.checkSensitivity),
      preferredTone: settings.preferredTone || 'professional',
      formality: Number(settings.formality) || 5
    };

    const updatedSettings = await db.aIProofingSettings.upsert({
      where: {
        userId: dbUser.id
      },
      create: {
        userId: dbUser.id,
        ...settingsData
      },
      update: settingsData
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