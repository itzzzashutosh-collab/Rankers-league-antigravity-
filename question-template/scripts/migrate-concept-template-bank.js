#!/usr/bin/env node
/**
 * migrate-concept-template-bank.js
 * Runs migration 37_concept_template_bank.sql against Supabase
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

  const sqlPath = path.resolve(__dirname, '../database/schemas/37_concept_template_bank.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log('\n📦 Running migration: 37_concept_template_bank.sql');
  try {
    await client.query(sql);
    console.log('✅ Migration completed successfully!');
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('ℹ️  Some elements already exist — that is fine, skipping duplicates.');
    } else {
      console.error('❌ Migration error:', err.message);
    }
  }

  // Reload PostgREST schema
  try {
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log('✅ PostgREST schema cache reloaded!');
  } catch (_) {}

  await client.end();
  console.log('\n🎉 Done! Tables created:');
  console.log('  - rl_exams');
  console.log('  - rl_subjects');
  console.log('  - rl_chapters');
  console.log('  - rl_topics');
  console.log('  - rl_concepts');
  console.log('  - rl_formula_metadata');
  console.log('  - rl_concept_templates');
  console.log('  - rl_template_variations');
  console.log('  - rl_template_coverage (materialized view)');
  console.log('\n📌 Next: npm run seed:templates');
}

run().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
