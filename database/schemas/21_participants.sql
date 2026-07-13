-- Enterprise Participant Management & Identity Operations Platform

-- 1. Core participant profiles
CREATE TABLE IF NOT EXISTS public.participant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(80) UNIQUE NOT NULL,
    display_name VARCHAR(150),
    email VARCHAR(200),
    mobile VARCHAR(20),
    avatar_url TEXT,
    country VARCHAR(80) DEFAULT 'India',
    state VARCHAR(80),
    city VARCHAR(80),
    preferred_language VARCHAR(40) DEFAULT 'English',
    competition_category VARCHAR(80) DEFAULT 'General', -- 'General', 'JEE', 'NEET', 'UPSC', etc.
    current_tier VARCHAR(40) DEFAULT 'Bronze',          -- Bronze / Silver / Gold / Platinum / Legend
    aura_points INT DEFAULT 0,
    wallet_balance NUMERIC DEFAULT 0,
    prize_balance NUMERIC DEFAULT 0,
    subscription_plan VARCHAR(60) DEFAULT 'Free',
    account_status VARCHAR(40) DEFAULT 'Active' CHECK (
        account_status IN ('Active','Inactive','Suspended','Restricted','Pending Verification','Deleted')
    ),
    email_verified BOOLEAN DEFAULT FALSE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Participant status override log (who changed what)
CREATE TABLE IF NOT EXISTS public.participant_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    old_status VARCHAR(40),
    new_status VARCHAR(40),
    reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activity / contest history
CREATE TABLE IF NOT EXISTS public.participant_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(80) NOT NULL,  -- 'Registered', 'Contest Joined', 'Contest Completed', 'Prize Won', etc.
    contest_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Security settings per participant
CREATE TABLE IF NOT EXISTS public.participant_security (
    participant_id UUID PRIMARY KEY REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    last_password_change TIMESTAMPTZ,
    failed_login_count INT DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE
);

-- 5. Active sessions
CREATE TABLE IF NOT EXISTS public.participant_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    device_name VARCHAR(150),
    ip_address VARCHAR(50),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trusted devices
CREATE TABLE IF NOT EXISTS public.participant_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    device_fingerprint VARCHAR(200) UNIQUE,
    device_name VARCHAR(150),
    os VARCHAR(80),
    browser VARCHAR(80),
    trusted BOOLEAN DEFAULT TRUE,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Login history log
