/**
 * Database Seed Script
 * Run with: npx tsx scripts/seed.ts
 *
 * Creates initial tenant and admin user for testing
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { hash } from 'bcryptjs';
import * as schema from '../src/lib/db/schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Create default tenant (mrthiagofx)
    console.log('Creating tenant: mrthiagofx');

    // Check if tenant exists
    const existingTenant = await db.query.tenants.findFirst({
      where: (tenants, { eq }) => eq(tenants.slug, 'mrthiagofx'),
    });

    let tenantId: string;

    if (existingTenant) {
      console.log(`✅ Tenant already exists: ${existingTenant.id}`);
      tenantId = existingTenant.id;
    } else {
      const [tenant] = await db
        .insert(schema.tenants)
        .values({
          slug: 'mrthiagofx',
          name: 'MrThiagoFX',
          primaryColor: '#00ff88',
          secondaryColor: '#00ccff',
          plan: 'enterprise',
          isActive: true,
        })
        .returning();

      console.log(`✅ Tenant created: ${tenant.id}`);
      tenantId = tenant.id;
    }

    // Check if admin user exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq, and }) =>
        and(
          eq(users.email, 'admin@mrthiagofx.com'),
          eq(users.tenantId, tenantId)
        ),
    });

    if (existingUser) {
      console.log('✅ Admin user already exists');
    } else {
      // Create admin user
      console.log('Creating admin user...');
      const passwordHash = await hash('Admin123!', 12);

      const [user] = await db
        .insert(schema.users)
        .values({
          tenantId,
          email: 'admin@mrthiagofx.com',
          passwordHash,
          name: 'Admin MrThiagoFX',
          role: 'tenant_admin',
          isActive: true,
        })
        .returning();

      console.log(`✅ Admin user created: ${user.id}`);

      // Create initial progress
      await db.insert(schema.userProgress).values({
        tenantId,
        userId: user.id,
        xp: 0,
        level: 1,
      });

      console.log('✅ User progress initialized');
    }

    // Create sample users
    const sampleUsers = [
      { name: 'João Trader', email: 'joao@teste.com', xp: 1500 },
      { name: 'Maria Day Trade', email: 'maria@teste.com', xp: 3500 },
      { name: 'Pedro Scalper', email: 'pedro@teste.com', xp: 500 },
    ];

    console.log('\nCreating sample users...');

    for (const sample of sampleUsers) {
      const exists = await db.query.users.findFirst({
        where: (users, { eq, and }) =>
          and(eq(users.email, sample.email), eq(users.tenantId, tenantId)),
      });

      if (exists) {
        console.log(`✅ Sample user already exists: ${sample.name}`);
        continue;
      }

      const passwordHash = await hash('Teste123!', 12);
      const [sampleUser] = await db
        .insert(schema.users)
        .values({
          tenantId,
          email: sample.email,
          passwordHash,
          name: sample.name,
          role: 'user',
          isActive: true,
        })
        .returning();

      await db.insert(schema.userProgress).values({
        tenantId,
        userId: sampleUser.id,
        xp: sample.xp,
        level: calculateLevel(sample.xp),
        totalTrades: Math.floor(sample.xp / 15),
        winningTrades: Math.floor(sample.xp / 25),
      });

      console.log(`✅ Sample user created: ${sample.name}`);
    }

    console.log('\n🎉 Seed complete!');
    console.log('\n📋 Login credentials:');
    console.log('   Tenant: mrthiagofx');
    console.log('   Email: admin@mrthiagofx.com');
    console.log('   Password: Admin123!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

function calculateLevel(xp: number): number {
  const thresholds = [0, 100, 500, 1500, 3500, 7500, 15000, 30000, 50000, 75000, 100000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      return Math.min(i + 1, 10);
    }
  }
  return 1;
}

seed();
