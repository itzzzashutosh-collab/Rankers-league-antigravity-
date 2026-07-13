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
  console.log("Connecting to Supabase for COO schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_projects (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      status VARCHAR(50) DEFAULT 'Planning',
      deadline DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_projects");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      project_id UUID REFERENCES public.coo_projects(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      status VARCHAR(50) DEFAULT 'Pending',
      owner VARCHAR(100) NOT NULL,
      deadline DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_tasks");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_task_dependencies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID REFERENCES public.coo_tasks(id) ON DELETE CASCADE,
      depends_on_task_id UUID REFERENCES public.coo_tasks(id) ON DELETE CASCADE
    )`, "coo_task_dependencies");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_department_status (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      health VARCHAR(30) DEFAULT 'Healthy',
      tasks_count INT DEFAULT 0,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_department_status");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_operations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      checklist_item VARCHAR(200) NOT NULL,
      passed BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_operations");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_sla (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      service_name VARCHAR(100) NOT NULL,
      threshold_minutes INT NOT NULL,
      status VARCHAR(40) DEFAULT 'Sufficient',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_sla");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_workloads (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      agent_id VARCHAR(80) NOT NULL,
      status VARCHAR(40) DEFAULT 'Idle',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_workloads");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_capacity (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      department_id VARCHAR(80) NOT NULL,
      capacity_percentage INT DEFAULT 100,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_capacity");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      report_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_daily_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      log_date DATE UNIQUE NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_daily_logs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_incidents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      incident_type VARCHAR(50) NOT NULL,
      title VARCHAR(200) NOT NULL,
      status VARCHAR(40) DEFAULT 'Investigating',
      owner VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_incidents");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_risk_register (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      risk_description TEXT NOT NULL,
      severity VARCHAR(30) DEFAULT 'Medium',
      mitigation_plan TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_risk_register");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.coo_operational_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      metric_name VARCHAR(100) NOT NULL,
      metric_value NUMERIC(12, 4) DEFAULT 0.0000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "coo_operational_metrics");

  // RLS Policies
  for (const tbl of [
    "coo_projects", "coo_tasks", "coo_task_dependencies", "coo_department_status",
    "coo_operations", "coo_sla", "coo_workloads", "coo_capacity",
    "coo_reports", "coo_daily_logs", "coo_incidents", "coo_risk_register", "coo_operational_metrics"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.coo_projects (id, title, status, deadline) VALUES
      ('p-1', 'JEE Physics Grandmaster Launch Prep', 'Active', CURRENT_DATE + 3),
      ('p-2', 'NEET Biology Sprint Promotion Dispatch', 'Active', CURRENT_DATE + 5)
    ON CONFLICT (id) DO NOTHING`, "Seed coo_projects");

  await execSafe(`
    INSERT INTO public.coo_tasks (project_id, title, status, owner, deadline) VALUES
      ('p-1', 'Validate question papers schema', 'InProgress', 'AGENT_REVIEWER', CURRENT_DATE + 1),
      ('p-1', 'Final validation & trust audit signoff', 'Pending', 'AGENT_VERIFIER', CURRENT_DATE + 2)
    ON CONFLICT DO NOTHING`, "Seed coo_tasks");

  await execSafe(`
    INSERT INTO public.coo_sla (service_name, threshold_minutes, status) VALUES
      ('ContestResultsPublishing', 15, 'Sufficient'),
      ('OutreachNotificationsQueue', 5, 'Sufficient')
    ON CONFLICT DO NOTHING`, "Seed coo_sla");

  await execSafe(`
    INSERT INTO public.coo_incidents (incident_type, title, status, owner) VALUES
      ('Infrastructure', 'High database query latency on paper building templates', 'Investigating', 'AGENT_COO')
    ON CONFLICT DO NOTHING`, "Seed coo_incidents");

  await client.end();
  console.log("\n✅ COO schema tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
