import { auth } from './config';
import { redirect } from 'next/navigation';

export type Role = 'user' | 'tenant_admin' | 'super_admin';

// Permission levels (higher number = more access)
const ROLE_LEVELS: Record<Role, number> = {
  user: 1,
  tenant_admin: 2,
  super_admin: 3,
};

/**
 * Check if user has required role or higher
 */
export function hasRole(userRole: string, requiredRole: Role): boolean {
  const userLevel = ROLE_LEVELS[userRole as Role] ?? 0;
  const requiredLevel = ROLE_LEVELS[requiredRole];
  return userLevel >= requiredLevel;
}

/**
 * Get current session with tenant context
 * Throws error if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

/**
 * Require specific role level
 */
export async function requireRole(requiredRole: Role) {
  const session = await requireAuth();

  if (!hasRole(session.user.role, requiredRole)) {
    redirect('/unauthorized');
  }

  return session;
}

/**
 * Require tenant admin or higher
 */
export async function requireTenantAdmin() {
  return requireRole('tenant_admin');
}

/**
 * Require super admin
 */
export async function requireSuperAdmin() {
  return requireRole('super_admin');
}

/**
 * Get tenant ID from session (server-side only)
 * NEVER trust client-sent tenant IDs
 */
export async function getTenantId(): Promise<string> {
  const session = await requireAuth();
  return session.user.tenantId;
}

/**
 * Get user ID from session (server-side only)
 */
export async function getUserId(): Promise<string> {
  const session = await requireAuth();
  return session.user.id;
}

/**
 * Get full auth context
 */
export async function getAuthContext() {
  const session = await requireAuth();
  return {
    userId: session.user.id,
    tenantId: session.user.tenantId,
    tenantSlug: session.user.tenantSlug,
    role: session.user.role as Role,
  };
}
