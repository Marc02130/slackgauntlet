import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: process.env.UPLOADTHING_APP_ID,
    uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
}); 