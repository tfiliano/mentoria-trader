import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// TENANTS TABLE
// ============================================================================
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  customDomain: varchar('custom_domain', { length: 255 }),
  logoUrl: text('logo_url'),
  primaryColor: varchar('primary_color', { length: 7 }).default('#00ff88'),
  secondaryColor: varchar('secondary_color', { length: 7 }).default('#00ccff'),
  settings: jsonb('settings').default({}),
  plan: varchar('plan', { length: 20 }).default('starter'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// USERS TABLE
// ============================================================================
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    name: varchar('name', { length: 255 }).notNull(),
    role: varchar('role', { length: 20 }).default('user'),
    avatarUrl: text('avatar_url'),
    isActive: boolean('is_active').default(true),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueEmailPerTenant: unique('unique_email_per_tenant').on(
      table.tenantId,
      table.email
    ),
  })
);

// ============================================================================
// USER PROGRESS (Gamification)
// ============================================================================
export const userProgress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  xp: integer('xp').default(0),
  level: integer('level').default(1),
  totalTrades: integer('total_trades').default(0),
  winningTrades: integer('winning_trades').default(0),
  currentStreak: integer('current_streak').default(0),
  bestStreak: integer('best_streak').default(0),
  lastActivityAt: timestamp('last_activity_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// USER BADGES
// ============================================================================
export const userBadges = pgTable(
  'user_badges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    badgeId: varchar('badge_id', { length: 50 }).notNull(),
    earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueBadgePerUser: unique('unique_badge_per_user').on(
      table.userId,
      table.badgeId
    ),
  })
);

// ============================================================================
// CHALLENGE PROGRESS (30-day challenge)
// ============================================================================
export const challengeProgress = pgTable(
  'challenge_progress',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    challengeId: varchar('challenge_id', { length: 50 }).notNull(),
    dayNumber: integer('day_number').notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueDayPerChallenge: unique('unique_day_per_challenge').on(
      table.userId,
      table.challengeId,
      table.dayNumber
    ),
  })
);

