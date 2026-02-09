/**
 * Internal database types
 * These types are for internal use only and should NEVER be exposed to the client
 */

export type {
  Tenant,
  NewTenant,
  User,
  NewUser,
  UserProgress,
  NewUserProgress,
  UserBadge,
  NewUserBadge,
  ChallengeProgress,
  NewChallengeProgress,
  XpTransaction,
  NewXpTransaction,
} from '@/lib/db/schema';

// Role types
export type UserRole = 'user' | 'tenant_admin' | 'super_admin';

// Plan types
export type TenantPlan = 'starter' | 'pro' | 'enterprise';

// Internal user with all fields (for server-side only)
export interface InternalUser {
  id: string;
  tenantId: string;
  email: string;
  passwordHash: string | null; // NEVER expose this
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
