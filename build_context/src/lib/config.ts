export const config = {
  database: {
    url: process.env.DATABASE_URL,
  },
  clerk: {
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  },
  uploadthing: {
    secret: process.env.UPLOADTHING_SECRET,
    appId: process.env.UPLOADTHING_APP_ID,
  }
}; 