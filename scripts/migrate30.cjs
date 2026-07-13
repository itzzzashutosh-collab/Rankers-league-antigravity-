const { Client } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { console.error("DATABASE_URL missing"); process.exit(1); }

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function execSafe(sql, label) {
  try {
    await client.query(sql);
    console.log(`✅ ${label}`);
  } catch (err) {
    console.warn(`⚠️  Skipped [${label}]: ${err.message.split('\n')[0]}`);
  }
}

async function run() {
  console.log("Connecting to Supabase for Credentials schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_credentials (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      provider VARCHAR(60) NOT NULL,
      label VARCHAR(150) NOT NULL,
      api_key_masked VARCHAR(100) NOT NULL,
      api_key_encrypted TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_credentials");

  await execSafe(`ALTER TABLE public.ai_credentials ENABLE ROW LEVEL SECURITY`, "RLS ai_credentials");
  await execSafe(`CREATE POLICY "Admins access ai_credentials" ON public.ai_credentials FOR ALL TO authenticated USING (TRUE)`, "Policy ai_credentials");

  await execSafe(`
    INSERT INTO public.ai_credentials (provider, label, api_key_masked, is_active) VALUES
      ('OpenAI', 'Production GPT-4o Key', 'sk-proj-...XyZa', true),
      ('Anthropic', 'Marketing Claude Sonnet Key', 'sk-ant-api03-...qWrt', true),
      ('Gemini', 'Developer Pro Keys', 'AIzaSy...7m8n', true)
    ON CONFLICT DO NOTHING`, "Seed ai_credentials");

  await client.end();
  console.log("\n✅ Credentials tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
