const { Client } = require("pg");
const fs = require("fs");
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
  console.log("Connecting to Supabase for AIOS Operating System Migration...");
  await client.connect();

  // Try pgvector extension setup
  await execSafe("CREATE EXTENSION IF NOT EXISTS vector", "pgvector extension");

  // Create tables individually
  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_departments (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      budget_limit_usd NUMERIC(12, 4) DEFAULT 100.0000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_departments");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_roles (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT
    )`, "ai_roles");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_capabilities (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description TEXT
    )`, "ai_capabilities");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_agents (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      department_id VARCHAR(50) REFERENCES public.ai_departments(id) ON DELETE SET NULL,
      role_id VARCHAR(50) REFERENCES public.ai_roles(id) ON DELETE SET NULL,
      model_name VARCHAR(100) NOT NULL,
      capabilities VARCHAR(80)[] DEFAULT '{}'::VARCHAR[],
      priority VARCHAR(20) DEFAULT 'Medium',
      status VARCHAR(40) DEFAULT 'Online',
      health_score INT DEFAULT 100,
      owner_id UUID,
      version VARCHAR(40) DEFAULT '1.0.0',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_agents");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      description TEXT,
      assigned_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      status VARCHAR(40) DEFAULT 'Queue',
      priority VARCHAR(20) DEFAULT 'Medium',
      payload JSONB DEFAULT '{}'::jsonb,
      result JSONB DEFAULT '{}'::jsonb,
      error_message TEXT,
      retry_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_tasks");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_task_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
      agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      action VARCHAR(150) NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_task_history");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_workflows (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(150) UNIQUE NOT NULL,
      description TEXT,
      trigger_event VARCHAR(100) NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_workflows");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_workflow_steps (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      workflow_id UUID REFERENCES public.ai_workflows(id) ON DELETE CASCADE,
      step_number INT NOT NULL,
      step_type VARCHAR(40) NOT NULL,
      config JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_workflow_steps");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      event_name VARCHAR(100) NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      processed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_events");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_messages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      sender_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      receiver_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      message_type VARCHAR(40) DEFAULT 'Direct',
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_messages");

  // Create ai_memory. If vector type fails, fallback to simple TEXT embedding metadata
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.ai_memory (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
        memory_type VARCHAR(40) NOT NULL,
        memory_key TEXT NOT NULL,
        memory_value TEXT NOT NULL,
        embedding VECTOR(1536),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`);
    console.log("✅ ai_memory (with vector support)");
  } catch (err) {
    console.warn(`⚠️ Vector column fail. Attempting fallback memory schema: ${err.message}`);
    await execSafe(`
      CREATE TABLE IF NOT EXISTS public.ai_memory (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
        memory_type VARCHAR(40) NOT NULL,
        memory_key TEXT NOT NULL,
        memory_value TEXT NOT NULL,
        embedding TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )`, "ai_memory (fallback)");
  }

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_prompt_registry (
      id VARCHAR(80) PRIMARY KEY,
      version INT NOT NULL DEFAULT 1,
      prompt_template TEXT NOT NULL,
      expected_output TEXT,
      validation_rules JSONB DEFAULT '{}'::jsonb,
      approved BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_prompt_registry");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_knowledge_sources (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(150) NOT NULL,
      category VARCHAR(60) NOT NULL,
      source_url TEXT,
      document_hash VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_knowledge_sources");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_tool_registry (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      tool_type VARCHAR(60) NOT NULL,
      config JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_tool_registry");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      agent_id VARCHAR(80),
      action VARCHAR(200) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_audit_logs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.ai_cost_tracking (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
      token_usage_input INT DEFAULT 0,
      token_usage_output INT DEFAULT 0,
      calculated_cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "ai_cost_tracking");

  // RLS Policies
  for (const tbl of [
    "ai_departments", "ai_roles", "ai_capabilities", "ai_agents", "ai_tasks",
    "ai_task_history", "ai_workflows", "ai_workflow_steps", "ai_events",
    "ai_messages", "ai_memory", "ai_prompt_registry", "ai_knowledge_sources",
    "ai_tool_registry", "ai_audit_logs", "ai_cost_tracking"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.ai_departments (id, name, description) VALUES
      ('DEP_EXEC', 'Executive Office', 'Task allocation, operational planner and CEOs orchestration.'),
      ('DEP_MKT', 'Marketing Team', 'SEO compose, contest announcements, platform upgrades outreach.'),
      ('DEP_FIN', 'Financial Desk', 'Auditing wallet ledgers, payouts review automation triggers.')
    ON CONFLICT (id) DO NOTHING`, "Seed departments");

  await execSafe(`
    INSERT INTO public.ai_roles (id, name, description) VALUES
      ('ROLE_CEO', 'CEO Chief', 'Executive department planner.'),
      ('ROLE_SPEC', 'Specialist Manager', 'Supervises workflow steps execution.'),
      ('ROLE_WRK', 'General Worker', 'Task executor.')
    ON CONFLICT (id) DO NOTHING`, "Seed roles");

  await execSafe(`
    INSERT INTO public.ai_capabilities (id, name, description) VALUES
      ('TEXT_COMPOSITION', 'Dynamic text creation', 'Can compose custom emails or marketing copy.'),
      ('FINANCE_AUDIT', 'Audit ledger items', 'Can review transactions for anomalies matching limits.')
    ON CONFLICT (id) DO NOTHING`, "Seed capabilities");

  await execSafe(`
    INSERT INTO public.ai_tool_registry (id, name, tool_type) VALUES
      ('supabase_client', 'Supabase Database Access', 'Supabase'),
      ('discord_webhook', 'Discord Notification Broadcaster', 'Discord'),
      ('fs_utility', 'System Filesystem read/write', 'Filesystem')
    ON CONFLICT (id) DO NOTHING`, "Seed tools");

  await execSafe(`
    INSERT INTO public.ai_prompt_registry (id, version, prompt_template, expected_output) VALUES
      ('CEO_PLANNER_PROMPT', 1, 'Analyze the active platform event: {{event}}. Suggest 3 core next steps.', 'JSON list format of next steps.'),
      ('MKT_ANNOUNCEMENT_PROMPT', 1, 'Compose a weekly email promo for contest: {{contest_title}} with entry fee {{fee}}.', 'Text email copy.')
    ON CONFLICT (id) DO NOTHING`, "Seed prompts");

  await execSafe(`
    INSERT INTO public.ai_agents (id, name, department_id, role_id, model_name, status, health_score) VALUES
      ('AGENT_CEO', 'Chief AI Executive', 'DEP_EXEC', 'ROLE_CEO', 'gpt-4o', 'Online', 98),
      ('AGENT_MKT', 'Campaign Marketing Manager', 'DEP_MKT', 'ROLE_SPEC', 'claude-3-5-sonnet', 'Online', 95)
    ON CONFLICT (id) DO NOTHING`, "Seed default agents");

  try { await client.query("NOTIFY pgrst, 'reload schema';"); console.log("PostgREST reloaded."); } catch {}
  await client.end();
  console.log("\n✅ AIOS database schema migration complete.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
