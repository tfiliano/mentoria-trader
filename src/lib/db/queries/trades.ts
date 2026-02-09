import { db } from '../client';
import { trades, tradingAccounts } from '../schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export type TradeDTO = {
  id: string;
  accountId: string | null;
  accountName?: string;
  asset: string;
  direction: 'buy' | 'sell';
  entryPrice: number | null;
  exitPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  lotSize: string | null;
  result: 'win' | 'loss' | 'breakeven';
  profitLoss: number;
  profitLossPips: number | null;
  entryTime: string | null;
  exitTime: string | null;
  screenshot: string | null;
  notes: string | null;
  emotions: string | null;
  followedPlan: boolean | null;
  createdAt: string;
};

export type TradeStats = {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRate: number;
  totalProfitLoss: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
};

/**
 * Get all trades for a user
 */
export async function getUserTrades(
  userId: string,
  tenantId: string,
  limit: number = 50,
  offset: number = 0
): Promise<TradeDTO[]> {
  const results = await db
    .select({
      id: trades.id,
      accountId: trades.accountId,
      accountName: tradingAccounts.name,
      asset: trades.asset,
      direction: trades.direction,
      entryPrice: trades.entryPrice,
      exitPrice: trades.exitPrice,
      stopLoss: trades.stopLoss,
      takeProfit: trades.takeProfit,
      lotSize: trades.lotSize,
      result: trades.result,
      profitLoss: trades.profitLoss,
      profitLossPips: trades.profitLossPips,
      entryTime: trades.entryTime,
      exitTime: trades.exitTime,
      screenshot: trades.screenshot,
      notes: trades.notes,
      emotions: trades.emotions,
      followedPlan: trades.followedPlan,
      createdAt: trades.createdAt,
    })
    .from(trades)
    .leftJoin(tradingAccounts, eq(trades.accountId, tradingAccounts.id))
    .where(and(eq(trades.userId, userId), eq(trades.tenantId, tenantId)))
    .orderBy(desc(trades.createdAt))
    .limit(limit)
    .offset(offset);

  return results.map((t) => ({
    id: t.id,
    accountId: t.accountId,
    accountName: t.accountName ?? undefined,
    asset: t.asset,
    direction: t.direction as 'buy' | 'sell',
    entryPrice: t.entryPrice,
    exitPrice: t.exitPrice,
    stopLoss: t.stopLoss,
    takeProfit: t.takeProfit,
    lotSize: t.lotSize,
    result: t.result as 'win' | 'loss' | 'breakeven',
    profitLoss: t.profitLoss ?? 0,
    profitLossPips: t.profitLossPips,
    entryTime: t.entryTime?.toISOString() ?? null,
    exitTime: t.exitTime?.toISOString() ?? null,
    screenshot: t.screenshot,
    notes: t.notes,
    emotions: t.emotions,
    followedPlan: t.followedPlan,
    createdAt: t.createdAt?.toISOString() ?? new Date().toISOString(),
  }));
}

/**
 * Get a single trade
 */
