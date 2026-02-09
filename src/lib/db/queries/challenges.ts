import { db } from '../client';
import { challengeProgress } from '../schema';
import { eq, and, desc } from 'drizzle-orm';
import { type ChallengeProgressDTO, type ChallengeOverviewDTO } from '@/lib/utils/dto';

// Default challenge: 30-day trading challenge
const DEFAULT_CHALLENGE_ID = 'desafio-30-dias';
const CHALLENGE_DAYS = 30;

/**
 * Get challenge overview for user
 */
export async function getChallengeOverview(
  userId: string,
  tenantId: string,
  challengeId: string = DEFAULT_CHALLENGE_ID
): Promise<ChallengeOverviewDTO> {
  const progress = await db.query.challengeProgress.findMany({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.tenantId, tenantId),
      eq(challengeProgress.challengeId, challengeId)
    ),
    orderBy: [challengeProgress.dayNumber],
  });

  // Build days array with completion status
  const daysMap = new Map(progress.map((p) => [p.dayNumber, p]));
  const days: ChallengeProgressDTO[] = [];

  for (let i = 1; i <= CHALLENGE_DAYS; i++) {
    const day = daysMap.get(i);
    days.push({
      challengeId,
      dayNumber: i,
      completed: !!day?.completedAt,
      completedAt: day?.completedAt?.toISOString() ?? null,
      notes: day?.notes ?? null,
    });
  }

  const completedDays = days.filter((d) => d.completed).length;

  // Calculate current day (first incomplete day)
  let currentDay = 1;
  for (const day of days) {
    if (!day.completed) {
      currentDay = day.dayNumber;
      break;
    }
    currentDay = day.dayNumber + 1;
  }

  return {
    challengeId,
    totalDays: CHALLENGE_DAYS,
    completedDays,
    currentDay: Math.min(currentDay, CHALLENGE_DAYS),
    progressPercent: Math.round((completedDays / CHALLENGE_DAYS) * 100),
    days,
  };
}

/**
 * Complete a challenge day
 */
export async function completeChallengeDay(data: {
  userId: string;
  tenantId: string;
  challengeId: string;
  dayNumber: number;
  notes?: string;
}): Promise<ChallengeProgressDTO> {
  // Check if day already exists
  const existing = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, data.userId),
      eq(challengeProgress.tenantId, data.tenantId),
      eq(challengeProgress.challengeId, data.challengeId),
      eq(challengeProgress.dayNumber, data.dayNumber)
    ),
  });

  if (existing?.completedAt) {
    // Already completed, return existing
    return {
      challengeId: data.challengeId,
      dayNumber: data.dayNumber,
      completed: true,
      completedAt: existing.completedAt.toISOString(),
      notes: existing.notes,
    };
  }

  if (existing) {
    // Update existing record
    const [updated] = await db
      .update(challengeProgress)
      .set({
        completedAt: new Date(),
        notes: data.notes ?? existing.notes,
      })
      .where(eq(challengeProgress.id, existing.id))
      .returning();

    return {
      challengeId: data.challengeId,
      dayNumber: data.dayNumber,
      completed: true,
      completedAt: updated.completedAt?.toISOString() ?? null,
      notes: updated.notes,
    };
  }

  // Create new record
  const [created] = await db
    .insert(challengeProgress)
    .values({
      tenantId: data.tenantId,
      userId: data.userId,
      challengeId: data.challengeId,
      dayNumber: data.dayNumber,
      completedAt: new Date(),
      notes: data.notes,
    })
    .returning();

  return {
    challengeId: data.challengeId,
    dayNumber: data.dayNumber,
    completed: true,
    completedAt: created.completedAt?.toISOString() ?? null,
    notes: created.notes,
  };
}

/**
 * Add notes to a challenge day (without marking complete)
 */
export async function updateChallengeNotes(data: {
  userId: string;
  tenantId: string;
  challengeId: string;
  dayNumber: number;
  notes: string;
}): Promise<void> {
  const existing = await db.query.challengeProgress.findFirst({
    where: and(
      eq(challengeProgress.userId, data.userId),
      eq(challengeProgress.tenantId, data.tenantId),
      eq(challengeProgress.challengeId, data.challengeId),
      eq(challengeProgress.dayNumber, data.dayNumber)
    ),
  });

  if (existing) {
    await db
      .update(challengeProgress)
      .set({ notes: data.notes })
      .where(eq(challengeProgress.id, existing.id));
  } else {
    await db.insert(challengeProgress).values({
      tenantId: data.tenantId,
      userId: data.userId,
      challengeId: data.challengeId,
      dayNumber: data.dayNumber,
      notes: data.notes,
    });
  }
}

/**
 * Get user's streak in challenge (consecutive completed days)
 */
export async function getChallengeStreak(
  userId: string,
  tenantId: string,
  challengeId: string = DEFAULT_CHALLENGE_ID
): Promise<number> {
  const progress = await db.query.challengeProgress.findMany({
    where: and(
      eq(challengeProgress.userId, userId),
      eq(challengeProgress.tenantId, tenantId),
      eq(challengeProgress.challengeId, challengeId)
    ),
    orderBy: [desc(challengeProgress.dayNumber)],
  });

  let streak = 0;
  const completedDays = new Set(
    progress.filter((p) => p.completedAt).map((p) => p.dayNumber)
  );

  // Count from day 1
  for (let i = 1; i <= CHALLENGE_DAYS; i++) {
    if (completedDays.has(i)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
