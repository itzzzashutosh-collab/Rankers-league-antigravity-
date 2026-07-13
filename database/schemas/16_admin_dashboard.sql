-- Admin Dashboard Schema & Seeds

-- 1. Create workspace_widgets catalog
CREATE TABLE IF NOT EXISTS public.workspace_widgets (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    default_col_span INT DEFAULT 6 CHECK (default_col_span IN (3, 4, 6, 8, 12)),
    description TEXT
);

-- 2. Create workspace_layouts preferences per admin
CREATE TABLE IF NOT EXISTS public.workspace_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL, -- Links to public.admin_users(id)
    widget_id VARCHAR(100) REFERENCES public.workspace_widgets(id) ON DELETE CASCADE,
    col_span INT DEFAULT 6 CHECK (col_span IN (3, 4, 6, 8, 12)),
    row_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(admin_id, widget_id)
);

-- 3. Create platform_events Table (timeline logging)
CREATE TABLE IF NOT EXISTS public.platform_events (
    id BIGSERIAL PRIMARY KEY,
    time_label VARCHAR(100) NOT NULL,
    action VARCHAR(150) NOT NULL,
    entity VARCHAR(255) NOT NULL,
    actor VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('success', 'warning', 'info')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create system_alerts Table
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'danger')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create platform_statistics Table
CREATE TABLE IF NOT EXISTS public.platform_statistics (
    key VARCHAR(100) PRIMARY KEY,
    value INT DEFAULT 0,
    label VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- 6. Create contest_monitoring Table
CREATE TABLE IF NOT EXISTS public.contest_monitoring (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Live', 'Upcoming', 'Completed', 'Evaluation')),
    participants INT DEFAULT 0,
    current_phase VARCHAR(100),
    remaining_time VARCHAR(100),
    avg_completion INT DEFAULT 0 CHECK (avg_completion BETWEEN 0 AND 100),
    warnings_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create admin_dashboard_preferences Table
CREATE TABLE IF NOT EXISTS public.admin_dashboard_preferences (
    admin_id UUID PRIMARY KEY, -- Links to public.admin_users(id)
    refresh_interval_seconds INT DEFAULT 30,
    sound_effects_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create admin_notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL, -- Links to public.admin_users(id)
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.workspace_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_dashboard_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Setup full access policies for authenticated admins
CREATE POLICY "Admins full access on widgets" ON public.workspace_widgets FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on layouts" ON public.workspace_layouts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on timeline" ON public.platform_events FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on system alerts" ON public.system_alerts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on stats" ON public.platform_statistics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on monitoring" ON public.contest_monitoring FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on preferences" ON public.admin_dashboard_preferences FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on notifications" ON public.admin_notifications FOR ALL TO authenticated USING (TRUE);

-- 9. Seed Catalog Widgets
INSERT INTO public.workspace_widgets (id, name, default_col_span, description) VALUES
    ('status_ribbon', 'Platform Status Ribbon', 12, 'Displays status and latencies of all backend services'),
    ('snapshot_ribbon', 'Live Snapshots', 12, 'Summarizes online users and running contests counts'),
    ('action_center', 'Priority Action Center', 4, 'Lists critical tasks requiring admin validation'),
    ('contest_monitor', 'Live Contest Monitor', 8, 'Telemetries current active and evaluating arenas'),
    ('registration_feed', 'Live Registration Feed', 4, 'Chronological feed of newly enrolled applicants'),
    ('platform_timeline', 'Platform Event Timeline', 4, 'Event stream of platform mutations in real-time'),
    ('admin_activity', 'Recent Admin Activity', 4, 'Audit logs of administrators layout or records edits')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, default_col_span = EXCLUDED.default_col_span;

-- 10. Seed Platform Statistics
INSERT INTO public.platform_statistics (key, value, label, category) VALUES
    ('active_users', 42800, 'Total Active Candidates', 'engagement'),
    ('users_online', 1580, 'Users Online', 'telemetry'),
    ('admins_online', 3, 'Admins Online', 'telemetry'),
    ('live_contests', 2, 'Live Contests', 'operations'),
    ('upcoming_contests', 6, 'Upcoming Contests', 'operations'),
    ('running_evaluations', 1, 'Running Evaluations', 'operations'),
    ('pending_payouts', 14, 'Pending Withdrawals', 'finance'),
    ('open_tickets', 9, 'Open Support Requests', 'support')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 11. Seed Contest Monitoring
INSERT INTO public.contest_monitoring (id, name, status, participants, current_phase, remaining_time, avg_completion, warnings_count) VALUES
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'UPSC Prelims Elite Arena (GS-01)', 'Live', 18450, 'Section 3: Economics', '01:42:15', 68, 0),
    ('6fa2144d-bbbb-4d40-bbbb-6fa2144dbbbb', 'JEE Advanced Physics Grandmaster Challenge', 'Live', 12400, 'Section 2: Magnetism', '00:38:40', 82, 1),
    ('7fa2144d-bbbb-4d40-bbbb-7fa2144dbbbb', 'NEET Biology Speed Sprint (Reproduction)', 'Evaluation', 7642, 'AI Grading Keys validation', '00:00:00', 100, 0)
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, participants = EXCLUDED.participants, avg_completion = EXCLUDED.avg_completion;

-- 12. Seed Platform Timeline
INSERT INTO public.platform_events (time_label, action, entity, actor, type) VALUES
    ('Just now', 'Contest Registration', 'UPSC Elite Arena (GS-01)', 'ashutosh_dropout', 'success'),
    ('3m ago', 'Withdrawal Request', '₹4,500 Bank Payout Request', 'subham_pandey', 'info'),
    ('12m ago', 'Question Imported', 'NEET Biology Module 14', 'academic_advisor_s', 'success'),
    ('28m ago', 'Platform Login', 'New IP Session Authorized', 'admin_moderator_02', 'info'),
    ('44m ago', 'Database Auto-Backup', 'Daily Schema Checksum Validated', 'System cron', 'success'),
    ('1h ago', 'Failed Withdrawal Retry', 'UPI Routing Timeout Error', 'ashutosh_dropout', 'warning')
ON CONFLICT DO NOTHING;

-- 13. Seed System Announcements
INSERT INTO public.system_alerts (title, message, type, is_active) VALUES
    ('Scheduled Infrastructure Optimization', 'All database clusters will undergo brief diagnostic scaling on July 12 between 03:00 - 03:30 AM IST.', 'warning', true),
    ('Supabase Auth Patch v4.2', 'Security updates have been successfully deployed. Admin sessions validation will enforce strict JWT validation.', 'info', true)
ON CONFLICT DO NOTHING;
