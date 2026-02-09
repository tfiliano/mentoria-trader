import { db } from '../client';
import { traderProfiles } from '../schema';
import { eq, and } from 'drizzle-orm';

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const profile = await db.query.traderProfiles.findFirst({
    where: and(
      eq(traderProfiles.userId, userId),
      eq(traderProfiles.tenantId, tenantId)
    ),
    columns: {
      onboardingCompletedAt: true,
    },
  });

  return !!profile?.onboardingCompletedAt;
}

/**
 * Get trader profile
 */
export async function getTraderProfile(userId: string, tenantId: string) {
  return db.query.traderProfiles.findFirst({
    where: and(
      eq(traderProfiles.userId, userId),
      eq(traderProfiles.tenantId, tenantId)
    ),
  });
}

/**
 * Create or update trader profile (upsert)
 */
export async function saveTraderProfile(
  userId: string,
  tenantId: string,
  data: {
    // Step 1
    tradingExperience?: string;
    tradingTime?: string;
    biggestDifficulty?: string;
    biggestFear?: string;
    // Step 2
    hasActiveAccount?: boolean;
    accountsCurrency?: string;
    accountsValue?: number;
    currentPerformance?: string;
    // Step 3
    traderType?: string;
    tradesPerDay?: string;
    assetsForex?: boolean;
    assetsIndices?: boolean;
    assetsCommodities?: boolean;
    assetsCrypto?: boolean;
    // Step 4
    hasTradingPlan?: string;
    followsRules?: string;
    usesStopLoss?: string;
    movesStopLoss?: string;
    riskPerTrade?: number;
    // Step 5
    strategyDescription?: string;
    stopLossDefinition?: string;
    takeProfitDefinition?: string;
    tradingSession?: string;
    minimumRR?: string;
    // Step 6
    usesPropFirm?: boolean;
    usesOwnCapital?: boolean;
    // Step 7
    hasPropAccount?: boolean;
    propFirmName?: string;
    // Step 8
    tradingGoals?: string;
    monthlyIncomeTarget?: number;
    targetTimeframe?: string;
    mainFocus?: string;
    // Step 9
    lostPropAccounts?: string;
    lossReason?: string;
    demoVsRealBehavior?: string;
  },
  complete = false
) {
  const existingProfile = await getTraderProfile(userId, tenantId);

  const profileData = {
    ...data,
    updatedAt: new Date(),
    ...(complete ? { onboardingCompletedAt: new Date() } : {}),
  };

  if (existingProfile) {
    const [updated] = await db
      .update(traderProfiles)
      .set(profileData)
      .where(
        and(
          eq(traderProfiles.userId, userId),
          eq(traderProfiles.tenantId, tenantId)
        )
      )
      .returning({ id: traderProfiles.id });

    return updated;
  } else {
    const [created] = await db
      .insert(traderProfiles)
      .values({
        userId,
        tenantId,
        ...profileData,
      })
      .returning({ id: traderProfiles.id });

    return created;
  }
}
