import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { logger } from '@/lib/utils/logger';

// Add type guard
function isUserEvent(data: any): data is { 
  id: string;
  email_addresses: Array<{ email_address: string }>;
  username?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  profile_image_url?: string;
} {
  return 'email_addresses' in data && Array.isArray(data.email_addresses);
}

export async function POST(req: Request) {
  try {
    // Get the webhook secret from environment variables
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      logger.error('Clerk webhook', 'Missing webhook secret');
      return new Response('Missing webhook secret', { status: 400 });
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // Validate headers
    if (!svix_id || !svix_timestamp || !svix_signature) {
      logger.error('Clerk webhook', 'Missing svix headers');
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
      logger.error('Clerk webhook', 'Invalid signature', { error: err });
      return new Response('Invalid signature', { status: 400 });
    }

    const eventType = evt.type;
    const data = evt.data;

    if (!isUserEvent(data)) {
      logger.error('Clerk webhook', 'Invalid user data');
      return new Response('Invalid user data', { status: 400 });
    }

    // Now TypeScript knows data has the correct shape
    const userData = data;

    logger.info('Clerk webhook', `Processing ${eventType} event`, { userId: userData.id });

    if (eventType === 'user.created') {
      // Safely extract user data with fallbacks
      const email = userData.email_addresses?.[0]?.email_address;
      if (!email) {
        logger.error('Clerk webhook', 'No email found in user data');
        return new Response('Invalid user data', { status: 400 });
      }

      try {
        await db.user.create({
          data: {
            id: userData.id,
            email: email,
            username: userData.username || `user${userData.id.slice(0, 8)}`,
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            profilePicture: userData.image_url || userData.profile_image_url || '',
            userRole: "USER"
          }
        });
        
        logger.info('Clerk webhook', 'User created successfully', { userId: userData.id });
      } catch (dbError) {
        logger.error('Clerk webhook', 'Database error', { error: dbError, userId: userData.id });
        return new Response('Database error', { status: 500 });
      }
    } else if (eventType === 'user.updated') {
      try {
        await db.user.update({
          where: { id: userData.id },
          data: {
            email: userData.email_addresses?.[0]?.email_address,
            username: userData.username || `user${userData.id.slice(0, 8)}`,
            firstName: userData.first_name || '',
            lastName: userData.last_name || '',
            profilePicture: userData.image_url || userData.profile_image_url || ''
          }
        });
        
        logger.info('Clerk webhook', 'User updated successfully', { userId: userData.id });
      } catch (dbError) {
        logger.error('Clerk webhook', 'Database error', { error: dbError, userId: userData.id });
        return new Response('Database error', { status: 500 });
      }
    }

    return new Response('Success', { status: 200 });
  } catch (error) {
    logger.error('Clerk webhook', 'Unexpected error', { error });
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 