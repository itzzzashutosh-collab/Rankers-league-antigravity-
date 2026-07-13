-- ============================================================
-- Ranker's League: Platform Control Center & DevOps Settings
-- Schema 24: Complete DevOps & Settings Infrastructure
-- ============================================================

-- 1. General system settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    platform_name VARCHAR(150) DEFAULT 'Rankers League',
    platform_description TEXT,
    support_email VARCHAR(200) DEFAULT 'support@rankersleague.com',
    support_phone VARCHAR(40),
    default_language VARCHAR(50) DEFAULT 'English',
    timezone VARCHAR(80) DEFAULT 'Asia/Kolkata',
    currency VARCHAR(10) DEFAULT 'INR',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Feature flags (dynamically toggled)
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Detailed platform limit rules
CREATE TABLE IF NOT EXISTS public.platform_configuration (
    id VARCHAR(80) PRIMARY KEY,
    config_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Role management
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Granular permissions
CREATE TABLE IF NOT EXISTS public.permissions (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT
);

-- 6. Role permissions mapping
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(100) REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 7. Logged-in admin session tracker
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    ip_address VARCHAR(50),
    browser VARCHAR(100),
    os VARCHAR(100),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Security alerts log
CREATE TABLE IF NOT EXISTS public.security_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'Low', -- Low, Medium, High, Critical
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Complete system logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id BIGSERIAL PRIMARY KEY,
    log_level VARCHAR(20) NOT NULL, -- INFO, WARN, ERROR, DEBUG
    category VARCHAR(60) NOT NULL,  -- Auth, Contest, Wallet, System, API
    message TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Background worker monitor
CREATE TABLE IF NOT EXISTS public.background_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_name VARCHAR(150) NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending', -- Running, Completed, Failed
    cron_expression VARCHAR(60),
    last_run TIMESTAMPTZ,
    next_run TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Database backup histories
CREATE TABLE IF NOT EXISTS public.backup_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_name VARCHAR(150) NOT NULL,
    backup_size_bytes BIGINT NOT NULL,
    status VARCHAR(40) DEFAULT 'Completed', -- Completed, Verifying, Failed
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Maintenance Mode status
CREATE TABLE IF NOT EXISTS public.maintenance_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    enabled BOOLEAN DEFAULT FALSE,
    whitelist_ips VARCHAR(50)[] DEFAULT '{}'::VARCHAR[],
    banner_message TEXT,
    estimated_completion TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. API Webhook configurations
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    masked_key VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'read-only',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Configuration audit logs
CREATE TABLE IF NOT EXISTS public.system_config_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    changed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_configuration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full settings" ON public.system_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full flags" ON public.feature_flags FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full platform" ON public.platform_configuration FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full roles" ON public.roles FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full permissions" ON public.permissions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full role_perms" ON public.role_permissions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full sessions" ON public.admin_sessions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full alerts" ON public.security_alerts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full syslogs" ON public.system_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full jobs" ON public.background_jobs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full backups" ON public.backup_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full maintenance" ON public.maintenance_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full apikeys" ON public.api_keys FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full configaudit" ON public.system_config_audit_logs FOR ALL TO authenticated USING (TRUE);

-- Seeds Settings
INSERT INTO public.system_settings (id, platform_name, platform_description) VALUES
    ('default', 'Rankers League Platform Control Center', 'Unified operating center for Ranker''s League brand operations.')
ON CONFLICT (id) DO NOTHING;

-- Seeds Maintenance Mode status
INSERT INTO public.maintenance_settings (id, enabled, banner_message) VALUES
    ('default', FALSE, 'Platform undergoing scheduled database updates.')
ON CONFLICT (id) DO NOTHING;

-- Seeds Permissions
INSERT INTO public.permissions (id, name, description) VALUES
    ('Contest.Create', 'Create contests', 'Allows creating new contest items'),
    ('Contest.Publish', 'Publish contests', 'Allows live publishing of approved contests'),
    ('Question.Approve', 'Approve questions', 'Allows editors to approve questions for examination assembly'),
    ('Wallet.Edit', 'Admin wallet modifications', 'Allows manually adjusting balances'),
    ('System.Restart', 'Perform system restarts', 'Allows resetting database locks and server configurations')
ON CONFLICT (id) DO NOTHING;

-- Seeds Roles
INSERT INTO public.roles (name, description) VALUES
    ('Super Admin', 'Platform owner with complete administrative access.'),
    ('Contest Manager', 'Can build, configure, and publish contest timelines.'),
    ('Moderator', 'Access to support requests and logs monitoring.')
ON CONFLICT (name) DO NOTHING;

-- Seeds Feature flags
INSERT INTO public.feature_flags (id, name, description, enabled) VALUES
    ('AI_GENERATION', 'Intelligent blueprint question generator', 'AI paper composition suggestions', FALSE),
    ('FAST_WITHDRAWALS', 'Instant UPI payout processing', 'Automated trigger for values below threshold limit', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Seeds detailed platform limit rules
INSERT INTO public.platform_configuration (id, config_value, description) VALUES
    ('MIN_WITHDRAWAL', '500', 'Minimum allowed withdrawal request in INR'),
    ('PLATFORM_FEE_DEFAULT', '18', 'Default contest platforms commission fee percentage'),
    ('LEADERBOARD_REFRESH_RATE', '60', 'Sync rates for live rank dashboards in seconds')
ON CONFLICT (id) DO NOTHING;

-- Seeds background worker monitor
INSERT INTO public.background_jobs (job_name, status, cron_expression, next_run) VALUES
    ('Evaluation Sync Task', 'Completed', '*/5 * * * *', NOW() + INTERVAL '5 minutes'),
    ('Wallet Ledger Checkpoint', 'Completed', '0 0 * * *', NOW() + INTERVAL '1 day'),
    ('Expired Session Purge', 'Completed', '0 * * * *', NOW() + INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;
