import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

// Use the Edge-compatible auth config (no bcrypt, no db)
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api/auth routes (handled by NextAuth)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/auth).*)',
  ],
};
