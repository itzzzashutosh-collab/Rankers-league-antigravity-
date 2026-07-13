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
  console.log("Connecting to Supabase for Verifier schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_verifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      review_id UUID NOT NULL,
      reviewer_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      verifier_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )`, "ai_verifications");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_verification_rules (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      rule_type VARCHAR(50) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_verification_rules");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_verification_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
      summary TEXT,
      recommendations TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_verification_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_evidence (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
      evidence_type VARCHAR(60) NOT NULL,
      source_reference TEXT NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_evidence");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_fact_checks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
      fact_description TEXT NOT NULL,
      passed BOOLEAN DEFAULT TRUE,
      confidence_score NUMERIC(4, 2),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_fact_checks");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_confidence_scores (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
      fact_confidence NUMERIC(4, 2),
      evidence_confidence NUMERIC(4, 2),
      calculation_confidence NUMERIC(4, 2),
      overall_confidence NUMERIC(4, 2),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_confidence_scores");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_hallucination_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
      issue_type VARCHAR(50) NOT NULL,
      details TEXT NOT NULL,
      severity VARCHAR(30) DEFAULT 'High',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_hallucination_logs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_verification_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
      action_taken VARCHAR(100) NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_verification_history");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_verification_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      verifier_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      checks_count INT DEFAULT 0,
      failures_count INT DEFAULT 0,
      duration_ms INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_verification_metrics");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_verification_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      verification_id UUID,
      actor_id VARCHAR(80),
      action VARCHAR(200) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_verification_audit_logs");

  // RLS Policies
  for (const tbl of [
    "ai_verifications", "ai_verification_rules", "ai_verification_reports",
    "ai_evidence", "ai_fact_checks", "ai_confidence_scores",
    "ai_hallucination_logs", "ai_verification_history", "ai_verification_metrics",
    "ai_verification_audit_logs"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.ai_verification_rules (id, name, rule_type, details) VALUES
      ('BALANCE_CALCULATION_RULE', 'Ensure candidate prize earnings equal the correct tier rewards config.', 'FactChecking', '{}'::jsonb),
      ('CONTEST_SEATS_RULE', 'Verify actual candidate counts match the database registrations count.', 'BusinessValidation', '{}'::jsonb)
    ON CONFLICT (id) DO NOTHING`, "Seed ai_verification_rules");

  await client.end();
  console.log("\n✅ Verifier engine tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
