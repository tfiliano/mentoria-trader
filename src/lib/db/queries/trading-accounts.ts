import { db } from '../client';
import { tradingAccounts } from '../schema';
import { eq, and, desc } from 'drizzle-orm';

export type TradingAccountDTO = {
  id: string;
  name: string;
  accountType: 'prop' | 'personal' | 'demo';
  broker: string | null;
  currency: string;
  initialBalance: number;
  currentBalance: number;
  profitLoss: number;
  profitLossPercent: number;
  isActive: boolean;
  createdAt: string;
};

/**
 * Get all trading accounts for a user
 */
export async function getUserTradingAccounts(
  userId: string,
  tenantId: string
): Promise<TradingAccountDTO[]> {
  const accounts = await db.query.tradingAccounts.findMany({
    where: and(
      eq(tradingAccounts.userId, userId),
      eq(tradingAccounts.tenantId, tenantId)
    ),
    orderBy: [desc(tradingAccounts.createdAt)],
  });

  return accounts.map((acc) => {
    const profitLoss = (acc.currentBalance ?? 0) - (acc.initialBalance ?? 0);
    const profitLossPercent =
      acc.initialBalance && acc.initialBalance > 0
        ? Math.round((profitLoss / acc.initialBalance) * 10000) / 100
        : 0;

    return {
      id: acc.id,
      name: acc.name,
      accountType: (acc.accountType as 'prop' | 'personal' | 'demo') ?? 'personal',
      broker: acc.broker,
      currency: acc.currency ?? 'USD',
      initialBalance: acc.initialBalance ?? 0,
      currentBalance: acc.currentBalance ?? 0,
      profitLoss,
      profitLossPercent,
      isActive: acc.isActive ?? true,
      createdAt: acc.createdAt?.toISOString() ?? new Date().toISOString(),
    };
  });
}

/**
 * Get a single trading account
 */
export async function getTradingAccount(
  accountId: string,
  userId: string,
  tenantId: string
): Promise<TradingAccountDTO | null> {
  const acc = await db.query.tradingAccounts.findFirst({
    where: and(
      eq(tradingAccounts.id, accountId),
      eq(tradingAccounts.userId, userId),
      eq(tradingAccounts.tenantId, tenantId)
    ),
  });

  if (!acc) return null;

  const profitLoss = (acc.currentBalance ?? 0) - (acc.initialBalance ?? 0);
  const profitLossPercent =
    acc.initialBalance && acc.initialBalance > 0
      ? Math.round((profitLoss / acc.initialBalance) * 10000) / 100
      : 0;

  return {
    id: acc.id,
    name: acc.name,
    accountType: (acc.accountType as 'prop' | 'personal' | 'demo') ?? 'personal',
    broker: acc.broker,
    currency: acc.currency ?? 'USD',
    initialBalance: acc.initialBalance ?? 0,
    currentBalance: acc.currentBalance ?? 0,
    profitLoss,
    profitLossPercent,
    isActive: acc.isActive ?? true,
    createdAt: acc.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Create a new trading account
 */
export async function createTradingAccount(data: {
  userId: string;
  tenantId: string;
  name: string;
  accountType: 'prop' | 'personal' | 'demo';
  broker?: string;
  currency: string;
  initialBalance: number;
}): Promise<TradingAccountDTO> {
  const [acc] = await db
    .insert(tradingAccounts)
    .values({
      tenantId: data.tenantId,
      userId: data.userId,
      name: data.name,
      accountType: data.accountType,
      broker: data.broker ?? null,
      currency: data.currency,
      initialBalance: data.initialBalance,
      currentBalance: data.initialBalance, // Start with initial balance
      isActive: true,
    })
    .returning();

  return {
    id: acc.id,
    name: acc.name,
    accountType: acc.accountType as 'prop' | 'personal' | 'demo',
    broker: acc.broker,
    currency: acc.currency ?? 'USD',
    initialBalance: acc.initialBalance ?? 0,
    currentBalance: acc.currentBalance ?? 0,
    profitLoss: 0,
    profitLossPercent: 0,
    isActive: true,
    createdAt: acc.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

/**
 * Update trading account balance
 */
export async function updateAccountBalance(
  accountId: string,
  userId: string,
  tenantId: string,
  newBalance: number
): Promise<void> {
  await db
    .update(tradingAccounts)
    .set({
      currentBalance: newBalance,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tradingAccounts.id, accountId),
        eq(tradingAccounts.userId, userId),
        eq(tradingAccounts.tenantId, tenantId)
      )
    );
}

/**
 * Update trading account details
 */
export async function updateTradingAccount(
  accountId: string,
  userId: string,
  tenantId: string,
  data: {
    name?: string;
    broker?: string;
    currentBalance?: number;
    isActive?: boolean;
  }
): Promise<void> {
  await db
    .update(tradingAccounts)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tradingAccounts.id, accountId),
        eq(tradingAccounts.userId, userId),
        eq(tradingAccounts.tenantId, tenantId)
      )
    );
}

/**
 * Delete a trading account
 */
export async function deleteTradingAccount(
  accountId: string,
  userId: string,
  tenantId: string
): Promise<void> {
  await db
    .delete(tradingAccounts)
    .where(
      and(
        eq(tradingAccounts.id, accountId),
        eq(tradingAccounts.userId, userId),
        eq(tradingAccounts.tenantId, tenantId)
      )
    );
}

/**
 * Get total balance across all accounts (in USD equivalent - simplified)
 */
export async function getTotalBalance(
  userId: string,
  tenantId: string
): Promise<{ total: number; currency: string }> {
  const accounts = await db.query.tradingAccounts.findMany({
    where: and(
      eq(tradingAccounts.userId, userId),
      eq(tradingAccounts.tenantId, tenantId),
      eq(tradingAccounts.isActive, true)
    ),
    columns: {
      currentBalance: true,
      currency: true,
    },
  });

  // For simplicity, just sum all balances (in a real app, you'd convert currencies)
  const total = accounts.reduce((sum, acc) => sum + (acc.currentBalance ?? 0), 0);

  return { total, currency: 'USD' };
}
