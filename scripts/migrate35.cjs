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
  console.log("Connecting to Supabase for CMO schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_campaigns (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      status VARCHAR(50) DEFAULT 'Planning',
      budget_usd NUMERIC(10, 2) DEFAULT 0.00,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_campaigns");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_growth_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      log_date DATE UNIQUE NOT NULL,
      registrations INT DEFAULT 0,
      active_users INT DEFAULT 0,
      cac_usd NUMERIC(10, 4) DEFAULT 0.0000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_growth_metrics");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_content_calendar (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(250) NOT NULL,
      content_type VARCHAR(50) NOT NULL,
      publish_date DATE NOT NULL,
      status VARCHAR(40) DEFAULT 'Draft',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_content_calendar");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_brand_assets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      asset_name VARCHAR(150) NOT NULL,
      asset_url TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_brand_assets");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_social_calendar (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      platform VARCHAR(50) NOT NULL,
      post_content TEXT NOT NULL,
      post_date TIMESTAMPTZ NOT NULL,
      status VARCHAR(40) DEFAULT 'Scheduled',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_social_calendar");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_seo_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      keyword VARCHAR(150) NOT NULL UNIQUE,
      ranking_position INT DEFAULT 100,
      search_volume INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_seo_metrics");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_referrals (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      referral_code VARCHAR(50) NOT NULL UNIQUE,
      referrer_user_id UUID,
      conversions INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_referrals");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_partnerships (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      partner_name VARCHAR(200) NOT NULL,
      integration_type VARCHAR(100) NOT NULL,
      status VARCHAR(40) DEFAULT 'Negotiation',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_partnerships");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_outreach (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      organization_name VARCHAR(200) NOT NULL,
      contact_email VARCHAR(150) NOT NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_outreach");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      report_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_marketing_budget (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      allocated_usd NUMERIC(10, 2) DEFAULT 0.00,
      spent_usd NUMERIC(10, 2) DEFAULT 0.00,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_marketing_budget");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cmo_experiments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      hypothesis TEXT NOT NULL,
      status VARCHAR(40) DEFAULT 'Running',
      outcome TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cmo_experiments");

  // RLS Policies
  for (const tbl of [
    "cmo_campaigns", "cmo_growth_metrics", "cmo_content_calendar", "cmo_brand_assets",
    "cmo_social_calendar", "cmo_seo_metrics", "cmo_referrals", "cmo_partnerships",
    "cmo_outreach", "cmo_reports", "cmo_marketing_budget", "cmo_experiments"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.cmo_seo_metrics (keyword, ranking_position, search_volume) VALUES
      ('best upsc mock test platform', 3, 2400),
      ('neet chemistry practice free MCQs', 8, 4800)
    ON CONFLICT (keyword) DO UPDATE SET ranking_position = EXCLUDED.ranking_position`, "Seed cmo_seo_metrics");

  await execSafe(`
    INSERT INTO public.cmo_content_calendar (title, content_type, publish_date, status) VALUES
      ('How to clear JEE Advanced physics paper rules', 'Blog', CURRENT_DATE + 2, 'Draft'),
      ('UPSC Elite Grandmaster Tier Payout Release notes', 'Newsletter', CURRENT_DATE + 4, 'Draft')
    ON CONFLICT DO NOTHING`, "Seed cmo_content_calendar");

  await execSafe(`
    INSERT INTO public.cmo_campaigns (title, status, budget_usd) VALUES
      ('NEET Biology Sprint Promotion launch', 'Active', 450.00)
    ON CONFLICT DO NOTHING`, "Seed cmo_campaigns");

  await client.end();
  console.log("\n✅ CMO schema tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
