import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";
 
const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");
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
    .middleware(async () => {
      const auth = await handleAuth();
      return auth;
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter; 