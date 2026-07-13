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
  console.log("Connecting to Supabase for CEO schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_memory (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      key VARCHAR(100) NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_memory");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      report_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_decisions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      decision_type VARCHAR(100) NOT NULL,
      impact_level VARCHAR(30) DEFAULT 'Medium',
      details TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_decisions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_priorities (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      priority_order INT DEFAULT 1,
      status VARCHAR(40) DEFAULT 'Active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_priorities");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_company_health (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      health_score NUMERIC(5, 2) NOT NULL,
      metric_type VARCHAR(80) NOT NULL,
      details TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_company_health");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_strategy (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      milestone VARCHAR(200) NOT NULL,
      target_date DATE NOT NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_strategy");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_department_status (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      health VARCHAR(30) DEFAULT 'Healthy',
      tasks_count INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_department_status");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_founder_preferences (
      id VARCHAR(80) PRIMARY KEY,
      pref_value TEXT NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_founder_preferences");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_approval_queue (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      action VARCHAR(200) NOT NULL,
      requested_by VARCHAR(80) NOT NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      decided_at TIMESTAMPTZ
    )`, "ceo_approval_queue");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_daily_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      report_date DATE UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_daily_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_weekly_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      week_start DATE UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_weekly_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_monthly_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      month_start DATE UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_monthly_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_ai_costs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      cost_date DATE UNIQUE NOT NULL,
      total_cost NUMERIC(10, 6) DEFAULT 0.000000,
      tokens_used INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_ai_costs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ceo_growth_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      log_date DATE UNIQUE NOT NULL,
      new_users INT DEFAULT 0,
      revenue_inr NUMERIC(15, 2) DEFAULT 0.00,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ceo_growth_metrics");

  // RLS Policies
  for (const tbl of [
    "ceo_memory", "ceo_reports", "ceo_decisions", "ceo_priorities",
    "ceo_company_health", "ceo_strategy", "ceo_department_status",
    "ceo_founder_preferences", "ceo_approval_queue", "ceo_daily_reports",
    "ceo_weekly_reports", "ceo_monthly_reports", "ceo_ai_costs", "ceo_growth_metrics"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.ceo_department_status (id, name, health, tasks_count) VALUES
      ('DEP_MKT', 'Marketing Division', 'Healthy', 3),
      ('DEP_EDU', 'Education Division', 'Healthy', 8),
      ('DEP_FIN', 'Financial Operations', 'Healthy', 2)
    ON CONFLICT (id) DO NOTHING`, "Seed ceo_departments");

  await execSafe(`
    INSERT INTO public.ceo_priorities (title, priority_order) VALUES
      ('Optimize NEET Biology Promos', 1),
      ('Resolve candidate evaluation script latencies', 2)
    ON CONFLICT DO NOTHING`, "Seed priorities");

  await execSafe(`
    INSERT INTO public.ceo_approval_queue (action, requested_by, status, payload) VALUES
      ('Run database migration scripts 32_ceo.sql', 'CTO Agent', 'Pending', '{"schema": "32_ceo"}'::jsonb),
      ('Deploy new prize rules matrix for UPSC Elite Grandmaster Contest', 'CFO Agent', 'Pending', '{"bonus_rate": 0.05}'::jsonb)
    ON CONFLICT DO NOTHING`, "Seed approval queue");

  await client.end();
  console.log("\n✅ CEO schema tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
