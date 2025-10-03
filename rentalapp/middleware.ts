// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

const SUPER_ADMIN_ID = process.env.SBM; // Your Clerk user ID

// Define route patterns
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/properties(.*)',
  '/api/total-props',
  '/api/create-checkout',
  '/api/properties',
  '/checkout(.*)',
  '/contact(.*)',
  '/api/contact(.*)'
]);

const isDashboardRoute = createRouteMatcher([
  '/Dashboard(.*)',
  '/api/property(.*)',
  '/api/properties/(.*)',
  '/api/agent(.*)',
  '/api/dashboard-stats',
  '/api/upload'
]);

const isSuperAdminRoute = createRouteMatcher([
  '/admin(.*)', // Super admin only
  '/api/admin(.*)' // Super admin API only
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1️⃣ Redirect unauthenticated users
  if (!userId && !isPublicRoute(req)) {
    const sessionAuth = await auth();
    return sessionAuth.redirectToSignIn();
  }

  // 2️⃣ Handle super admin routes (only for you)
  if (userId && isSuperAdminRoute(req)) {
    if (userId !== SUPER_ADMIN_ID) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    // You're the super admin, allow access
    return NextResponse.next();
  }

  // 3️⃣ Handle regular admin dashboard
  if (userId && isDashboardRoute(req)) {
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata.role as string | undefined;
    
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // 4️⃣ Otherwise, allow the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};