import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL in environment');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('Connected!');

  console.log('📦 Creating public.latest_template_coverage materialized view...');
  await client.query(`
    DROP MATERIALIZED VIEW IF EXISTS public.latest_template_coverage CASCADE;
    CREATE MATERIALIZED VIEW public.latest_template_coverage AS
    SELECT 
        c.exam_name,
        c.subject_name,
        c.chapter_name,
        count(DISTINCT c.concept_id) AS total_concepts,
        count(DISTINCT t.concept_id) AS concepts_with_templates,
        count(t.template_id) AS total_templates,
        count(t.template_id) FILTER (WHERE t.difficulty_level = 'easy') AS easy_count,
        count(t.template_id) FILTER (WHERE t.difficulty_level = 'medium') AS medium_count,
        count(t.template_id) FILTER (WHERE t.difficulty_level = 'hard') AS hard_count,
        count(t.template_id) FILTER (WHERE t.difficulty_level = 'pro') AS pro_count,
        count(t.template_id) FILTER (WHERE t.difficulty_level = 'legend') AS legend_count,
        round(
            (count(DISTINCT t.concept_id)::numeric / NULLIF(count(DISTINCT c.concept_id), 0)::numeric) * 100,
            2
        ) AS coverage_percent
    FROM public.latest_concepts c
    LEFT JOIN public.latest_concept_templates t ON c.concept_id = t.concept_id
    GROUP BY c.exam_name, c.subject_name, c.chapter_name;
  `);

  console.log('🔄 Refreshing view...');
  await client.query('REFRESH MATERIALIZED VIEW public.latest_template_coverage;');
  console.log('✅ Mat view created and refreshed successfully!');

  // Reload cache
  await client.query("NOTIFY pgrst, 'reload schema';");
  console.log('Schema reloaded!');

  await client.end();
}

main().catch(err => console.error(err));
