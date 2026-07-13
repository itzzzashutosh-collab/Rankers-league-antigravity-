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
  console.log('🔗 Connecting to database...');
  await client.connect();
  console.log('✅ Connected!');

  console.log('📦 Creating public.latest_concept_templates table structure...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.latest_concept_templates (
      LIKE public.rl_concept_templates INCLUDING ALL
    );
  `);
  console.log('✅ Table created!');

  console.log('📥 Copying 52K+ templates into latest_concept_templates...');
  const res = await client.query(`
    INSERT INTO public.latest_concept_templates 
    SELECT * FROM public.rl_concept_templates 
    ON CONFLICT (template_id) DO NOTHING;
  `);
  console.log(`✅ Copy complete! Copied ${res.rowCount} rows.`);

  // Verify count
  const countRes = await client.query(`SELECT count(*) FROM public.latest_concept_templates;`);
  console.log(`📊 Total rows in public.latest_concept_templates: ${countRes.rows[0].count}`);

  // Reload cache
  console.log('🔄 Reloading PostgREST schema cache...');
  await client.query("NOTIFY pgrst, 'reload schema';");
  console.log('✅ Schema reloaded!');

  await client.end();
  console.log('🎉 Done!');
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
