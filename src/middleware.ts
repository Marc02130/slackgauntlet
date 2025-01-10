import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks/clerk",
    "/api/webhooks/clerk/test",
    "/sign-in",
    "/sign-up",
    "/api/uploadthing"
  ],
  ignoredRoutes: [
    "/api/webhooks/clerk",
    "/api/webhooks/clerk/(.*)"
  ]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 