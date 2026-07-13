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
  console.log("Connecting to Supabase for CTO schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_architecture (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      design_title VARCHAR(200) NOT NULL,
      components JSONB DEFAULT '{}'::jsonb,
      rationale TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_architecture");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_engineering_projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      status VARCHAR(50) DEFAULT 'Planning',
      deadline DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_engineering_projects");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_deployments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      commit_sha VARCHAR(50) NOT NULL,
      environment VARCHAR(30) DEFAULT 'Staging',
      status VARCHAR(40) DEFAULT 'Success',
      release_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_deployments");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_incidents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      severity VARCHAR(30) DEFAULT 'Medium',
      status VARCHAR(40) DEFAULT 'Investigating',
      recovery_plan TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_incidents");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_bug_tracker (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      bug_title VARCHAR(250) NOT NULL,
      severity VARCHAR(30) DEFAULT 'Medium',
      status VARCHAR(40) DEFAULT 'Open',
      assigned_to VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_bug_tracker");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_performance (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      metric_type VARCHAR(100) NOT NULL,
      value NUMERIC(10, 4) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_performance");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_code_quality (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      build_id VARCHAR(100) NOT NULL,
      coverage_percentage NUMERIC(5, 2),
      type_safety_errors INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_code_quality");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_system_health (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      health VARCHAR(30) DEFAULT 'Healthy',
      latency_ms INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_system_health");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      report_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_decisions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      decision_details TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_decisions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_roadmap (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      feature VARCHAR(200) NOT NULL,
      target_quarter VARCHAR(30) NOT NULL,
      status VARCHAR(40) DEFAULT 'Planned',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_roadmap");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cto_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      average_api_latency_ms INT DEFAULT 0,
      caching_hit_percentage INT DEFAULT 95,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cto_metrics");

  // RLS Policies
  for (const tbl of [
    "cto_architecture", "cto_engineering_projects", "cto_deployments", "cto_incidents",
    "cto_bug_tracker", "cto_performance", "cto_code_quality", "cto_system_health",
    "cto_reports", "cto_decisions", "cto_roadmap", "cto_metrics"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.cto_system_health (id, name, health, latency_ms) VALUES
      ('supabase_db', 'Supabase Database Connection', 'Healthy', 12),
      ('redis_cache', 'Redis Transaction Caching', 'Healthy', 2),
      ('api_gateway', 'API Routing Gateway', 'Healthy', 8)
    ON CONFLICT (id) DO NOTHING`, "Seed cto_system_health");

  await execSafe(`
    INSERT INTO public.cto_deployments (commit_sha, environment, status, release_notes) VALUES
      ('c89ad12', 'Production', 'Success', 'Deployed secure AI credentials storage vaults.')
    ON CONFLICT DO NOTHING`, "Seed cto_deployments");

  await execSafe(`
    INSERT INTO public.cto_bug_tracker (bug_title, severity, status, assigned_to) VALUES
      ('Evaluation sync job triggers timeout', 'Critical', 'Open', 'AGENT_EXECUTOR'),
      ('Masked key display misalignment on mobile view', 'Minor', 'Open', 'AGENT_REVIEWER')
    ON CONFLICT DO NOTHING`, "Seed bug_tracker");

  await client.end();
  console.log("\n✅ CTO schema tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
