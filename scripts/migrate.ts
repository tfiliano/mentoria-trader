import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function migrate() {
  console.log('Starting migration...');

  // Create trading_accounts table
  await sql`
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
    )
  `;
  console.log('Created trading_accounts table');

  // Create trades table
  await sql`
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
    )
  `;
  console.log('Created trades table');

  // Add foreign keys
  try {
    await sql`
      ALTER TABLE "trading_accounts"
      ADD CONSTRAINT "trading_accounts_tenant_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade
    `;
  } catch (e) {
    console.log('FK trading_accounts_tenant_id already exists');
  }

  try {
    await sql`
      ALTER TABLE "trading_accounts"
      ADD CONSTRAINT "trading_accounts_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade
    `;
  } catch (e) {
    console.log('FK trading_accounts_user_id already exists');
  }

  try {
    await sql`
      ALTER TABLE "trades"
      ADD CONSTRAINT "trades_tenant_id_fk"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE cascade
    `;
  } catch (e) {
    console.log('FK trades_tenant_id already exists');
  }

  try {
    await sql`
      ALTER TABLE "trades"
      ADD CONSTRAINT "trades_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade
    `;
  } catch (e) {
    console.log('FK trades_user_id already exists');
  }

  try {
    await sql`
      ALTER TABLE "trades"
      ADD CONSTRAINT "trades_account_id_fk"
      FOREIGN KEY ("account_id") REFERENCES "trading_accounts"("id") ON DELETE set null
    `;
  } catch (e) {
    console.log('FK trades_account_id already exists');
  }

  console.log('Migration complete!');
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  });
