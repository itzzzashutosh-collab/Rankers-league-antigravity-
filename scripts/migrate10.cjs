// Migration runner for Wallet & Financial System via pg npm package
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const schemaSql = fs.readFileSync(
  path.join(__dirname, '../database/schemas/10_wallet_system.sql'),
  'utf8'
);

const seedSql = fs.readFileSync(
  path.join(__dirname, '../database/seed/09_wallet_seed.sql'),
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
    
    console.log('Applying wallet schema...');
    await client.query(schemaSql);
    console.log('✓ Wallet schema applied successfully!');

    console.log('Applying wallet seed data...');
    await client.query(seedSql);
    console.log('✓ Wallet seed data applied successfully!');
  } catch (err) {
    console.error('Migration/Seeding error:', err.message, err.stack);
  } finally {
    await client.end();
  }
}

run();
