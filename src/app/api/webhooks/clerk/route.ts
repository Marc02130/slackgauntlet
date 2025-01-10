import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      return new Response('Missing webhook secret', { status: 400 });
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Missing svix headers', { status: 400 });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      return new Response('Invalid signature', { status: 400 });
    }

    const userData = payload.data;

    if (evt.type === 'user.created') {
      await db.user.create({
        data: {
          id: userData.id,
          email: userData.email_addresses[0].email_address,
          username: userData.username || `user${userData.id.slice(0, 8)}`,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          profilePicture: userData.profile_image_url || userData.image_url,
          userRole: "USER"
        }
      });
    } else if (evt.type === 'user.updated') {
      await db.user.update({
        where: { id: userData.id },
        data: {
          email: userData.email_addresses[0].email_address,
          username: userData.username || `user${userData.id.slice(0, 8)}`,
          firstName: userData.first_name || '',
          lastName: userData.last_name || '',
          profilePicture: userData.profile_image_url || userData.image_url
        }
      });
    }

    return new Response('Success', { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
} 