import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function find() {
  const users = await sql`SELECT id, email, name, created_at FROM users ORDER BY created_at DESC`;
  console.log('Todos os usuários (ordenados por data):');
  console.table(users);
}

find();
