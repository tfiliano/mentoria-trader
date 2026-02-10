import type { NextAuthConfig } from 'next-auth';

// This config is Edge-compatible (no bcrypt, no db imports)
export const authConfig: NextAuthConfig = {
  trustHost: true, // Required for Vercel deployment
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');
      const isPublicPath = ['/', '/login', '/register', '/forgot-password', '/terms', '/privacy'].includes(nextUrl.pathname);

      if (isOnDashboard || isOnOnboarding) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      }

      if (isPublicPath) {
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.tenantId = token.tenantId as string;
        session.user.tenantSlug = token.tenantSlug as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Providers are added in config.ts (server-only)
};
