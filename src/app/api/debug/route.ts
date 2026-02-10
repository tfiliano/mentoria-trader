import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { tenants, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { compare } from 'bcryptjs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const password = searchParams.get('password');

  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasAuthUrl: !!process.env.AUTH_URL,
      authUrl: process.env.AUTH_URL,
    },
  };

  // Test database connection
  try {
    const tenant = await db.query.tenants.findFirst({
      where: eq(tenants.slug, 'mrthiagofx'),
    });
    checks.database = {
      connected: true,
      tenantFound: !!tenant,
      tenantId: tenant?.id,
      tenantActive: tenant?.isActive,
    };

    // Check user if email provided
    if (email && tenant) {
      const user = await db.query.users.findFirst({
        where: and(
          eq(users.email, email.toLowerCase()),
          eq(users.tenantId, tenant.id)
        ),
      });
      checks.user = {
        found: !!user,
        id: user?.id,
        email: user?.email,
        isActive: user?.isActive,
        hasPassword: !!user?.passwordHash,
        role: user?.role,
      };

      // Test password if provided
      if (password && user?.passwordHash) {
        try {
          const isValid = await compare(password, user.passwordHash);
          checks.passwordTest = {
            tested: true,
            isValid,
          };
        } catch (e) {
          checks.passwordTest = {
            tested: false,
            error: e instanceof Error ? e.message : String(e),
          };
        }
      }
    }
  } catch (error) {
    checks.database = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return NextResponse.json(checks);
}
