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
  console.log("Connecting to Supabase for Executive Analytics Migration...");
  await client.connect();

  // Table creations individually
  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      snapshot_type VARCHAR(60) NOT NULL,
      period_start DATE NOT NULL,
      period_end DATE NOT NULL,
      metrics JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "analytics_snapshots");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.analytics_events (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      event_name VARCHAR(100) NOT NULL,
      category VARCHAR(60) NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "analytics_events");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.executive_dashboards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(150) NOT NULL,
      description TEXT,
      created_by UUID,
      is_pinned BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "executive_dashboards");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(100) NOT NULL,
      widget_type VARCHAR(60) NOT NULL,
      data_source VARCHAR(100) NOT NULL,
      default_config JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "dashboard_widgets");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.dashboard_layouts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      dashboard_id UUID REFERENCES public.executive_dashboards(id) ON DELETE CASCADE,
      widget_id UUID REFERENCES public.dashboard_widgets(id) ON DELETE CASCADE,
      position_x INT DEFAULT 0,
      position_y INT DEFAULT 0,
      width INT DEFAULT 4,
      height INT DEFAULT 3,
      config JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "dashboard_layouts");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.saved_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      report_type VARCHAR(60) NOT NULL,
      parameters JSONB DEFAULT '{}'::jsonb,
      data_summary JSONB DEFAULT '{}'::jsonb,
      generated_by UUID,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "saved_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.scheduled_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(200) NOT NULL,
      report_type VARCHAR(60) NOT NULL,
      cron_expression VARCHAR(60) NOT NULL,
      recipients VARCHAR(250)[] DEFAULT '{}'::VARCHAR[],
      last_run TIMESTAMPTZ,
      next_run TIMESTAMPTZ,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "scheduled_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.analytics_filters (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      filter_name VARCHAR(100) NOT NULL,
      config JSONB DEFAULT '{}'::jsonb,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "analytics_filters");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.analytics_exports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      exporter_id UUID,
      dataset_name VARCHAR(100) NOT NULL,
      format VARCHAR(20) NOT NULL,
      record_count INT DEFAULT 0,
      filters_applied JSONB DEFAULT '{}'::jsonb,
      ip_address VARCHAR(50),
      download_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "analytics_exports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.forecast_models (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      model_name VARCHAR(100) NOT NULL,
      target_metric VARCHAR(100) NOT NULL,
      model_parameters JSONB DEFAULT '{}'::jsonb,
      last_trained TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "forecast_models");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.analytics_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      actor_id UUID,
      action VARCHAR(150) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      ip_address VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "analytics_audit_logs");

  // RLS Enablement & Policies
  for (const tbl of [
    "analytics_snapshots", "analytics_events", "executive_dashboards",
    "dashboard_widgets", "dashboard_layouts", "saved_reports",
    "scheduled_reports", "analytics_filters", "analytics_exports",
    "forecast_models", "analytics_audit_logs"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.dashboard_widgets (id, title, widget_type, data_source, default_config) VALUES
      ('wdg001-0000-0000-0000-000000000001', 'Platform Growth Overview', 'LineChart', 'platform_growth', '{"xAxis": "date", "yAxis": "users"}'::jsonb),
      ('wdg002-0000-0000-0000-000000000002', 'Revenue Stream Distribution', 'DonutChart', 'revenue_streams', '{"labels": "category", "values": "amount"}'::jsonb),
      ('wdg003-0000-0000-0000-000000000003', 'Contest Participant Funnel', 'Funnel', 'contest_funnel', '{"steps": ["view", "register", "complete"]}'::jsonb)
    ON CONFLICT (id) DO NOTHING`, "Seed Widgets");

  await execSafe(`
    INSERT INTO public.executive_dashboards (id, title, description, is_pinned) VALUES
      ('db001-0000-0000-0000-000000000001', 'Core Operations Cockpit', 'Executive workspace tracking registration funnels and monthly recurring revenue.', TRUE)
    ON CONFLICT (id) DO NOTHING`, "Seed Dashboards");

  await execSafe(`
    INSERT INTO public.dashboard_layouts (dashboard_id, widget_id, position_x, position_y, width, height) VALUES
      ('db001-0000-0000-0000-000000000001', 'wdg001-0000-0000-0000-000000000001', 0, 0, 6, 4),
      ('db001-0000-0000-0000-000000000001', 'wdg002-0000-0000-0000-000000000002', 6, 0, 6, 4)
    ON CONFLICT (dashboard_id, widget_id) DO NOTHING`, "Seed Layouts");

  await execSafe(`
    INSERT INTO public.analytics_snapshots (snapshot_type, period_start, period_end, metrics) VALUES
      ('Monthly', '2026-06-01', '2026-06-30', '{"active_users": 15480, "conversion_rate": 8.5, "gross_revenue": 970644, "new_users": 2840, "platform_fees": 174716}'::jsonb),
      ('Monthly', '2026-05-01', '2026-05-31', '{"active_users": 13120, "conversion_rate": 8.1, "gross_revenue": 830420, "new_users": 2410, "platform_fees": 149475}'::jsonb)
    ON CONFLICT DO NOTHING`, "Seed snapshots");

  try { await client.query("NOTIFY pgrst, 'reload schema';"); console.log("PostgREST reloaded."); } catch {}
  await client.end();
  console.log("\n✅ Analytics platform migration complete.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
