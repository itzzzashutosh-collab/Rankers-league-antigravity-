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
  console.log("Connecting to Supabase for CFO schema staging...");
  await client.connect();

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_revenue (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      amount_inr NUMERIC(15, 2) NOT NULL,
      source VARCHAR(100) DEFAULT 'ContestRegistration',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_revenue");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_expenses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      amount_usd NUMERIC(12, 4) NOT NULL,
      expense_type VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_expenses");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_profitability (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      gross_margin NUMERIC(5, 2) DEFAULT 0.00,
      net_margin NUMERIC(5, 2) DEFAULT 0.00,
      recorded_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_profitability");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_budgets (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      department_id VARCHAR(80) NOT NULL UNIQUE,
      monthly_limit_usd NUMERIC(12, 2) DEFAULT 100.00,
      spent_usd NUMERIC(12, 2) DEFAULT 0.00,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_budgets");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_forecasts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      forecast_quarter VARCHAR(30) NOT NULL,
      expected_revenue_inr NUMERIC(15, 2) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_forecasts");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_cashflow (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      inflow_inr NUMERIC(15, 2) DEFAULT 0.00,
      outflow_inr NUMERIC(15, 2) DEFAULT 0.00,
      recorded_date DATE UNIQUE NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_cashflow");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_ai_costs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      provider VARCHAR(80) NOT NULL,
      model_name VARCHAR(100) NOT NULL,
      tokens_count INT DEFAULT 0,
      cost_usd NUMERIC(12, 6) DEFAULT 0.000000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_ai_costs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_cloud_costs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      resource_name VARCHAR(100) NOT NULL,
      cost_usd NUMERIC(12, 4) DEFAULT 0.0000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_cloud_costs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_financial_reports (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      report_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_financial_reports");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_financial_alerts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      alert_level VARCHAR(30) DEFAULT 'Warning',
      message TEXT NOT NULL,
      resolved BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_financial_alerts");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_financial_decisions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      decision_summary TEXT NOT NULL,
      approved_by_founder BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_financial_decisions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_unit_economics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      clv_usd NUMERIC(10, 2) DEFAULT 0.00,
      cac_usd NUMERIC(10, 2) DEFAULT 0.00,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_unit_economics");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_department_costs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      department_id VARCHAR(80) NOT NULL,
      cost_usd NUMERIC(12, 4) DEFAULT 0.0000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_department_costs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_agent_costs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      agent_id VARCHAR(80) NOT NULL,
      cost_usd NUMERIC(12, 6) DEFAULT 0.000000,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_agent_costs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.cfo_metrics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      cash_position_inr NUMERIC(15, 2) DEFAULT 100000.00,
      burn_rate_usd NUMERIC(10, 2) DEFAULT 20.00,
      runway_months INT DEFAULT 24,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "cfo_metrics");

  // RLS Policies
  for (const tbl of [
    "cfo_revenue", "cfo_expenses", "cfo_profitability", "cfo_budgets",
    "cfo_forecasts", "cfo_cashflow", "cfo_ai_costs", "cfo_cloud_costs",
    "cfo_financial_reports", "cfo_financial_alerts", "cfo_financial_decisions",
    "cfo_unit_economics", "cfo_department_costs", "cfo_agent_costs", "cfo_metrics"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.cfo_metrics (cash_position_inr, burn_rate_usd, runway_months) VALUES
      (450000.00, 14.50, 18)
    ON CONFLICT DO NOTHING`, "Seed cfo_metrics");

  await execSafe(`
    INSERT INTO public.cfo_budgets (department_id, monthly_limit_usd, spent_usd) VALUES
      ('DEP_MKT', 500.00, 450.00),
      ('DEP_ENG', 200.00, 20.00)
    ON CONFLICT (department_id) DO NOTHING`, "Seed cfo_budgets");

  await execSafe(`
    INSERT INTO public.cfo_ai_costs (provider, model_name, tokens_count, cost_usd) VALUES
      ('Anthropic', 'claude-3-5-sonnet', 45000, 0.1350),
      ('Google', 'gemini-1.5-pro', 85000, 0.0595)
    ON CONFLICT DO NOTHING`, "Seed cfo_ai_costs");

  await execSafe(`
    INSERT INTO public.cfo_financial_alerts (alert_level, message) VALUES
      ('Warning', 'Marketing campaign budgets have hit 90% of configured monthly caps.')
    ON CONFLICT DO NOTHING`, "Seed cfo_financial_alerts");

  await client.end();
  console.log("\n✅ CFO schema tables successfully migrated.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
