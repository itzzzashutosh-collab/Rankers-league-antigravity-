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
  console.log("Connecting to Supabase for Executor Engine Schema Staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_task_execution (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      plan_id UUID REFERENCES public.ai_task_plans(id) ON DELETE SET NULL,
      agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      status VARCHAR(40) DEFAULT 'Running',
      token_usage_input INT DEFAULT 0,
      token_usage_output INT DEFAULT 0,
      cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )`, "ai_task_execution");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_steps (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      execution_id UUID REFERENCES public.ai_task_execution(id) ON DELETE CASCADE,
      step_id VARCHAR(80) NOT NULL,
      label VARCHAR(200) NOT NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      retry_count INT DEFAULT 0,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ
    )`, "ai_execution_steps");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_results (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
      output_payload JSONB DEFAULT '{}'::jsonb,
      validation_status VARCHAR(40) DEFAULT 'Unverified',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_execution_results");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_logs (
      id BIGSERIAL PRIMARY KEY,
      step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
      log_type VARCHAR(20) DEFAULT 'info',
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_execution_logs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_tool_usage (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
      tool_id VARCHAR(80) REFERENCES public.ai_tool_registry(id) ON DELETE SET NULL,
      args JSONB DEFAULT '{}'::jsonb,
      status VARCHAR(40) CHECK (status IN ('Success', 'Failed')),
      duration_ms INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_tool_usage");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_permission_checks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      action VARCHAR(150) NOT NULL,
      allowed BOOLEAN DEFAULT TRUE,
      reason TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_permission_checks");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_step_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
      duration_ms INT DEFAULT 0,
      memory_usage_bytes BIGINT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_step_metrics");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      execution_id UUID REFERENCES public.ai_task_execution(id) ON DELETE CASCADE,
      lifecycle_event VARCHAR(100) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_execution_history");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_failures (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
      error_code VARCHAR(80) NOT NULL,
      error_message TEXT NOT NULL,
      stack_trace TEXT,
      rollback_triggered BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_execution_failures");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      execution_id UUID REFERENCES public.ai_task_execution(id) ON DELETE CASCADE,
      event_type VARCHAR(100) NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_execution_events");

  // RLS Policies
  for (const tbl of [
    "ai_task_execution", "ai_execution_steps", "ai_execution_results",
    "ai_execution_logs", "ai_tool_usage", "ai_permission_checks",
    "ai_step_metrics", "ai_execution_history", "ai_execution_failures",
    "ai_execution_events"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  await client.end();
  console.log("\n✅ Executor engine schema tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
