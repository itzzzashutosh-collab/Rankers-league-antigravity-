// Migration runner via pg npm package
const { Client } = require('pg');

const sql = `
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS is_in_coaching BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS coaching_name TEXT,
  ADD COLUMN IF NOT EXISTS school_name TEXT;
`;

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:HjQFUHGBFBk4dVog@db.bgsdovlumtjwvcwzjnnn.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log('Connected to Supabase DB');
    await client.query(sql);
    console.log('Migration 08_extend_profiles completed successfully!');
    
    // Verify columns exist
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles' 
        AND column_name IN ('whatsapp_number','is_in_coaching','coaching_name','school_name')
      ORDER BY column_name;
    `);
    console.log('New columns verified:', JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

run();
