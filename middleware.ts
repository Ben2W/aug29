import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
const isDashboardAuthRoute = createRouteMatcher([
  "/dashboard/sign-in(.*)",
  "/dashboard/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req) && !isDashboardAuthRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|.*\\..*).*)",
    // Always run for API routes
    "/api/:path*",
  ],
};
