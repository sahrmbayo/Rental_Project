// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

// Define which routes are public and which are for the Dashboard
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign‑up(.*)','/api','/checkout(.*)']);
const isDashboardRoute = createRouteMatcher(['/Dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1️⃣ Redirect unauthenticated users away from protected routes
  if (!userId && !isPublicRoute(req)) {
    const sessionAuth = await auth();
    return sessionAuth.redirectToSignIn();
  }

  // 2️⃣ Handle after-login role logic
  if (userId) {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as string | undefined;

    // Admins → Dashboard
    // if (role === 'admin' && !isDashboardRoute(req)) {
    //   return NextResponse.redirect(new URL('/Dashboard', req.url));
    // }

    // Non‑admins → Home from Dashboard
    // if (role === 'user' && isDashboardRoute(req)) {
    //   return NextResponse.redirect(new URL('/', req.url));
    // }
  }

  // 3️⃣ Otherwise, allow the request to proceed
  return NextResponse.next();
}, {
  // Optional: log for debugging
  debug: process.env.NODE_ENV === 'development',
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};