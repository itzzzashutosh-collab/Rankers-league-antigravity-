import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL missing');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected!');

  console.log('🗑️ Dropping old latest tables...');
  await client.query(`
    DROP MATERIALIZED VIEW IF EXISTS public.latest_template_coverage CASCADE;
    DROP TABLE IF EXISTS public.latest_concept_templates CASCADE;
    DROP TABLE IF EXISTS public.latest_concepts CASCADE;
    DROP TABLE IF EXISTS public.latest_topics CASCADE;
    DROP TABLE IF EXISTS public.latest_chapters CASCADE;
    DROP TABLE IF EXISTS public.latest_subjects CASCADE;
    DROP TABLE IF EXISTS public.latest_exams CASCADE;
  `);
  console.log('✅ Dropped successfully!');

  await client.end();
}

main().catch(err => console.error(err));
