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
    pdf: { maxFileSize: "8MB" },
    text: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
    audio: { maxFileSize: "8MB" }
  })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),

  avatarDocument: f({
    "application/msword": { maxFileSize: "4MB" },
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "8MB" },
    text: { maxFileSize: "4MB" }
  })
    .middleware(handleAuth)
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter; 