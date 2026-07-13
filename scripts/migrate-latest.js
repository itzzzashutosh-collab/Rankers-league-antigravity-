#!/usr/bin/env node
/**
 * migrate-latest.js
 * Runs migration 38_latest_tables.sql against Supabase
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL in environment');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log('🔗 Connecting to Supabase PostgreSQL...');
  await client.connect();
  console.log('✅ Connected!');

  const sqlPath = path.resolve(__dirname, '../database/schemas/38_latest_tables.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('\n📦 Running migration: 38_latest_tables.sql');
  try {
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  }

  // Reload PostgREST schema
  try {
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('✅ PostgREST schema cache reloaded!');
  } catch (_) {}

  await client.end();
  console.log('\n🎉 Done!');
}

run().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
