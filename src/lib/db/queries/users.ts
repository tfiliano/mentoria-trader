import { db } from '../client';
import { users, userProgress, userBadges, tenants } from '../schema';
import { eq, and, desc } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import {
  toUserPublicDTO,
  getLevelName,
  getXPThresholds,
  type UserPublicDTO,
  type UserProfileDTO,
  type BadgeDTO,
} from '@/lib/utils/dto';
import { BADGE_DEFINITIONS } from '@/lib/gamification/badges';

/**
 * Get user public profile (for leaderboard, mentions, etc.)
 * ALWAYS filters by tenantId for security
 */
export async function getUserPublic(
  userId: string,
  tenantId: string
): Promise<UserPublicDTO | null> {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.tenantId, tenantId)),
    columns: {
      id: true,
      name: true,
      avatarUrl: true,
    },
    with: {
      progress: {
        columns: {
          xp: true,
          level: true,
        },
      },
    },
  });

  if (!user) return null;
  return toUserPublicDTO(user);
}

/**
 * Get full user profile (for profile page)
 * ALWAYS filters by tenantId for security
 */
export async function getUserProfile(
  userId: string,
  tenantId: string
): Promise<UserProfileDTO | null> {
  const user = await db.query.users.findFirst({
    where: and(eq(users.id, userId), eq(users.tenantId, tenantId)),
    columns: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      createdAt: true,
      // NEVER include: passwordHash
    },
    with: {
      progress: {
        columns: {
          xp: true,
          level: true,
          totalTrades: true,
          winningTrades: true,
          currentStreak: true,
          bestStreak: true,
        },
      },
      badges: {
        columns: {
          badgeId: true,
          earnedAt: true,
        },
        orderBy: (badges, { desc }) => [desc(badges.earnedAt)],
      },
    },
  });

  if (!user) return null;

  // Map badge IDs to full badge info
  const badges: BadgeDTO[] = user.badges.map((badge) => {
    const definition = BADGE_DEFINITIONS[badge.badgeId];
    return {
      id: badge.badgeId,
      name: definition?.name ?? badge.badgeId,
      description: definition?.description ?? '',
      icon: definition?.icon ?? '🏅',
      category: definition?.category ?? 'geral',
      earnedAt: badge.earnedAt?.toISOString() ?? new Date().toISOString(),
    };
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role ?? 'user',
    level: user.progress?.level ?? 1,
    xp: user.progress?.xp ?? 0,
    totalTrades: user.progress?.totalTrades ?? 0,
    winningTrades: user.progress?.winningTrades ?? 0,
    currentStreak: user.progress?.currentStreak ?? 0,
    bestStreak: user.progress?.bestStreak ?? 0,
    badges,
    joinedAt: user.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Create a new user
 */
export async function createUser(data: {
  tenantId: string;
  email: string;
  password: string;
  name: string;
}) {
  const passwordHash = await hash(data.password, 10);

  // Create user
  const [user] = await db
    .insert(users)
    .values({
      tenantId: data.tenantId,
      email: data.email.toLowerCase(),
      passwordHash,
      name: data.name,
      role: 'user',
      isActive: true,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
    });

  if (!user) throw new Error('Failed to create user');

  // Create initial progress record
  await db.insert(userProgress).values({
    tenantId: data.tenantId,
    userId: user.id,
    xp: 0,
    level: 1,
    totalTrades: 0,
    winningTrades: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  return user;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  tenantId: string,
  data: {
    name?: string;
    avatarUrl?: string | null;
  }
) {
  const result = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(users.id, userId), eq(users.tenantId, tenantId)))
    .returning({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
    });

  return result[0] ?? null;
}

/**
 * Check if email exists in tenant
 */
export async function emailExistsInTenant(
  email: string,
  tenantId: string
): Promise<boolean> {
  console.log('[emailExistsInTenant] Checking:', { email: email.toLowerCase(), tenantId });
  const user = await db.query.users.findFirst({
    where: and(
      eq(users.email, email.toLowerCase()),
      eq(users.tenantId, tenantId)
    ),
    columns: { id: true },
  });
  console.log('[emailExistsInTenant] Found:', user);
  return !!user;
}

/**
 * Get tenant ID by slug (helper for registration)
 */
export async function getTenantIdBySlug(slug: string): Promise<string | null> {
  const tenant = await db.query.tenants.findFirst({
    where: and(eq(tenants.slug, slug), eq(tenants.isActive, true)),
    columns: { id: true },
  });
  return tenant?.id ?? null;
}