export async function getTrade(
  tradeId: string,
  userId: string,
  tenantId: string
): Promise<TradeDTO | null> {
  const [t] = await db
    .select({
      id: trades.id,
      accountId: trades.accountId,
      accountName: tradingAccounts.name,
      asset: trades.asset,
      direction: trades.direction,
      entryPrice: trades.entryPrice,
      exitPrice: trades.exitPrice,
      stopLoss: trades.stopLoss,
      takeProfit: trades.takeProfit,
      lotSize: trades.lotSize,
      result: trades.result,
      profitLoss: trades.profitLoss,
      profitLossPips: trades.profitLossPips,
      entryTime: trades.entryTime,
      exitTime: trades.exitTime,
      screenshot: trades.screenshot,
      notes: trades.notes,
      emotions: trades.emotions,
      followedPlan: trades.followedPlan,
      createdAt: trades.createdAt,
    })
    .from(trades)
    .leftJoin(tradingAccounts, eq(trades.accountId, tradingAccounts.id))
    .where(
      and(
        eq(trades.id, tradeId),
        eq(trades.userId, userId),
        eq(trades.tenantId, tenantId)
      )
    );

  if (!t) return null;

  return {
    id: t.id,
    accountId: t.accountId,
    accountName: t.accountName ?? undefined,
    asset: t.asset,
    direction: t.direction as 'buy' | 'sell',
    entryPrice: t.entryPrice,
    exitPrice: t.exitPrice,
    stopLoss: t.stopLoss,
    takeProfit: t.takeProfit,
    lotSize: t.lotSize,
    result: t.result as 'win' | 'loss' | 'breakeven',
    profitLoss: t.profitLoss ?? 0,
    profitLossPips: t.profitLossPips,
    entryTime: t.entryTime?.toISOString() ?? null,
    exitTime: t.exitTime?.toISOString() ?? null,
    screenshot: t.screenshot,
    notes: t.notes,
    emotions: t.emotions,
    followedPlan: t.followedPlan,
    createdAt: t.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Create a new trade
 */
export async function createTrade(data: {
  userId: string;
  tenantId: string;
  accountId?: string;
  asset: string;
  direction: 'buy' | 'sell';
  entryPrice?: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: string;
  result: 'win' | 'loss' | 'breakeven';
  profitLoss?: number;
  profitLossPips?: number;
  entryTime?: Date;
  exitTime?: Date;
  screenshot?: string;
  notes?: string;
  emotions?: string;
  followedPlan?: boolean;
}): Promise<TradeDTO> {
  const [t] = await db
    .insert(trades)
    .values({
      tenantId: data.tenantId,
      userId: data.userId,
      accountId: data.accountId ?? null,
      asset: data.asset,
      direction: data.direction,
      entryPrice: data.entryPrice,
      exitPrice: data.exitPrice,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      lotSize: data.lotSize,
      result: data.result,
      profitLoss: data.profitLoss ?? 0,
      profitLossPips: data.profitLossPips,
      entryTime: data.entryTime,
      exitTime: data.exitTime,
      screenshot: data.screenshot,
      notes: data.notes,
      emotions: data.emotions,
      followedPlan: data.followedPlan,
    })
    .returning();

  return {
    id: t.id,
    accountId: t.accountId,
    asset: t.asset,
    direction: t.direction as 'buy' | 'sell',
    entryPrice: t.entryPrice,
    exitPrice: t.exitPrice,
    stopLoss: t.stopLoss,
    takeProfit: t.takeProfit,
    lotSize: t.lotSize,
    result: t.result as 'win' | 'loss' | 'breakeven',
    profitLoss: t.profitLoss ?? 0,
    profitLossPips: t.profitLossPips,
    entryTime: t.entryTime?.toISOString() ?? null,
    exitTime: t.exitTime?.toISOString() ?? null,
    screenshot: t.screenshot,
    notes: t.notes,
    emotions: t.emotions,
    followedPlan: t.followedPlan,
    createdAt: t.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Update a trade
 */
export async function updateTrade(
  tradeId: string,
  userId: string,
  tenantId: string,
  data: Partial<{
    accountId: string;
    asset: string;
    direction: 'buy' | 'sell';
    entryPrice: number;
    exitPrice: number;
    stopLoss: number;
    takeProfit: number;
    lotSize: string;
    result: 'win' | 'loss' | 'breakeven';
    profitLoss: number;
    profitLossPips: number;
    entryTime: Date;
    exitTime: Date;
    screenshot: string;
    notes: string;
    emotions: string;
    followedPlan: boolean;
  }>
): Promise<void> {
  await db
    .update(trades)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(trades.id, tradeId),
        eq(trades.userId, userId),
        eq(trades.tenantId, tenantId)
      )
    );
}

/**
 * Delete a trade
 */
export async function deleteTrade(
  tradeId: string,
  userId: string,
  tenantId: string
): Promise<void> {
  await db
    .delete(trades)
    .where(
      and(
        eq(trades.id, tradeId),
        eq(trades.userId, userId),
        eq(trades.tenantId, tenantId)
      )
    );
}

/**
 * Get unique assets traded by the user
 */
export async function getUserAssets(
  userId: string,
  tenantId: string
): Promise<string[]> {
  const results = await db
    .selectDistinct({ asset: trades.asset })
    .from(trades)
    .where(and(eq(trades.userId, userId), eq(trades.tenantId, tenantId)))
    .orderBy(trades.asset);

  return results.map((r) => r.asset);
}

/**
 * Get trade statistics for a user
 */
export async function getTradeStats(
  userId: string,
  tenantId: string,
  accountId?: string
): Promise<TradeStats> {
  const whereClause = accountId
    ? and(
        eq(trades.userId, userId),
        eq(trades.tenantId, tenantId),
        eq(trades.accountId, accountId)
      )
    : and(eq(trades.userId, userId), eq(trades.tenantId, tenantId));

  const allTrades = await db.query.trades.findMany({
    where: whereClause,
    columns: {
      result: true,
      profitLoss: true,
    },
  });

  const totalTrades = allTrades.length;
  const winningTrades = allTrades.filter((t) => t.result === 'win').length;
  const losingTrades = allTrades.filter((t) => t.result === 'loss').length;
  const breakevenTrades = allTrades.filter((t) => t.result === 'breakeven').length;

  const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;

  const totalProfitLoss = allTrades.reduce((sum, t) => sum + (t.profitLoss ?? 0), 0);

  const wins = allTrades.filter((t) => t.result === 'win');
  const losses = allTrades.filter((t) => t.result === 'loss');

  const totalWins = wins.reduce((sum, t) => sum + (t.profitLoss ?? 0), 0);
  const totalLosses = Math.abs(losses.reduce((sum, t) => sum + (t.profitLoss ?? 0), 0));

  const averageWin = wins.length > 0 ? Math.round(totalWins / wins.length) : 0;
  const averageLoss = losses.length > 0 ? Math.round(totalLosses / losses.length) : 0;

  const profitFactor = totalLosses > 0 ? Math.round((totalWins / totalLosses) * 100) / 100 : totalWins > 0 ? 999 : 0;

  return {
    totalTrades,
    winningTrades,
    losingTrades,
    breakevenTrades,
    winRate,
    totalProfitLoss,
    averageWin,
    averageLoss,
    profitFactor,
  };
}
