import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db } from '@/lib/db/client';
import { users, tenants } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { DefaultSession } from 'next-auth';
import { authConfig } from './auth.config';

// Extend session type to include tenant info
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      tenantId: string;
      tenantSlug: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    tenantId: string;
    tenantSlug: string;
    role: string;
    name: string;
    email: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        tenantSlug: { label: 'Tenant', type: 'text' },
      },
      async authorize(credentials) {
        console.log('[AUTH] Login attempt:', { email: credentials?.email, tenantSlug: credentials?.tenantSlug });

        if (!credentials?.email || !credentials?.password || !credentials?.tenantSlug) {
          console.log('[AUTH] Missing credentials');
          return null;
        }

        const email = (credentials.email as string).toLowerCase();
        const password = credentials.password as string;
        const tenantSlug = credentials.tenantSlug as string;

        // Find tenant by slug
        let tenant;
        try {
          tenant = await db.query.tenants.findFirst({
            where: and(
              eq(tenants.slug, tenantSlug),
              eq(tenants.isActive, true)
            ),
          });
        } catch (dbError) {
          console.error('[AUTH] Database error finding tenant:', dbError);
          return null;
        }

        if (!tenant) {
          console.log('[AUTH] Tenant not found:', tenantSlug);
          return null;
        }
        console.log('[AUTH] Tenant found:', tenant.id);

        // Find user within tenant
        let user;
        try {
          user = await db.query.users.findFirst({
            where: and(
              eq(users.email, email),
              eq(users.tenantId, tenant.id),
              eq(users.isActive, true)
            ),
          });
        } catch (dbError) {
          console.error('[AUTH] Database error finding user:', dbError);
          return null;
        }

        if (!user || !user.passwordHash) {
          console.log('[AUTH] User not found or no password:', email);
          return null;
        }
        console.log('[AUTH] User found:', user.id);

        // Verify password
        let isValidPassword;
        try {
          isValidPassword = await compare(password, user.passwordHash);
        } catch (bcryptError) {
          console.error('[AUTH] Bcrypt error:', bcryptError);
          return null;
        }

        if (!isValidPassword) {
          console.log('[AUTH] Invalid password');
          return null;
        }
        console.log('[AUTH] Password valid, login success');

        // Return user data for session (NEVER include passwordHash)
        return {
          id: user.id,
          tenantId: tenant.id,
          tenantSlug: tenant.slug,
          role: user.role ?? 'user',
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});
