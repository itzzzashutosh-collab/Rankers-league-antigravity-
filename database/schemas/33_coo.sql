-- ============================================================
-- Ranker's League: Digital COO & Operations Command Ledger
-- Schema 33: Operations Center, SLAs, Incidents, and Balancers
-- ============================================================

-- 1. COO Projects Table
CREATE TABLE IF NOT EXISTS public.coo_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed', 'OnHold')),
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COO Tasks Table
CREATE TABLE IF NOT EXISTS public.coo_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.coo_projects(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'InProgress', 'Completed', 'Blocked')),
    owner VARCHAR(100) NOT NULL,
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COO Task Dependencies
CREATE TABLE IF NOT EXISTS public.coo_task_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.coo_tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID REFERENCES public.coo_tasks(id) ON DELETE CASCADE
);

-- 4. COO Department Status workloads
CREATE TABLE IF NOT EXISTS public.coo_department_status (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    health VARCHAR(30) DEFAULT 'Healthy',
    tasks_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COO Operations Checklists
CREATE TABLE IF NOT EXISTS public.coo_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_item VARCHAR(200) NOT NULL,
    passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COO SLA Settings
CREATE TABLE IF NOT EXISTS public.coo_sla (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(100) NOT NULL, -- 'ContestResults', 'SupportOutreach'
    threshold_minutes INT NOT NULL,
    status VARCHAR(40) DEFAULT 'Sufficient',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COO Workloads stats
CREATE TABLE IF NOT EXISTS public.coo_workloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(80) NOT NULL,
    status VARCHAR(40) DEFAULT 'Idle' CHECK (status IN ('Idle', 'Busy', 'Overloaded', 'Sleeping', 'Failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COO Capacity checks
CREATE TABLE IF NOT EXISTS public.coo_capacity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id VARCHAR(80) NOT NULL,
    capacity_percentage INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COO Reports
CREATE TABLE IF NOT EXISTS public.coo_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL, -- 'DailyLogs', 'SlaBreachReport'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. COO Daily Log Traces
CREATE TABLE IF NOT EXISTS public.coo_daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_date DATE UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. COO Incidents Logger
CREATE TABLE IF NOT EXISTS public.coo_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_type VARCHAR(50) NOT NULL CHECK (incident_type IN ('Minor', 'Major', 'Critical', 'Security', 'Infrastructure', 'Contest')),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(40) DEFAULT 'Investigating' CHECK (status IN ('Investigating', 'Mitigated', 'Resolved')),
    owner VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. COO Risk Register
CREATE TABLE IF NOT EXISTS public.coo_risk_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_description TEXT NOT NULL,
    severity VARCHAR(30) DEFAULT 'Medium',
    mitigation_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. COO Operational Metrics
CREATE TABLE IF NOT EXISTS public.coo_operational_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC(12, 4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.coo_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_department_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_sla ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_workloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_risk_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coo_operational_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins projects" ON public.coo_projects FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins tasks" ON public.coo_tasks FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins dependencies" ON public.coo_task_dependencies FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins status" ON public.coo_department_status FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins operations" ON public.coo_operations FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins sla" ON public.coo_sla FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins workloads" ON public.coo_workloads FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins capacity" ON public.coo_capacity FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins reports" ON public.coo_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins logs" ON public.coo_daily_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins incidents" ON public.coo_incidents FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins risks" ON public.coo_risk_register FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins metrics" ON public.coo_operational_metrics FOR ALL TO authenticated USING (TRUE);

-- Seeds
INSERT INTO public.coo_projects (id, title, status, deadline) VALUES
    ('p-1', 'JEE Physics Grandmaster Launch Prep', 'Active', CURRENT_DATE + 3),
    ('p-2', 'NEET Biology Sprint Promotion Dispatch', 'Active', CURRENT_DATE + 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.coo_tasks (project_id, title, status, owner, deadline) VALUES
    ('p-1', 'Validate question papers schema', 'InProgress', 'AGENT_REVIEWER', CURRENT_DATE + 1),
    ('p-1', 'Final validation & trust audit signoff', 'Pending', 'AGENT_VERIFIER', CURRENT_DATE + 2)
ON CONFLICT DO NOTHING;

INSERT INTO public.coo_sla (service_name, threshold_minutes, status) VALUES
    ('ContestResultsPublishing', 15, 'Sufficient'),
    ('OutreachNotificationsQueue', 5, 'Sufficient')
ON CONFLICT DO NOTHING;

INSERT INTO public.coo_incidents (incident_type, title, status, owner) VALUES
    ('Infrastructure', 'High database query latency on paper building templates', 'Investigating', 'AGENT_COO')
ON CONFLICT DO NOTHING;
