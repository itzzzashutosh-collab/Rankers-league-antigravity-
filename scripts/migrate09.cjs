// Runs migration 09 (fix handle_new_user trigger) via pg driver
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const sql = fs.readFileSync(
  path.join(__dirname, '../database/schemas/09_fix_new_user_trigger.sql'),
  'utf8'
);

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:HjQFUHGBFBk4dVog@db.bgsdovlumtjwvcwzjnnn.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log('Connected to Supabase DB');
    await client.query(sql);
    console.log('✓ Trigger fix applied successfully!');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

run();
