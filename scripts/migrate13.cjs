// Migration runner for Notifications & Announcement Systems via pg npm package
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const schemaSql = fs.readFileSync(
  path.join(__dirname, '../database/schemas/13_notification_system.sql'),
  'utf8'
);

const seedSql = fs.readFileSync(
  path.join(__dirname, '../database/seed/11_notifications_seed.sql'),
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
    
    console.log('Applying notifications schema...');
    await client.query(schemaSql);
    console.log('✓ Notifications schema applied successfully!');

    console.log('Applying notifications seed data...');
    await client.query(seedSql);
    console.log('✓ Notifications seed data applied successfully!');
  } catch (err) {
    console.error('Migration/Seeding error:', err.message, err.stack);
  } finally {
    await client.end();
  }
}

run();
