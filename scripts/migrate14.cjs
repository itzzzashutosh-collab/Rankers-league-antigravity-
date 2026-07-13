// Migration runner for Contest Registration, Enrollment & Verification Systems
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const schemaSql = fs.readFileSync(
  path.join(__dirname, '../database/schemas/14_contest_registration.sql'),
  'utf8'
);

const seedSql = fs.readFileSync(
  path.join(__dirname, '../database/seed/12_contest_registration_seed.sql'),
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
    
    console.log('Applying contest registration schema...');
    await client.query(schemaSql);
    console.log('✓ Contest registration schema applied successfully!');

    console.log('Applying contest registration seed data...');
    await client.query(seedSql);
    console.log('✓ Contest registration seed data applied successfully!');
  } catch (err) {
    console.error('Migration/Seeding error:', err.message, err.stack);
  } finally {
    await client.end();
  }
}

run();
