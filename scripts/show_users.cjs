// Query user profiles and auth details from Supabase to show testing credentials
const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: 'postgresql://postgres:HjQFUHGBFBk4dVog@db.bgsdovlumtjwvcwzjnnn.supabase.co:5432/postgres',
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log('Connected to Supabase DB');
    
    // Fetch profiles joined with auth.users
    const res = await client.query(`
      SELECT p.id, p.username, p.full_name, p.aura_points, p.national_rank, u.email 
      FROM profiles p
      JOIN auth.users u ON p.id = u.id
      LIMIT 10
    `);
    
    console.log('\n--- SEEDED USER PROFILES WITH EMAILS ---');
    res.rows.forEach((row, i) => {
      console.log(`${i+1}. Username: @${row.username}`);
      console.log(`   Full Name: ${row.full_name}`);
      console.log(`   Email: ${row.email}`);
      console.log(`   Aura Points: ${row.aura_points}`);
      console.log(`   National Rank: #${row.national_rank}`);
      console.log(`   Public Profile Link: http://localhost:3000/profile/${row.username}`);
      console.log(`   Local Dashboard Path: http://localhost:3000/dashboard`);
      console.log('-------------------------------------------');
    });
  } catch (err) {
    console.error('Error fetching profiles:', err.message);
  } finally {
    await client.end();
  }
}

run();
