import { db } from '../client';
import { tenants, users, userProgress } from '../schema';
import { eq, and, count } from 'drizzle-orm';
import { toTenantPublicDTO, type TenantPublicDTO, type TenantAdminDTO } from '@/lib/utils/dto';

/**
 * Get tenant by slug (public info only)
 */
export async function getTenantBySlug(slug: string): Promise<TenantPublicDTO | null> {
  const tenant = await db.query.tenants.findFirst({
    where: and(eq(tenants.slug, slug), eq(tenants.isActive, true)),
    columns: {
      name: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
    },
  });

  if (!tenant) return null;
  return toTenantPublicDTO(tenant);
}

/**
 * Get tenant by custom domain
 */
export async function getTenantByDomain(domain: string): Promise<TenantPublicDTO | null> {
  const tenant = await db.query.tenants.findFirst({
    where: and(eq(tenants.customDomain, domain), eq(tenants.isActive, true)),
    columns: {
      name: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
    },
  });

  if (!tenant) return null;
  return toTenantPublicDTO(tenant);
}

/**
 * Get full tenant info (for admin panel)
 * Only returns data for the specified tenant ID
 */
export async function getTenantAdmin(tenantId: string): Promise<TenantAdminDTO | null> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: {
      id: true,
      slug: true,
      name: true,
      customDomain: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
      plan: true,
      isActive: true,
    },
  });

  if (!tenant) return null;

  // Get user count for this tenant
  const userCountResult = await db
    .select({ count: count() })
    .from(users)
    .where(eq(users.tenantId, tenantId));

  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    customDomain: tenant.customDomain,
    logoUrl: tenant.logoUrl,
    primaryColor: tenant.primaryColor ?? '#00ff88',
    secondaryColor: tenant.secondaryColor ?? '#00ccff',
    plan: tenant.plan ?? 'starter',
    isActive: tenant.isActive ?? true,
    userCount: userCountResult[0]?.count ?? 0,
  };
}

/**
 * Get tenant theme settings
 */
export async function getTenantTheme(tenantId: string) {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.id, tenantId),
    columns: {
      name: true,
      logoUrl: true,
      primaryColor: true,
      secondaryColor: true,
    },
  });

  if (!tenant) {
    return {
      '--accent-primary': '#00ff88',
      '--accent-secondary': '#00ccff',
      logoUrl: null,
      companyName: 'MENTORA AI',
    };
  }

  return {
    '--accent-primary': tenant.primaryColor ?? '#00ff88',
    '--accent-secondary': tenant.secondaryColor ?? '#00ccff',
    logoUrl: tenant.logoUrl,
    companyName: tenant.name,
  };
}

/**
 * Update tenant settings (admin only)
 */
export async function updateTenant(
  tenantId: string,
  data: {
    name?: string;
    customDomain?: string | null;
    logoUrl?: string | null;
    primaryColor?: string;
    secondaryColor?: string;
    plan?: string;
  }
) {
  const result = await db
    .update(tenants)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tenants.id, tenantId))
    .returning({
      id: tenants.id,
      slug: tenants.slug,
      name: tenants.name,
    });

  return result[0] ?? null;
}

/**
 * Create a new tenant (super admin only)
 */
export async function createTenant(data: {
  slug: string;
  name: string;
  customDomain?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  plan?: string;
}) {
  const result = await db
    .insert(tenants)
    .values({
      slug: data.slug,
      name: data.name,
      customDomain: data.customDomain,
      primaryColor: data.primaryColor ?? '#00ff88',
      secondaryColor: data.secondaryColor ?? '#00ccff',
      plan: data.plan ?? 'starter',
      isActive: true,
    })
    .returning({
      id: tenants.id,
      slug: tenants.slug,
      name: tenants.name,
    });

  return result[0] ?? null;
}

/**
 * Check if tenant slug exists
 */
export async function tenantSlugExists(slug: string): Promise<boolean> {
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.slug, slug),
    columns: { id: true },
  });
  return tenant !== null;
}
