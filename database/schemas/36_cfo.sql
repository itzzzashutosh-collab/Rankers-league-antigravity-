-- ============================================================
-- Ranker's League: Digital CFO & Financial Command Ledger
-- Schema 36: Revenue, Profitability, AI Costs, and Budgets
-- ============================================================

-- 1. CFO Revenue Table
CREATE TABLE IF NOT EXISTS public.cfo_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount_inr NUMERIC(15, 2) NOT NULL,
    source VARCHAR(100) DEFAULT 'ContestRegistration', -- 'Subscription', 'Contest'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CFO Expenses Table
CREATE TABLE IF NOT EXISTS public.cfo_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount_usd NUMERIC(12, 4) NOT NULL,
    expense_type VARCHAR(100) NOT NULL, -- 'AI_API_Token', 'Database_Storage'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CFO Profitability
CREATE TABLE IF NOT EXISTS public.cfo_profitability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gross_margin NUMERIC(5, 2) DEFAULT 0.00,
    net_margin NUMERIC(5, 2) DEFAULT 0.00,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CFO Budgets limits
CREATE TABLE IF NOT EXISTS public.cfo_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id VARCHAR(80) NOT NULL UNIQUE,
    monthly_limit_usd NUMERIC(12, 2) DEFAULT 100.00,
    spent_usd NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CFO Forecasts
CREATE TABLE IF NOT EXISTS public.cfo_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forecast_quarter VARCHAR(30) NOT NULL,
    expected_revenue_inr NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CFO Cashflow
CREATE TABLE IF NOT EXISTS public.cfo_cashflow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inflow_inr NUMERIC(15, 2) DEFAULT 0.00,
    outflow_inr NUMERIC(15, 2) DEFAULT 0.00,
    recorded_date DATE UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CFO AI Costs per provider/model
CREATE TABLE IF NOT EXISTS public.cfo_ai_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(80) NOT NULL, -- 'OpenAI', 'Anthropic', 'Google'
    model_name VARCHAR(100) NOT NULL,
    tokens_count INT DEFAULT 0,
    cost_usd NUMERIC(12, 6) DEFAULT 0.000000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CFO Cloud Costs
CREATE TABLE IF NOT EXISTS public.cfo_cloud_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_name VARCHAR(100) NOT NULL, -- 'Database', 'Storage'
    cost_usd NUMERIC(12, 4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CFO Financial Reports
CREATE TABLE IF NOT EXISTS public.cfo_financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL, -- 'ProfitSummary', 'MonthlyTaxAudit'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CFO Financial Alerts
CREATE TABLE IF NOT EXISTS public.cfo_financial_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_level VARCHAR(30) DEFAULT 'Warning', -- 'Critical', 'Warning'
    message TEXT NOT NULL,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CFO Financial Decisions logs
CREATE TABLE IF NOT EXISTS public.cfo_financial_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_summary TEXT NOT NULL,
    approved_by_founder BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CFO Unit Economics parameters
CREATE TABLE IF NOT EXISTS public.cfo_unit_economics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clv_usd NUMERIC(10, 2) DEFAULT 0.00,
    cac_usd NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CFO Department Costs
CREATE TABLE IF NOT EXISTS public.cfo_department_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id VARCHAR(80) NOT NULL,
    cost_usd NUMERIC(12, 4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CFO Agent Costs
CREATE TABLE IF NOT EXISTS public.cfo_agent_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(80) NOT NULL,
    cost_usd NUMERIC(12, 6) DEFAULT 0.000000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. CFO General Metrics
CREATE TABLE IF NOT EXISTS public.cfo_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cash_position_inr NUMERIC(15, 2) DEFAULT 100000.00,
    burn_rate_usd NUMERIC(10, 2) DEFAULT 20.00,
    runway_months INT DEFAULT 24,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.cfo_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_profitability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_cashflow ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_ai_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_cloud_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_financial_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_financial_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_unit_economics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_department_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_agent_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cfo_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins revenue" ON public.cfo_revenue FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins expenses" ON public.cfo_expenses FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins profit" ON public.cfo_profitability FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins budgets" ON public.cfo_budgets FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins forecasts" ON public.cfo_forecasts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins cashflow" ON public.cfo_cashflow FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins ai_costs" ON public.cfo_ai_costs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins cloud_costs" ON public.cfo_cloud_costs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins reports" ON public.cfo_financial_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins alerts" ON public.cfo_financial_alerts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins decisions" ON public.cfo_financial_decisions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins economics" ON public.cfo_unit_economics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins dept_costs" ON public.cfo_department_costs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins agent_costs" ON public.cfo_agent_costs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins metrics" ON public.cfo_metrics FOR ALL TO authenticated USING (TRUE);

-- Seeds
INSERT INTO public.cfo_metrics (cash_position_inr, burn_rate_usd, runway_months) VALUES
    (450000.00, 14.50, 18)
ON CONFLICT DO NOTHING;

INSERT INTO public.cfo_budgets (department_id, monthly_limit_usd, spent_usd) VALUES
    ('DEP_MKT', 500.00, 450.00),
    ('DEP_ENG', 200.00, 20.00)
ON CONFLICT (department_id) DO NOTHING;

INSERT INTO public.cfo_ai_costs (provider, model_name, tokens_count, cost_usd) VALUES
    ('Anthropic', 'claude-3-5-sonnet', 45000, 0.1350),
    ('Google', 'gemini-1.5-pro', 85000, 0.0595)
ON CONFLICT DO NOTHING;

INSERT INTO public.cfo_financial_alerts (alert_level, message) VALUES
    ('Warning', 'Marketing campaign budgets have hit 90% of configured monthly caps.')
ON CONFLICT DO NOTHING;
