import { db } from '../client';
import { userProgress, userBadges, xpTransactions, users } from '../schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import {
  getLevelName,
  getXPThresholds,
  type ProgressDTO,
  type LeaderboardEntryDTO,
} from '@/lib/utils/dto';

// XP thresholds for each level
const XP_THRESHOLDS = [0, 100, 500, 1500, 3500, 7500, 15000, 30000, 50000, 75000, 100000];

/**
 * Calculate level from XP
 */
function calculateLevel(xp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      return Math.min(i + 1, 10);
    }
  }
  return 1;
}

/**
 * Get user progress
 */
export async function getUserProgress(
  userId: string,
  tenantId: string
): Promise<ProgressDTO | null> {
  const progress = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, userId),
      eq(userProgress.tenantId, tenantId)
    ),
  });

  if (!progress) return null;

  const level = progress.level ?? 1;
  const xp = progress.xp ?? 0;
  const { current, next } = getXPThresholds(level);
  const xpInLevel = xp - current;
  const xpNeeded = next - current;
  const winRate =
    progress.totalTrades && progress.totalTrades > 0
      ? Math.round((progress.winningTrades ?? 0) / progress.totalTrades * 100)
      : 0;

  return {
    xp,
    level,
    levelName: getLevelName(level),
    xpToNextLevel: next - xp,
    progressPercent: Math.min(Math.round((xpInLevel / xpNeeded) * 100), 100),
    totalTrades: progress.totalTrades ?? 0,
    winningTrades: progress.winningTrades ?? 0,
    winRate,
    currentStreak: progress.currentStreak ?? 0,
    bestStreak: progress.bestStreak ?? 0,
  };
}

/**
 * Add XP to user
 * Returns new level if leveled up, null otherwise
 */
export async function addXP(data: {
  userId: string;
  tenantId: string;
  amount: number;
  reason: string;
  metadata?: Record<string, unknown>;
}): Promise<{ newLevel: number | null; totalXp: number }> {
  // Get current progress
  const current = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, data.userId),
      eq(userProgress.tenantId, data.tenantId)
    ),
  });

  const currentXp = current?.xp ?? 0;
  const currentLevel = current?.level ?? 1;
  const newXp = currentXp + data.amount;
  const newLevel = calculateLevel(newXp);

  // Update progress
  await db
    .update(userProgress)
    .set({
      xp: newXp,
      level: newLevel,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userProgress.userId, data.userId),
        eq(userProgress.tenantId, data.tenantId)
      )
    );

  // Record transaction
  await db.insert(xpTransactions).values({
    tenantId: data.tenantId,
    userId: data.userId,
    amount: data.amount,
    reason: data.reason,
    metadata: data.metadata ?? {},
  });

  return {
    newLevel: newLevel > currentLevel ? newLevel : null,
    totalXp: newXp,
  };
}

/**
 * Register a trade
 */
export async function registerTrade(data: {
  userId: string;
  tenantId: string;
  isWinning: boolean;
}): Promise<{ xpEarned: number; newLevel: number | null }> {
  // Get current progress
  const current = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, data.userId),
      eq(userProgress.tenantId, data.tenantId)
    ),
  });

  const currentXp = current?.xp ?? 0;
  const currentLevel = current?.level ?? 1;
  const currentStreak = current?.currentStreak ?? 0;
  const bestStreak = current?.bestStreak ?? 0;

  // Calculate XP: base 10 + 20 for winning
  const xpEarned = data.isWinning ? 30 : 10;
  const newXp = currentXp + xpEarned;
  const newLevel = calculateLevel(newXp);

  // Update streak
  const newStreak = data.isWinning ? currentStreak + 1 : 0;
  const newBestStreak = Math.max(bestStreak, newStreak);

  // Update progress
  await db
    .update(userProgress)
    .set({
      xp: newXp,
      level: newLevel,
      totalTrades: sql`${userProgress.totalTrades} + 1`,
      winningTrades: data.isWinning
        ? sql`${userProgress.winningTrades} + 1`
        : current?.winningTrades,
      currentStreak: newStreak,
      bestStreak: newBestStreak,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(userProgress.userId, data.userId),
        eq(userProgress.tenantId, data.tenantId)
      )
    );

  // Record XP transaction
  await db.insert(xpTransactions).values({
    tenantId: data.tenantId,
    userId: data.userId,
    amount: xpEarned,
    reason: data.isWinning ? 'Trade vencedor' : 'Trade registrado',
    metadata: { isWinning: data.isWinning },
  });

  return {
    xpEarned,
    newLevel: newLevel > currentLevel ? newLevel : null,
  };
}

/**
 * Get leaderboard for tenant
 */
export async function getLeaderboard(
  tenantId: string,
  limit: number = 10
): Promise<LeaderboardEntryDTO[]> {
  const results = await db
    .select({
      id: users.id,
      name: users.name,
      avatarUrl: users.avatarUrl,
      xp: userProgress.xp,
      level: userProgress.level,
      totalTrades: userProgress.totalTrades,
      winningTrades: userProgress.winningTrades,
    })
    .from(users)
    .innerJoin(userProgress, eq(users.id, userProgress.userId))
    .where(and(eq(users.tenantId, tenantId), eq(users.isActive, true)))
    .orderBy(desc(userProgress.xp))
    .limit(limit);

  return results.map((row, index) => ({
    rank: index + 1,
    userId: row.id,
    name: row.name,
    avatarUrl: row.avatarUrl,
    level: row.level ?? 1,
    xp: row.xp ?? 0,
    winRate:
      row.totalTrades && row.totalTrades > 0
        ? Math.round(((row.winningTrades ?? 0) / row.totalTrades) * 100)
        : 0,
  }));
}

/**
 * Get user rank in tenant
 */
export async function getUserRank(
  userId: string,
  tenantId: string
): Promise<number> {
  const userXp = await db.query.userProgress.findFirst({
    where: and(
      eq(userProgress.userId, userId),
      eq(userProgress.tenantId, tenantId)
    ),
    columns: { xp: true },
  });

  if (!userXp) return 0;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(userProgress)
    .where(
      and(
        eq(userProgress.tenantId, tenantId),
        sql`${userProgress.xp} > ${userXp.xp ?? 0}`
      )
    );

  return (result[0]?.count ?? 0) + 1;
}
