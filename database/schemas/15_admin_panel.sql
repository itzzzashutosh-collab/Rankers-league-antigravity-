-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create admin_roles Table
CREATE TABLE IF NOT EXISTS public.admin_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create admin_permissions Table
CREATE TABLE IF NOT EXISTS public.admin_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES public.admin_roles(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role_id, action)
);

-- 3. Create admin_users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY, -- Links directly to auth.users(id)
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    role_id UUID REFERENCES public.admin_roles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create admin_sessions Table
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    last_active_time TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Create admin_activity_logs Table (Audit Trail)
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create admin_preferences Table
CREATE TABLE IF NOT EXISTS public.admin_preferences (
    admin_id UUID PRIMARY KEY REFERENCES public.admin_users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sidebar_collapsed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create platform_health Table
CREATE TABLE IF NOT EXISTS public.platform_health (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Healthy' CHECK (status IN ('Healthy', 'Warning', 'Offline', 'Maintenance')),
    latency_ms INT DEFAULT 0,
    last_checked TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Create system_status Table
CREATE TABLE IF NOT EXISTS public.system_status (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Create audit_logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID,
    actor_type VARCHAR(50) NOT NULL CHECK (actor_type IN ('admin', 'user', 'system')),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Create workspace_settings Table
CREATE TABLE IF NOT EXISTS public.workspace_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS Policies on Admin Tables
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_settings ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies allowing full operations for admin/super-admin users
-- Since admins must be authenticated in Supabase, we can check their entry in public.admin_users
CREATE POLICY "Admins have full access to admin_roles" ON public.admin_roles
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to admin_permissions" ON public.admin_permissions
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to admin_users" ON public.admin_users
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to admin_sessions" ON public.admin_sessions
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to admin_activity_logs" ON public.admin_activity_logs
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to admin_preferences" ON public.admin_preferences
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() OR admin_id = auth.uid()));

CREATE POLICY "Admins have full access to platform_health" ON public.platform_health
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to system_status" ON public.system_status
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to audit_logs" ON public.audit_logs
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));

CREATE POLICY "Admins have full access to workspace_settings" ON public.workspace_settings
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid()));


-- 11. Seed Initial Data
INSERT INTO public.admin_roles (id, name, description) VALUES
    ('4fa2144d-bbbb-4d40-bbbb-4fa2144dbbbb', 'Super Admin', 'Full control and access to all modules and configurations'),
    ('3fa2144d-bbbb-4d40-bbbb-3fa2144dbbbb', 'Administrator', 'General administration access except security settings'),
    ('2fa2144d-bbbb-4d40-bbbb-2fa2144dbbbb', 'Contest Manager', 'Can edit contests, publish results, and view dashboards'),
    ('1fa2144d-bbbb-4d40-bbbb-1fa2144dbbbb', 'Question Manager', 'Manages question banks, imports, and formats'),
    ('0fa2144d-bbbb-4d40-bbbb-0fa2144dbbbb', 'Finance Manager', 'Approves withdrawals, distributions, and audits logs'),
    ('9fa2144d-bbbb-4d40-bbbb-9fa2144dbbbb', 'Support Manager', 'Views logs and resolves customer tickets')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.admin_permissions (role_id, action) VALUES
    ('4fa2144d-bbbb-4d40-bbbb-4fa2144dbbbb', '*'),
    ('3fa2144d-bbbb-4d40-bbbb-3fa2144dbbbb', 'read:all'),
    ('3fa2144d-bbbb-4d40-bbbb-3fa2144dbbbb', 'write:contests'),
    ('3fa2144d-bbbb-4d40-bbbb-3fa2144dbbbb', 'write:questions'),
    ('3fa2144d-bbbb-4d40-bbbb-3fa2144dbbbb', 'publish:results'),
    ('2fa2144d-bbbb-4d40-bbbb-2fa2144dbbbb', 'read:contests'),
    ('2fa2144d-bbbb-4d40-bbbb-2fa2144dbbbb', 'write:contests'),
    ('2fa2144d-bbbb-4d40-bbbb-2fa2144dbbbb', 'publish:results'),
    ('1fa2144d-bbbb-4d40-bbbb-1fa2144dbbbb', 'read:questions'),
    ('1fa2144d-bbbb-4d40-bbbb-1fa2144dbbbb', 'write:questions'),
    ('0fa2144d-bbbb-4d40-bbbb-0fa2144dbbbb', 'read:finance'),
    ('0fa2144d-bbbb-4d40-bbbb-0fa2144dbbbb', 'approve:withdrawals'),
    ('0fa2144d-bbbb-4d40-bbbb-0fa2144dbbbb', 'audit:wallets')
ON CONFLICT DO NOTHING;

INSERT INTO public.platform_health (service_name, status, latency_ms) VALUES
    ('Authentication', 'Healthy', 45),
    ('Database', 'Healthy', 12),
    ('Realtime', 'Healthy', 28),
    ('Storage', 'Healthy', 65),
    ('Notifications', 'Healthy', 34),
    ('Queue', 'Healthy', 5),
    ('Email', 'Healthy', 120),
    ('Background Workers', 'Healthy', 15)
ON CONFLICT (service_name) DO UPDATE SET status = EXCLUDED.status, latency_ms = EXCLUDED.latency_ms;
