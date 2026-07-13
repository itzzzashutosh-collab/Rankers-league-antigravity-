-- ============================================================
-- Ranker's League: Enterprise Analytics & BI Platform
-- Schema 23: Complete Analytics & Reporting Infrastructure
-- ============================================================

-- 1. Periodic performance/business metrics snapshots
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_type VARCHAR(60) NOT NULL CHECK (
        snapshot_type IN ('Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly')
    ),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    metrics JSONB DEFAULT '{}'::jsonb, -- gross_rev, net_rev, active_users, conversion_rate, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Raw analytics tracking events
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    category VARCHAR(60) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Custom executive dashboard structures
CREATE TABLE IF NOT EXISTS public.executive_dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    created_by UUID,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Available widget metadata definitions
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    widget_type VARCHAR(60) NOT NULL, -- 'LineChart', 'BarChart', 'Funnel', 'Map', etc.
    data_source VARCHAR(100) NOT NULL,
    default_config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User-specific custom layouts
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
);

-- 6. Generated saved reports (immutable)
CREATE TABLE IF NOT EXISTS public.saved_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    report_type VARCHAR(60) NOT NULL,
    parameters JSONB DEFAULT '{}'::jsonb,
    data_summary JSONB DEFAULT '{}'::jsonb,
    generated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE RULE protect_saved_reports_update AS ON UPDATE TO public.saved_reports DO INSTEAD NOTHING;
CREATE RULE protect_saved_reports_delete AS ON DELETE TO public.saved_reports DO INSTEAD NOTHING;

-- 7. Scheduled report configurations
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
);

-- 8. Analytics dashboard custom filters
CREATE TABLE IF NOT EXISTS public.analytics_filters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filter_name VARCHAR(100) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Export requests ledger
CREATE TABLE IF NOT EXISTS public.analytics_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exporter_id UUID,
    dataset_name VARCHAR(100) NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('CSV', 'Excel', 'PDF', 'JSON')),
    record_count INT DEFAULT 0,
    filters_applied JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    download_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Simple forecasting trend parameter mappings
CREATE TABLE IF NOT EXISTS public.forecast_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL,
    target_metric VARCHAR(100) NOT NULL,
    model_parameters JSONB DEFAULT '{}'::jsonb, -- coefficients, formulas, linear constants
    last_trained TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Security and reporting access logs
CREATE TABLE IF NOT EXISTS public.analytics_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID,
    action VARCHAR(150) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.executive_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forecast_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read snapshots" ON public.analytics_snapshots FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read events" ON public.analytics_events FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins dashboards" ON public.executive_dashboards FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins widgets" ON public.dashboard_widgets FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins layouts" ON public.dashboard_layouts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins saved_reports" ON public.saved_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins scheduled_reports" ON public.scheduled_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins filters" ON public.analytics_filters FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins exports" ON public.analytics_exports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins forecast" ON public.forecast_models FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins audit_logs" ON public.analytics_audit_logs FOR ALL TO authenticated USING (TRUE);

-- Seed Widgets
INSERT INTO public.dashboard_widgets (id, title, widget_type, data_source, default_config) VALUES
    ('wdg001-0000-0000-0000-000000000001', 'Platform Growth Overview', 'LineChart', 'platform_growth', '{"xAxis": "date", "yAxis": "users"}'::jsonb),
    ('wdg002-0000-0000-0000-000000000002', 'Revenue Stream Distribution', 'DonutChart', 'revenue_streams', '{"labels": "category", "values": "amount"}'::jsonb),
    ('wdg003-0000-0000-0000-000000000003', 'Contest Participant Funnel', 'Funnel', 'contest_funnel', '{"steps": ["view", "register", "complete"]}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Dashboards
INSERT INTO public.executive_dashboards (id, title, description, is_pinned) VALUES
    ('db001-0000-0000-0000-000000000001', 'Core Operations Cockpit', 'Executive workspace tracking registration funnels and monthly recurring revenue.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Seed Layouts
INSERT INTO public.dashboard_layouts (dashboard_id, widget_id, position_x, position_y, width, height) VALUES
    ('db001-0000-0000-0000-000000000001', 'wdg001-0000-0000-0000-000000000001', 0, 0, 6, 4),
    ('db001-0000-0000-0000-000000000001', 'wdg002-0000-0000-0000-000000000002', 6, 0, 6, 4)
ON CONFLICT (id) DO NOTHING;

-- Seed snapshots
INSERT INTO public.analytics_snapshots (snapshot_type, period_start, period_end, metrics) VALUES
    ('Monthly', '2026-06-01', '2026-06-30', '{"active_users": 15480, "conversion_rate": 8.5, "gross_revenue": 970644, "new_users": 2840, "platform_fees": 174716}'::jsonb),
    ('Monthly', '2026-05-01', '2026-05-31', '{"active_users": 13120, "conversion_rate": 8.1, "gross_revenue": 830420, "new_users": 2410, "platform_fees": 149475}'::jsonb)
ON CONFLICT (id) DO NOTHING;
