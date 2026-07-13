import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL missing');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected!');

  const { rows } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name LIKE 'latest_%';
  `);
  console.log('Tables found:', rows);

  for (const r of rows) {
    const { rows: countRows } = await client.query(`SELECT count(*) FROM public.${r.table_name}`);
    console.log(`- ${r.table_name}: ${countRows[0].count} rows`);
  }

  await client.end();
}

main().catch(err => console.error(err));
