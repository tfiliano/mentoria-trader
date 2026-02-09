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
        const tenant = await db.query.tenants.findFirst({
          where: and(
            eq(tenants.slug, tenantSlug),
            eq(tenants.isActive, true)
          ),
        });

        if (!tenant) {
          console.log('[AUTH] Tenant not found:', tenantSlug);
          return null;
        }
        console.log('[AUTH] Tenant found:', tenant.id);

        // Find user within tenant
        const user = await db.query.users.findFirst({
          where: and(
            eq(users.email, email),
            eq(users.tenantId, tenant.id),
            eq(users.isActive, true)
          ),
        });

        if (!user || !user.passwordHash) {
          console.log('[AUTH] User not found or no password:', email);
          return null;
        }
        console.log('[AUTH] User found:', user.id);

        // Verify password
        const isValidPassword = await compare(password, user.passwordHash);
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
