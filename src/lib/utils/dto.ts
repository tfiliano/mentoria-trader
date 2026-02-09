/**
 * Data Transfer Objects (DTOs)
 * These types define what data is safe to expose to the client.
 * NEVER expose internal fields like password_hash, internal_notes, etc.
 */

// ============================================================================
// USER DTOs
// ============================================================================

export type UserPublicDTO = {
  id: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
};

export type UserProfileDTO = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  level: number;
  xp: number;
  totalTrades: number;
  winningTrades: number;
  currentStreak: number;
  bestStreak: number;
  badges: BadgeDTO[];
  joinedAt: string;
};

// ============================================================================
// GAMIFICATION DTOs
// ============================================================================

export type BadgeDTO = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: string;
};

export type ProgressDTO = {
  xp: number;
  level: number;
  levelName: string;
  xpToNextLevel: number;
  progressPercent: number;
  totalTrades: number;
  winningTrades: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
};

export type LeaderboardEntryDTO = {
  rank: number;
  userId: string;
  name: string;
  avatarUrl: string | null;
  level: number;
  xp: number;
  winRate: number;
};

// ============================================================================
// CHALLENGE DTOs
// ============================================================================

export type ChallengeProgressDTO = {
  challengeId: string;
  dayNumber: number;
  completed: boolean;
  completedAt: string | null;
  notes: string | null;
};

export type ChallengeOverviewDTO = {
  challengeId: string;
  totalDays: number;
  completedDays: number;
  currentDay: number;
  progressPercent: number;
  days: ChallengeProgressDTO[];
};

// ============================================================================
// TENANT DTOs
// ============================================================================

export type TenantPublicDTO = {
  name: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
};

export type TenantAdminDTO = {
  id: string;
  slug: string;
  name: string;
  customDomain: string | null;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  plan: string;
  isActive: boolean;
  userCount?: number;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Strip sensitive fields from user object
 */
export function toUserPublicDTO(user: {
  id: string;
  name: string;
  avatarUrl?: string | null;
  progress?: { level?: number | null; xp?: number | null } | null;
}): UserPublicDTO {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    level: user.progress?.level ?? 1,
    xp: user.progress?.xp ?? 0,
  };
}

/**
 * Strip sensitive fields from tenant object
 */
export function toTenantPublicDTO(tenant: {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
}): TenantPublicDTO {
  return {
    name: tenant.name,
    logoUrl: tenant.logoUrl ?? null,
    primaryColor: tenant.primaryColor ?? '#00ff88',
    secondaryColor: tenant.secondaryColor ?? '#00ccff',
  };
}

/**
 * Calculate level name from level number
 */
export function getLevelName(level: number): string {
  const levels: Record<number, string> = {
    1: 'Novato',
    2: 'Aprendiz',
    3: 'Praticante',
    4: 'Competente',
    5: 'Proficiente',
    6: 'Experiente',
    7: 'Avançado',
    8: 'Expert',
    9: 'Mestre',
    10: 'Lenda',
  };
  return levels[Math.min(level, 10)] ?? 'Novato';
}

/**
 * Calculate XP thresholds
 */
export function getXPThresholds(level: number): { current: number; next: number } {
  const thresholds = [0, 100, 500, 1500, 3500, 7500, 15000, 30000, 50000, 75000, 100000];
  const current = thresholds[Math.min(level - 1, 9)] ?? 0;
  const next = thresholds[Math.min(level, 10)] ?? 100000;
  return { current, next };
}
