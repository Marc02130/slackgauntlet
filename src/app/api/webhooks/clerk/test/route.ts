import { NextResponse } from "next/server";

export async function GET() {
  console.log("Webhook test endpoint called");
  return NextResponse.json({ 
    status: "Webhook endpoint is accessible",
    timestamp: new Date().toISOString()
  });
} 