// ============================================================================
// TRADES (Individual trade records)
// ============================================================================
export const trades = pgTable('trades', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: uuid('account_id')
    .references(() => tradingAccounts.id, { onDelete: 'set null' }),

  // Trade details
  asset: varchar('asset', { length: 20 }).notNull(), // EURUSD, BTCUSD, NAS100
  direction: varchar('direction', { length: 10 }).notNull(), // buy, sell
  entryPrice: integer('entry_price'), // Stored as cents/pips
  exitPrice: integer('exit_price'),
  stopLoss: integer('stop_loss'),
  takeProfit: integer('take_profit'),
  lotSize: varchar('lot_size', { length: 20 }), // "0.01", "1.0"

  // Result
  result: varchar('result', { length: 10 }).notNull(), // win, loss, breakeven
  profitLoss: integer('profit_loss').default(0), // In account currency (cents)
  profitLossPips: integer('profit_loss_pips'),

  // Metadata
  entryTime: timestamp('entry_time', { withTimezone: true }),
  exitTime: timestamp('exit_time', { withTimezone: true }),
  screenshot: text('screenshot'), // URL to screenshot
  notes: text('notes'),
  emotions: varchar('emotions', { length: 50 }), // calm, anxious, confident, fearful
  followedPlan: boolean('followed_plan'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// TRADING ACCOUNTS (User's trading accounts - prop firms, personal, etc)
// ============================================================================
export const tradingAccounts = pgTable('trading_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 100 }).notNull(), // "FTMO 100k", "Conta XM"
  accountType: varchar('account_type', { length: 20 }).notNull().default('personal'), // prop, personal, demo
  broker: varchar('broker', { length: 50 }), // FTMO, XM, IC Markets, etc
  currency: varchar('currency', { length: 3 }).notNull().default('USD'),
  initialBalance: integer('initial_balance').notNull().default(0),
  currentBalance: integer('current_balance').notNull().default(0),

  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// TRADER PROFILES (Anamnese/Onboarding)
// ============================================================================
export const traderProfiles = pgTable('trader_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),

  // Step 1: Experience
  tradingExperience: varchar('trading_experience', { length: 20 }), // sim, demo, nao
  tradingTime: varchar('trading_time', { length: 20 }), // <3, 3-6, 6-12, 1-2, 2+
  biggestDifficulty: text('biggest_difficulty'),
  biggestFear: text('biggest_fear'),

  // Step 2: Current Situation
  hasActiveAccount: boolean('has_active_account'),
  accountsCurrency: varchar('accounts_currency', { length: 3 }).default('USD'), // USD, GBP, EUR, BRL
  accountsValue: integer('accounts_value').default(0),
  currentPerformance: varchar('current_performance', { length: 20 }), // positivo, neutro, negativo, na

  // Step 3: Trading Type
  traderType: varchar('trader_type', { length: 20 }), // scalper, day, swing
  tradesPerDay: varchar('trades_per_day', { length: 20 }), // 1-3, 4-10, 10+, 0
  assetsForex: boolean('assets_forex').default(false),
  assetsIndices: boolean('assets_indices').default(false),
  assetsCommodities: boolean('assets_commodities').default(false),
  assetsCrypto: boolean('assets_crypto').default(false),

  // Step 4: Operational Rules
  hasTradingPlan: varchar('has_trading_plan', { length: 20 }), // sim, mental, nao
  followsRules: varchar('follows_rules', { length: 20 }), // sempre, maioria, as_vezes, raramente
  usesStopLoss: varchar('uses_stop_loss', { length: 20 }), // sempre, as_vezes, nunca
  movesStopLoss: varchar('moves_stop_loss', { length: 20 }), // nunca, favor, contra
  riskPerTrade: integer('risk_per_trade'), // percentage

  // Step 5: Strategy Description
  strategyDescription: text('strategy_description'),
  stopLossDefinition: text('stop_loss_definition'),
  takeProfitDefinition: text('take_profit_definition'),
  tradingSession: varchar('trading_session', { length: 100 }),
  minimumRR: varchar('minimum_rr', { length: 20 }),

  // Step 6: Capital Type
  usesPropFirm: boolean('uses_prop_firm').default(false),
  usesOwnCapital: boolean('uses_own_capital').default(false),

  // Step 7: Prop Firms
  hasPropAccount: boolean('has_prop_account'),
  propFirmName: varchar('prop_firm_name', { length: 50 }),

  // Step 8: Goals
  tradingGoals: text('trading_goals'),
  monthlyIncomeTarget: integer('monthly_income_target'),
  targetTimeframe: varchar('target_timeframe', { length: 10 }), // 3, 6, 12, 24
  mainFocus: varchar('main_focus', { length: 20 }), // fundado, consistencia, escalar, viver

  // Step 9: Behavior
  lostPropAccounts: varchar('lost_prop_accounts', { length: 10 }), // 0, 1, 2-3, 4+, na
  lossReason: varchar('loss_reason', { length: 30 }), // perda_diaria, perda_total, revenge, overtrading, na
  demoVsRealBehavior: varchar('demo_vs_real_behavior', { length: 30 }), // nao, sim_emocional, sim_conservador

  // Meta
  onboardingCompletedAt: timestamp('onboarding_completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// XP TRANSACTIONS (Audit Log)
// ============================================================================
export const xpTransactions = pgTable('xp_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id')
    .notNull()
    .references(() => tenants.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  reason: varchar('reason', { length: 100 }).notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ============================================================================
// SESSIONS (NextAuth.js)
// ============================================================================
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull(),
});

// ============================================================================
// VERIFICATION TOKENS (NextAuth.js)
// ============================================================================
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull().unique(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (table) => ({
    uniqueIdentifierToken: unique('unique_identifier_token').on(
      table.identifier,
      table.token
    ),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  userProgress: many(userProgress),
  traderProfiles: many(traderProfiles),
  userBadges: many(userBadges),
  challengeProgress: many(challengeProgress),
  xpTransactions: many(xpTransactions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [users.tenantId],
    references: [tenants.id],
  }),
  progress: one(userProgress, {
    fields: [users.id],
    references: [userProgress.userId],
  }),
  traderProfile: one(traderProfiles, {
    fields: [users.id],
    references: [traderProfiles.userId],
  }),
  tradingAccounts: many(tradingAccounts),
  badges: many(userBadges),
  challengeProgress: many(challengeProgress),
  xpTransactions: many(xpTransactions),
  sessions: many(sessions),
}));

export const tradingAccountsRelations = relations(tradingAccounts, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [tradingAccounts.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tradingAccounts.userId],
    references: [users.id],
  }),
  trades: many(trades),
}));

export const tradesRelations = relations(trades, ({ one }) => ({
  tenant: one(tenants, {
    fields: [trades.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
  account: one(tradingAccounts, {
    fields: [trades.accountId],
    references: [tradingAccounts.id],
  }),
}));

export const traderProfilesRelations = relations(traderProfiles, ({ one }) => ({
  tenant: one(tenants, {
    fields: [traderProfiles.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [traderProfiles.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  tenant: one(tenants, {
    fields: [userProgress.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  tenant: one(tenants, {
    fields: [userBadges.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
}));

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    tenant: one(tenants, {
      fields: [challengeProgress.tenantId],
      references: [tenants.id],
    }),
    user: one(users, {
      fields: [challengeProgress.userId],
      references: [users.id],
    }),
  })
);

export const xpTransactionsRelations = relations(xpTransactions, ({ one }) => ({
  tenant: one(tenants, {
    fields: [xpTransactions.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [xpTransactions.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// TYPE EXPORTS
// ============================================================================
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProgress = typeof userProgress.$inferSelect;
export type NewUserProgress = typeof userProgress.$inferInsert;
export type UserBadge = typeof userBadges.$inferSelect;
export type NewUserBadge = typeof userBadges.$inferInsert;
export type ChallengeProgress = typeof challengeProgress.$inferSelect;
export type NewChallengeProgress = typeof challengeProgress.$inferInsert;
export type XpTransaction = typeof xpTransactions.$inferSelect;
export type NewXpTransaction = typeof xpTransactions.$inferInsert;
export type TraderProfile = typeof traderProfiles.$inferSelect;
export type NewTraderProfile = typeof traderProfiles.$inferInsert;
export type TradingAccount = typeof tradingAccounts.$inferSelect;
export type NewTradingAccount = typeof tradingAccounts.$inferInsert;
export type Trade = typeof trades.$inferSelect;
export type NewTrade = typeof trades.$inferInsert;
