import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';
import { tenants } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
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
  } catch (error) {
    checks.database = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  return NextResponse.json(checks);
}
