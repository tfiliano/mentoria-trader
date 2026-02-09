CREATE TABLE IF NOT EXISTS "challenge_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_id" varchar(50) NOT NULL,
	"day_number" integer NOT NULL,
	"completed_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_day_per_challenge" UNIQUE("user_id","challenge_id","day_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" text NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"custom_domain" varchar(255),
	"logo_url" text,
	"primary_color" varchar(7) DEFAULT '#00ff88',
	"secondary_color" varchar(7) DEFAULT '#00ccff',
	"settings" jsonb DEFAULT '{}'::jsonb,
	"plan" varchar(20) DEFAULT 'starter',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "tenants_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trader_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"trading_experience" varchar(20),
	"trading_time" varchar(20),
	"biggest_difficulty" text,
	"biggest_fear" text,
	"has_active_account" boolean,
	"accounts_currency" varchar(3) DEFAULT 'USD',
	"accounts_value" integer DEFAULT 0,
	"current_performance" varchar(20),
	"trader_type" varchar(20),
	"trades_per_day" varchar(20),
	"assets_forex" boolean DEFAULT false,
	"assets_indices" boolean DEFAULT false,
	"assets_commodities" boolean DEFAULT false,
	"assets_crypto" boolean DEFAULT false,
	"has_trading_plan" varchar(20),
	"follows_rules" varchar(20),
	"uses_stop_loss" varchar(20),
	"moves_stop_loss" varchar(20),
	"risk_per_trade" integer,
	"strategy_description" text,
	"stop_loss_definition" text,
	"take_profit_definition" text,
	"trading_session" varchar(100),
	"minimum_rr" varchar(20),
	"uses_prop_firm" boolean DEFAULT false,
	"uses_own_capital" boolean DEFAULT false,
	"has_prop_account" boolean,
	"prop_firm_name" varchar(50),
	"trading_goals" text,
	"monthly_income_target" integer,
	"target_timeframe" varchar(10),
	"main_focus" varchar(20),
	"lost_prop_accounts" varchar(10),
	"loss_reason" varchar(30),
	"demo_vs_real_behavior" varchar(30),
	"onboarding_completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "trader_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"account_id" uuid,
	"asset" varchar(20) NOT NULL,
	"direction" varchar(10) NOT NULL,
	"entry_price" integer,
	"exit_price" integer,
	"stop_loss" integer,
	"take_profit" integer,
	"lot_size" varchar(20),
	"result" varchar(10) NOT NULL,
	"profit_loss" integer DEFAULT 0,
	"profit_loss_pips" integer,
	"entry_time" timestamp with time zone,
	"exit_time" timestamp with time zone,
	"screenshot" text,
	"notes" text,
	"emotions" varchar(50),
	"followed_plan" boolean,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "trading_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"account_type" varchar(20) DEFAULT 'personal' NOT NULL,
	"broker" varchar(50),
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"initial_balance" integer DEFAULT 0 NOT NULL,
	"current_balance" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_badges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"badge_id" varchar(50) NOT NULL,
	"earned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_badge_per_user" UNIQUE("user_id","badge_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"total_trades" integer DEFAULT 0,
	"winning_trades" integer DEFAULT 0,
	"current_streak" integer DEFAULT 0,
	"best_streak" integer DEFAULT 0,
	"last_activity_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_progress_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255),
	"name" varchar(255) NOT NULL,
	"role" varchar(20) DEFAULT 'user',
	"avatar_url" text,
	"is_active" boolean DEFAULT true,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_email_per_tenant" UNIQUE("tenant_id","email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token"),
	CONSTRAINT "unique_identifier_token" UNIQUE("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "xp_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"reason" varchar(100) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_progress" ADD CONSTRAINT "challenge_progress_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge_progress" ADD CONSTRAINT "challenge_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trader_profiles" ADD CONSTRAINT "trader_profiles_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trader_profiles" ADD CONSTRAINT "trader_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trades" ADD CONSTRAINT "trades_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trades" ADD CONSTRAINT "trades_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trades" ADD CONSTRAINT "trades_account_id_trading_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."trading_accounts"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trading_accounts" ADD CONSTRAINT "trading_accounts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "trading_accounts" ADD CONSTRAINT "trading_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "xp_transactions" ADD CONSTRAINT "xp_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
