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
  console.log("Connecting to Supabase for Reviewer schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL,
      executor_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      reviewer_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )`, "ai_reviews");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_rules (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      rule_type VARCHAR(50) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_rules");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_results (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
      rule_id VARCHAR(80) REFERENCES public.ai_review_rules(id) ON DELETE SET NULL,
      passed BOOLEAN DEFAULT TRUE,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_results");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_quality_scores (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
      completeness_score NUMERIC(4, 2),
      formatting_score NUMERIC(4, 2),
      reasoning_score NUMERIC(4, 2),
      overall_score NUMERIC(4, 2),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_quality_scores");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
      action_taken VARCHAR(100) NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_history");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      reviewer_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      reviews_count INT DEFAULT 0,
      corrections_requested_count INT DEFAULT 0,
      average_review_time_ms INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_metrics");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_findings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
      finding_type VARCHAR(40) NOT NULL,
      message TEXT NOT NULL,
      path TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_findings");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_suggestions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      finding_id UUID REFERENCES public.ai_review_findings(id) ON DELETE CASCADE,
      suggested_fix TEXT NOT NULL,
      applied BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_suggestions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_review_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      review_id UUID,
      actor_id VARCHAR(80),
      action VARCHAR(200) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_review_audit_logs");

  // RLS Policies
  for (const tbl of [
    "ai_reviews", "ai_review_rules", "ai_review_results", "ai_quality_scores",
    "ai_review_history", "ai_review_metrics", "ai_review_findings",
    "ai_review_suggestions", "ai_review_audit_logs"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.ai_review_rules (id, name, rule_type, details) VALUES
      ('JSON_SCHEMA_VALIDATION', 'Verify output JSON parses and aligns with required fields keys.', 'JSONSchema', '{}'::jsonb),
      ('BRAND_TONE_COMPLIANCE', 'Check tone aligns with professional minimal brand guide.', 'StyleGuide', '{}'::jsonb),
      ('BUDGET_CAP_ENFORCEMENT', 'Validate cost parameters do not breach maximum department limits.', 'BusinessRule', '{}'::jsonb)
    ON CONFLICT (id) DO NOTHING`, "Seed review rules");

  await client.end();
  console.log("\n✅ Reviewer engine tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
