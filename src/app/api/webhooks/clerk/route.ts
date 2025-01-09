import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the event
  const eventType = evt.type;
  console.log('Webhook event type:', eventType);
  console.log('Webhook event data:', evt.data);

  if (eventType === 'user.created' || eventType === 'user.updated') {
    try {
      await db.user.upsert({
        where: { id: evt.data.id },
        create: {
          id: evt.data.id,
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username || `user${evt.data.id.slice(0, 8)}`,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          userRole: "USER",
          profilePicture: evt.data.image_url,
        },
        update: {
          email: evt.data.email_addresses[0].email_address,
          username: evt.data.username,
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          profilePicture: evt.data.image_url,
        },
      });
      console.log('User upserted successfully');
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    }
  }

  return NextResponse.json({ success: true });
} 