-- ============================================================
-- Ranker's League: Digital CEO & Executive Orchestration Ledger
-- Schema 32: Strategic Strategy, Approvals, and Company Health
-- ============================================================

-- 1. CEO Memory Strategy Logs
CREATE TABLE IF NOT EXISTS public.ceo_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CEO Reports
CREATE TABLE IF NOT EXISTS public.ceo_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL, -- 'MorningBrief', 'EveningReport', 'WeeklyBrief'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CEO Decisions Logger
CREATE TABLE IF NOT EXISTS public.ceo_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_type VARCHAR(100) NOT NULL, -- 'Delegation', 'BudgetReallocation'
    impact_level VARCHAR(30) DEFAULT 'Medium',
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CEO Company Priorities
CREATE TABLE IF NOT EXISTS public.ceo_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    priority_order INT DEFAULT 1,
    status VARCHAR(40) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CEO Company Health Index
CREATE TABLE IF NOT EXISTS public.ceo_company_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    health_score NUMERIC(5, 2) NOT NULL,
    metric_type VARCHAR(80) NOT NULL, -- 'Marketing', 'Infrastructure', 'Finance'
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CEO Strategic Milestones
CREATE TABLE IF NOT EXISTS public.ceo_strategy (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone VARCHAR(200) NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CEO Department Status
CREATE TABLE IF NOT EXISTS public.ceo_department_status (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    health VARCHAR(30) DEFAULT 'Healthy',
    tasks_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CEO Founder Preferences
CREATE TABLE IF NOT EXISTS public.ceo_founder_preferences (
    id VARCHAR(80) PRIMARY KEY,
    pref_value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CEO Approval Queue
CREATE TABLE IF NOT EXISTS public.ceo_approval_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(200) NOT NULL,
    requested_by VARCHAR(80) NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    decided_at TIMESTAMPTZ
);

-- 10. CEO Daily Reports Archive
CREATE TABLE IF NOT EXISTS public.ceo_daily_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_date DATE UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CEO Weekly Reports Archive
CREATE TABLE IF NOT EXISTS public.ceo_weekly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_start DATE UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CEO Monthly Reports Archive
CREATE TABLE IF NOT EXISTS public.ceo_monthly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month_start DATE UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CEO AI Costs Ledger
CREATE TABLE IF NOT EXISTS public.ceo_ai_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cost_date DATE UNIQUE NOT NULL,
    total_cost NUMERIC(10, 6) DEFAULT 0.000000,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. CEO Growth Metrics
CREATE TABLE IF NOT EXISTS public.ceo_growth_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_date DATE UNIQUE NOT NULL,
    new_users INT DEFAULT 0,
    revenue_inr NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ceo_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_priorities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_company_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_strategy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_department_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_founder_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_ai_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceo_growth_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins memory" ON public.ceo_memory FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins reports" ON public.ceo_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins decisions" ON public.ceo_decisions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins priorities" ON public.ceo_priorities FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins health" ON public.ceo_company_health FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins strategy" ON public.ceo_strategy FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins status" ON public.ceo_department_status FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins preferences" ON public.ceo_founder_preferences FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins approvals" ON public.ceo_approval_queue FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins daily" ON public.ceo_daily_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins weekly" ON public.ceo_weekly_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins monthly" ON public.ceo_monthly_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins ai_costs" ON public.ceo_ai_costs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins growth" ON public.ceo_growth_metrics FOR ALL TO authenticated USING (TRUE);

-- Seed defaults
INSERT INTO public.ceo_department_status (id, name, health, tasks_count) VALUES
    ('DEP_MKT', 'Marketing Division', 'Healthy', 3),
    ('DEP_EDU', 'Education Division', 'Healthy', 8),
    ('DEP_FIN', 'Financial Operations', 'Healthy', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ceo_priorities (title, priority_order) VALUES
    ('Optimize NEET Biology Promos', 1),
    ('Resolve candidate evaluation script latencies', 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.ceo_approval_queue (action, requested_by, status, payload) VALUES
    ('Run database migration scripts 32_ceo.sql', 'CTO Agent', 'Pending', '{"schema": "32_ceo"}'::jsonb),
    ('Deploy new prize rules matrix for UPSC Elite Grandmaster Contest', 'CFO Agent', 'Pending', '{"bonus_rate": 0.05}'::jsonb)
ON CONFLICT DO NOTHING;