CREATE TABLE IF NOT EXISTS public.participant_login_history (
    id BIGSERIAL PRIMARY KEY,
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    ip_address VARCHAR(50),
    device_name VARCHAR(150),
    status VARCHAR(20) DEFAULT 'Success' CHECK (status IN ('Success', 'Failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Support tickets
CREATE TABLE IF NOT EXISTS public.participant_support (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    subject VARCHAR(200) NOT NULL,
    status VARCHAR(40) DEFAULT 'Open' CHECK (status IN ('Open', 'Pending', 'Resolved', 'Escalated')),
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Critical')),
    messages JSONB DEFAULT '[]'::jsonb, -- immutable append-only thread
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Admin-applied tags
CREATE TABLE IF NOT EXISTS public.participant_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    tag VARCHAR(80) NOT NULL,
    added_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Internal admin notes
CREATE TABLE IF NOT EXISTS public.participant_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    added_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Verification records
CREATE TABLE IF NOT EXISTS public.participant_verification (
    participant_id UUID PRIMARY KEY REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    mobile_verified BOOLEAN DEFAULT FALSE,
    mobile_verified_at TIMESTAMPTZ,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    gov_id_status VARCHAR(40) DEFAULT 'Not Submitted' CHECK (
        gov_id_status IN ('Not Submitted', 'Pending', 'Approved', 'Rejected')
    ),
    verification_notes TEXT
);

-- 12. Admin audit logs for participant actions
CREATE TABLE IF NOT EXISTS public.participant_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    participant_id UUID REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Participant preferences
CREATE TABLE IF NOT EXISTS public.participant_preferences (
    participant_id UUID PRIMARY KEY REFERENCES public.participant_profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    language VARCHAR(40) DEFAULT 'English',
    timezone VARCHAR(80) DEFAULT 'Asia/Kolkata'
);

-- RLS
ALTER TABLE public.participant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on profiles" ON public.participant_profiles FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on status" ON public.participant_status FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on activity" ON public.participant_activity FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on security" ON public.participant_security FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on sessions" ON public.participant_sessions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on devices" ON public.participant_devices FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on login_history" ON public.participant_login_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on support" ON public.participant_support FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on tags" ON public.participant_tags FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on notes" ON public.participant_notes FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on verification" ON public.participant_verification FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on audit" ON public.participant_audit_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on preferences" ON public.participant_preferences FOR ALL TO authenticated USING (TRUE);

-- Seed demo participants
INSERT INTO public.participant_profiles (id, username, display_name, email, mobile, country, state, city, competition_category, current_tier, aura_points, wallet_balance, prize_balance, subscription_plan, account_status, email_verified, mobile_verified) VALUES
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'amit_sharma_98', 'Amit Sharma', 'am**@gmail.com', '+91-98765-****', 'India', 'Delhi', 'New Delhi', 'JEE', 'Gold', 4850, 12400, 50000, 'Pro', 'Active', TRUE, TRUE),
    ('22fa2144-aaaa-4d40-bbbb-22fa2144bbbb', 'priya_k_reddy', 'Priya K. Reddy', 'pr**@gmail.com', '+91-87654-****', 'India', 'Telangana', 'Hyderabad', 'NEET', 'Silver', 3200, 8200, 30000, 'Basic', 'Active', TRUE, TRUE),
    ('33fa2144-aaaa-4d40-bbbb-33fa2144bbbb', 'rohan_verma_delhi', 'Rohan Verma', 'ro**@gmail.com', '+91-76543-****', 'India', 'Delhi', 'Gurugram', 'UPSC', 'Bronze', 1540, 2100, 15000, 'Free', 'Suspended', TRUE, FALSE)
ON CONFLICT (username) DO UPDATE SET updated_at = NOW();

-- Seed verification records
INSERT INTO public.participant_verification (participant_id, mobile_verified, email_verified, gov_id_status) VALUES
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', TRUE, TRUE, 'Not Submitted'),
    ('22fa2144-aaaa-4d40-bbbb-22fa2144bbbb', TRUE, TRUE, 'Pending'),
    ('33fa2144-aaaa-4d40-bbbb-33fa2144bbbb', FALSE, TRUE, 'Not Submitted')
ON CONFLICT (participant_id) DO NOTHING;

-- Seed support tickets
INSERT INTO public.participant_support (participant_id, subject, status, priority, messages) VALUES
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'Prize amount not credited after JEE contest', 'Open', 'High', '[{"from":"participant","text":"Prize not credited after 3 days.","at":"2026-07-08T10:00:00Z"},{"from":"admin","text":"Escalated to finance team.","at":"2026-07-08T14:00:00Z"}]'),
    ('33fa2144-aaaa-4d40-bbbb-33fa2144bbbb', 'Account suspended without notice', 'Escalated', 'Critical', '[{"from":"participant","text":"My account is suspended. Why?","at":"2026-07-09T08:00:00Z"}]')
ON CONFLICT (id) DO NOTHING;

-- Seed activity timeline
INSERT INTO public.participant_activity (participant_id, event_type, details) VALUES
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'Registered', '{"source":"mobile_app"}'),
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'Contest Joined', '{"contest":"JEE Advanced Physics Grandmaster Challenge","entry_fee":499}'),
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'Prize Won', '{"contest":"JEE Advanced Physics Grandmaster Challenge","amount":50000,"rank":1}'),
    ('22fa2144-aaaa-4d40-bbbb-22fa2144bbbb', 'Registered', '{"source":"web"}'),
    ('22fa2144-aaaa-4d40-bbbb-22fa2144bbbb', 'Contest Joined', '{"contest":"NEET Biology Sprint","entry_fee":299}')
ON CONFLICT (id) DO NOTHING;

-- Seed sessions
INSERT INTO public.participant_sessions (participant_id, device_name, ip_address, is_current) VALUES
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'iPhone 15 Pro (Safari)', '103.25.xxx.xxx', TRUE),
    ('11fa2144-aaaa-4d40-bbbb-11fa2144bbbb', 'MacBook Pro (Chrome)', '103.25.xxx.xxx', FALSE),
    ('33fa2144-aaaa-4d40-bbbb-33fa2144bbbb', 'Android (Chrome)', '45.67.xxx.xxx', TRUE)
ON CONFLICT (id) DO NOTHING;
