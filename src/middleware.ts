import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth/config';

// Paths that don't require authentication
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/terms',
  '/privacy',
  '/api/auth',
];

/**
 * Extract tenant from request
 * Priority: subdomain > custom domain header > path
 */
async function getTenantFromRequest(request: NextRequest): Promise<string | null> {
  const host = request.headers.get('host') || '';

  // Check for custom domain header (set by Vercel/proxy)
  const customDomain = request.headers.get('x-custom-domain');
  if (customDomain) {
    return customDomain;
  }

  // Check subdomain (e.g., acme.mentora.ai)
  const subdomain = host.split('.')[0];

  // Skip common subdomains that aren't tenants
  if (['www', 'app', 'api', 'localhost'].includes(subdomain)) {
    return null;
  }

  // If subdomain looks like a tenant slug, return it
  if (subdomain && subdomain !== host.split(':')[0]) {
    return subdomain;
  }

  return null;
}

export default auth((request) => {
  const { pathname } = request.nextUrl;

  // Allow static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For auth API routes, always allow
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If not public and not authenticated, redirect to login
  if (!isPublicPath && !request.auth) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated and trying to access login/register, redirect to dashboard
  if (request.auth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Add pathname header for layout checks
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
