import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function check() {
  const users = await sql`SELECT id, email, name, role FROM users ORDER BY created_at DESC LIMIT 10`;
  console.log('Últimos usuários cadastrados:');
  console.table(users);
}

check();
