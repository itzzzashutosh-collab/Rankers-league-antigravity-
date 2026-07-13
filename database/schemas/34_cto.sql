-- ============================================================
-- Ranker's League: Digital CTO & Engineering Command Ledger
-- Schema 34: Platform Architecture, DevOps, and Technology Operations
-- ============================================================

-- 1. CTO Architecture Decision records
CREATE TABLE IF NOT EXISTS public.cto_architecture (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    design_title VARCHAR(200) NOT NULL,
    components JSONB DEFAULT '{}'::jsonb,
    rationale TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CTO Engineering Projects
CREATE TABLE IF NOT EXISTS public.cto_engineering_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed')),
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CTO Deployments Center
CREATE TABLE IF NOT EXISTS public.cto_deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    commit_sha VARCHAR(50) NOT NULL,
    environment VARCHAR(30) DEFAULT 'Staging',
    status VARCHAR(40) DEFAULT 'Success' CHECK (status IN ('Success', 'Failed', 'InProgress')),
    release_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CTO Incidents Tracker
CREATE TABLE IF NOT EXISTS public.cto_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    severity VARCHAR(30) DEFAULT 'Medium',
    status VARCHAR(40) DEFAULT 'Investigating' CHECK (status IN ('Investigating', 'Mitigated', 'Resolved')),
    recovery_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CTO Bug Tracker
CREATE TABLE IF NOT EXISTS public.cto_bug_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bug_title VARCHAR(250) NOT NULL,
    severity VARCHAR(30) DEFAULT 'Medium' CHECK (severity IN ('Minor', 'Medium', 'Critical')),
    status VARCHAR(40) DEFAULT 'Open' CHECK (status IN ('Open', 'Closed', 'InProgress')),
    assigned_to VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CTO Performance Telemetry
CREATE TABLE IF NOT EXISTS public.cto_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(100) NOT NULL, -- 'db_query_time', 'caching_hit_ratio'
    value NUMERIC(10, 4) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CTO Code Quality status
CREATE TABLE IF NOT EXISTS public.cto_code_quality (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    build_id VARCHAR(100) NOT NULL,
    coverage_percentage NUMERIC(5, 2),
    type_safety_errors INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CTO System Connection Health statuses
CREATE TABLE IF NOT EXISTS public.cto_system_health (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    health VARCHAR(30) DEFAULT 'Healthy',
    latency_ms INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CTO Engineering Reports
CREATE TABLE IF NOT EXISTS public.cto_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL, -- 'PerformanceAudit', 'SecurityBrief'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CTO Strategic Decisions
CREATE TABLE IF NOT EXISTS public.cto_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CTO Technology Roadmap
CREATE TABLE IF NOT EXISTS public.cto_roadmap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feature VARCHAR(200) NOT NULL,
    target_quarter VARCHAR(30) NOT NULL, -- '2026-Q3'
    status VARCHAR(40) DEFAULT 'Planned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CTO Global Latency metrics
CREATE TABLE IF NOT EXISTS public.cto_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    average_api_latency_ms INT DEFAULT 0,
    caching_hit_percentage INT DEFAULT 95,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.cto_architecture ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_engineering_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_bug_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_code_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_roadmap ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cto_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins architecture" ON public.cto_architecture FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins projects" ON public.cto_engineering_projects FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins deployments" ON public.cto_deployments FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins incidents" ON public.cto_incidents FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins bugs" ON public.cto_bug_tracker FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins performance" ON public.cto_performance FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins quality" ON public.cto_code_quality FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins system_health" ON public.cto_system_health FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins reports" ON public.cto_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins decisions" ON public.cto_decisions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins roadmap" ON public.cto_roadmap FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins metrics" ON public.cto_metrics FOR ALL TO authenticated USING (TRUE);

-- Seeds
INSERT INTO public.cto_system_health (id, name, health, latency_ms) VALUES
    ('supabase_db', 'Supabase Database Connection', 'Healthy', 12),
    ('redis_cache', 'Redis Transaction Caching', 'Healthy', 2),
    ('api_gateway', 'API Routing Gateway', 'Healthy', 8)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.cto_deployments (commit_sha, environment, status, release_notes) VALUES
    ('c89ad12', 'Production', 'Success', 'Deployed secure AI credentials storage vaults.')
ON CONFLICT DO NOTHING;

INSERT INTO public.cto_bug_tracker (bug_title, severity, status, assigned_to) VALUES
    ('Evaluation sync job triggers timeout', 'Critical', 'Open', 'AGENT_EXECUTOR'),
    ('Masked key display misalignment on mobile view', 'Minor', 'Open', 'AGENT_REVIEWER')
ON CONFLICT DO NOTHING;
