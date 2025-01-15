import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks/clerk",
    "/sign-in",
    "/sign-up",
    "/api/uploadthing",
  ],
  ignoredRoutes: [
    "/api/webhooks/(.*)",
    "/api/uploadthing/(.*)",
    "/_next/static/(.*)",
    "/favicon.ico",
  ],
  // Add custom afterAuth handler
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};