import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
 
const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = auth();
  if (!userId && !process.env.UPLOADTHING_SECRET) {
    throw new Error("Unauthorized");
  }
  return { userId };
};
 
export const ourFileRouter = {
  messageAttachment: f({
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "4MB" },
    text: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
    audio: { maxFileSize: "8MB" },
  })
    .middleware(async ({ req }) => {
      const auth = await handleAuth();
      if (req.headers.get("x-uploadthing-webhook")) {
        return { userId: "webhook" };
      }
      return auth;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter; 