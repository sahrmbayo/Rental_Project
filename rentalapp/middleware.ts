// middleware.ts
// First line of defence only: every API route and server action also checks auth itself.
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getRole, isSuperAdmin } from './app/lib/roles';

const isSuperAdminRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)',
  '/api/agent-applications/status(.*)',
  '/api/contact/submissions(.*)',
]);

const isAgentRoute = createRouteMatcher([
  '/Dashboard(.*)',
  '/api/property',
  '/api/property/(.*)',
  '/api/upload(.*)',
  '/api/agent-phone(.*)',
  '/api/dashboard-stats(.*)',
]);

// Public for reading only; writes still need an agent.
const isPublicReadRoute = createRouteMatcher(['/api/properties(.*)']);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/properties(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/apply-as-agent(.*)',
  '/terms-of-service(.*)',
  '/privacy-policy(.*)',
  '/checkout/cancelled(.*)',
  '/sitemap.xml',
  '/robots.txt',
  '/api/total-props',
  '/api/payment(.*)',
  '/api/contact',
  '/api/agent-applications',
]);

function deny(req: Request, status: 401 | 403) {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/')) {
    return NextResponse.json({ message: status === 401 ? 'Unauthorized' : 'Forbidden' }, { status });
  }
  return NextResponse.redirect(new URL('/', req.url));
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  const needsSignIn = () =>
    req.nextUrl.pathname.startsWith('/api/') ? deny(req, 401) : redirectToSignIn({ returnBackUrl: req.url });

  if (isSuperAdminRoute(req)) {
    if (!userId) return needsSignIn();
    if (!isSuperAdmin(userId)) return deny(req, 403);
    return NextResponse.next();
  }

  const isWriteToPublicRead = isPublicReadRoute(req) && req.method !== 'GET' && req.method !== 'HEAD';

  if (isAgentRoute(req) || isWriteToPublicRead) {
    if (!userId) return needsSignIn();
    if (isSuperAdmin(userId) && isWriteToPublicRead) return NextResponse.next();
    if ((await getRole(userId, sessionClaims)) !== 'admin') return deny(req, 403);
    return NextResponse.next();
  }

  if (isPublicRoute(req) || isPublicReadRoute(req)) return NextResponse.next();

  if (!userId) return needsSignIn();
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
