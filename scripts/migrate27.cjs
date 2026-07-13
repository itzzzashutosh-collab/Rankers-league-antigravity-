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
  console.log("Connecting to Supabase for Planner & Agent Staging migration...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_skill_registry (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      purpose TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_skill_registry");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_skill_versions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      skill_id VARCHAR(80) REFERENCES public.ai_skill_registry(id) ON DELETE CASCADE,
      version VARCHAR(40) NOT NULL,
      rules_md TEXT,
      workflow_md TEXT,
      examples_md TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_skill_versions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_knowledge_registry (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_knowledge_registry");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_knowledge_registry_sources (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      registry_id VARCHAR(80) REFERENCES public.ai_knowledge_registry(id) ON DELETE CASCADE,
      title VARCHAR(150) NOT NULL,
      content_md TEXT,
      version VARCHAR(40) DEFAULT '1.0.0',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_knowledge_registry_sources");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_task_plans (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL,
      estimated_complexity VARCHAR(40) DEFAULT 'Medium',
      estimated_cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
      estimated_tokens INT DEFAULT 0,
      estimated_time_seconds INT DEFAULT 0,
      recommended_agent_id VARCHAR(80),
      risk_assessment TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_task_plans");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_execution_graphs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      plan_id UUID REFERENCES public.ai_task_plans(id) ON DELETE CASCADE,
      node_id VARCHAR(80) NOT NULL,
      label VARCHAR(150) NOT NULL,
      dependencies VARCHAR(80)[] DEFAULT '{}'::VARCHAR[],
      status VARCHAR(40) DEFAULT 'Pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_execution_graphs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_confidence_scores (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL,
      reasoning_score NUMERIC(4, 2) DEFAULT 1.00,
      evidence_score NUMERIC(4, 2) DEFAULT 1.00,
      knowledge_score NUMERIC(4, 2) DEFAULT 1.00,
      tools_score NUMERIC(4, 2) DEFAULT 1.00,
      overall_score NUMERIC(4, 2) DEFAULT 1.00,
      approved BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_confidence_scores");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_agent_templates (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description TEXT,
      yaml_config TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_agent_templates");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_model_registry (
      id VARCHAR(80) PRIMARY KEY,
      provider VARCHAR(60) NOT NULL,
      model_name VARCHAR(100) UNIQUE NOT NULL,
      temperature_default NUMERIC(3,2) DEFAULT 0.2,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_model_registry");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_agent_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      agent_id VARCHAR(80) NOT NULL,
      tasks_completed INT DEFAULT 0,
      tasks_failed INT DEFAULT 0,
      average_latency_ms INT DEFAULT 0,
      total_cost_usd NUMERIC(12, 6) DEFAULT 0.000000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_agent_metrics");

  // RLS Policies
  for (const tbl of [
    "ai_skill_registry", "ai_skill_versions", "ai_knowledge_registry",
    "ai_knowledge_registry_sources", "ai_task_plans", "ai_execution_graphs",
    "ai_confidence_scores", "ai_agent_templates", "ai_model_registry",
    "ai_agent_metrics"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.ai_model_registry (id, provider, model_name) VALUES
      ('gpt-4o', 'OpenAI', 'gpt-4o'),
      ('claude-3-5-sonnet', 'Anthropic', 'claude-3-5-sonnet'),
      ('gemini-1.5-pro', 'Gemini', 'gemini-1.5-pro')
    ON CONFLICT (id) DO NOTHING`, "Seed model registry");

  await execSafe(`
    INSERT INTO public.ai_skill_registry (id, name, purpose) VALUES
      ('planning', 'Task breakdown and sequencing steps.', 'Divide complex tasks into ordered execution steps.'),
      ('reasoning', 'Analyze events logic matching parameters.', 'Formulate logical inferences based on input payloads.'),
      ('review', 'Verify output alignment with prompt rules.', 'Analyze generated response body against constraints.')
    ON CONFLICT (id) DO NOTHING`, "Seed skill registry");

  await client.end();
  console.log("\n✅ Planner & Agent templates tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
