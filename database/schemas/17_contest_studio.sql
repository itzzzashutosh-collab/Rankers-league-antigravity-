-- Contest Management Studio Database Schema

-- 1. contest_categories Table
CREATE TABLE IF NOT EXISTS public.contest_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. contests Table
CREATE TABLE IF NOT EXISTS public.contests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    banner_url TEXT,
    category_id UUID REFERENCES public.contest_categories(id) ON DELETE SET NULL,
    exam_name VARCHAR(150) NOT NULL,
    description TEXT,
    short_description TEXT,
    difficulty VARCHAR(50) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Grandmaster')),
    languages TEXT[] DEFAULT ARRAY['English'],
    thumbnail_url TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    visibility VARCHAR(50) DEFAULT 'Public' CHECK (visibility IN ('Public', 'Private', 'Unlisted')),
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN (
        'Draft', 'Internal Review', 'Scheduled', 'Registration Open', 
        'Registration Closed', 'Lobby Opens', 'Live', 'Completed', 
        'Evaluation', 'Result Published', 'Prize Distributed', 'Archived'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. contest_settings Table
CREATE TABLE IF NOT EXISTS public.contest_settings (
    contest_id UUID PRIMARY KEY REFERENCES public.contests(id) ON DELETE CASCADE,
    contest_type VARCHAR(50) DEFAULT 'Mega' CHECK (contest_type IN ('Mega', 'Grand', 'Sprint', 'Custom')),
    entry_fee NUMERIC DEFAULT 0,
    max_participants INT DEFAULT 1000,
    min_participants INT DEFAULT 10,
    platform_fee_percentage NUMERIC DEFAULT 30 CHECK (platform_fee_percentage BETWEEN 0 AND 100),
    min_winner_percentage NUMERIC DEFAULT 50 CHECK (min_winner_percentage BETWEEN 0 AND 100),
    min_reward NUMERIC DEFAULT 0
);

-- 4. contest_registration_settings Table
CREATE TABLE IF NOT EXISTS public.contest_registration_settings (
    contest_id UUID PRIMARY KEY REFERENCES public.contests(id) ON DELETE CASCADE,
    opens_at TIMESTAMPTZ,
    closes_at TIMESTAMPTZ,
    allow_waiting_list BOOLEAN DEFAULT TRUE,
    max_entries_per_user INT DEFAULT 1,
    refund_policy TEXT,
    cancellation_rules TEXT
);

-- 5. contest_schedule Table
CREATE TABLE IF NOT EXISTS public.contest_schedule (
    contest_id UUID PRIMARY KEY REFERENCES public.contests(id) ON DELETE CASCADE,
    contest_date DATE NOT NULL,
    reporting_time TIMESTAMPTZ,
    lobby_time TIMESTAMPTZ,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata'
);

-- 6. contest_prize_settings Table
CREATE TABLE IF NOT EXISTS public.contest_prize_settings (
    contest_id UUID PRIMARY KEY REFERENCES public.contests(id) ON DELETE CASCADE,
    first_prize_multiplier NUMERIC DEFAULT 1,
    distribution_curve VARCHAR(50) DEFAULT 'Balanced' CHECK (distribution_curve IN ('Balanced', 'Aggressive', 'Top Heavy', 'Flat')),
    generated_prize_pool NUMERIC DEFAULT 0,
    prize_matrix_json JSONB DEFAULT '[]'::jsonb
);

-- 7. contest_templates Table
CREATE TABLE IF NOT EXISTS public.contest_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.contest_categories(id) ON DELETE SET NULL,
    difficulty VARCHAR(50) DEFAULT 'Medium',
    settings_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. contest_status_history Table
CREATE TABLE IF NOT EXISTS public.contest_status_history (
    id BIGSERIAL PRIMARY KEY,
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    from_status VARCHAR(50),
    to_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. contest_audit_logs Table
CREATE TABLE IF NOT EXISTS public.contest_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    contest_id UUID REFERENCES public.contests(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contest_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_registration_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_prize_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_audit_logs ENABLE ROW LEVEL SECURITY;

-- Setup full access policies for authenticated admins
CREATE POLICY "Admins full access on categories" ON public.contest_categories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on contests" ON public.contests FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on settings" ON public.contest_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on registration settings" ON public.contest_registration_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on schedule" ON public.contest_schedule FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on prize settings" ON public.contest_prize_settings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on templates" ON public.contest_templates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on status history" ON public.contest_status_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on audits logs" ON public.contest_audit_logs FOR ALL TO authenticated USING (TRUE);

-- 10. Seed Initial Categories
INSERT INTO public.contest_categories (id, name, slug) VALUES
    ('11fa214d-bbbb-4d40-bbbb-11fa214dbbbb', 'Civil Services', 'civil-services'),
    ('22fa214d-bbbb-4d40-bbbb-22fa214dbbbb', 'Engineering', 'engineering'),
    ('33fa214d-bbbb-4d40-bbbb-33fa214dbbbb', 'Medical', 'medical'),
    ('44fa214d-bbbb-4d40-bbbb-44fa214dbbbb', 'Management', 'management')
ON CONFLICT (name) DO NOTHING;

-- 11. Seed Catalog Templates
INSERT INTO public.contest_templates (id, name, category_id, difficulty, settings_json) VALUES
    ('a1fa214d-bbbb-4d40-bbbb-a1fa214dbbbb', 'UPSC Mega Blueprint', '11fa214d-bbbb-4d40-bbbb-11fa214dbbbb', 'Hard', '{"entry_fee":499,"max_participants":50000,"platform_fee":20,"winner_percentage":50}'),
    ('b2fa214d-bbbb-4d40-bbbb-b2fa214dbbbb', 'JEE Weekly Sprint', '22fa214d-bbbb-4d40-bbbb-22fa214dbbbb', 'Medium', '{"entry_fee":99,"max_participants":5000,"platform_fee":30,"winner_percentage":50}'),
    ('c3fa214d-bbbb-4d40-bbbb-c3fa214dbbbb', 'NEET Biology Sprint', '33fa214d-bbbb-4d40-bbbb-33fa214dbbbb', 'Easy', '{"entry_fee":49,"max_participants":10000,"platform_fee":25,"winner_percentage":50}')
ON CONFLICT (name) DO NOTHING;

-- 12. Seed Sample Contests
INSERT INTO public.contests (id, name, slug, category_id, exam_name, description, difficulty, status) VALUES
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'UPSC Prelims Elite Arena (GS-01)', 'upsc-elite-league', '11fa214d-bbbb-4d40-bbbb-11fa214dbbbb', 'UPSC CSE Prelims', 'Test your dynamic preparedness for Civil Services Exam GS-1.', 'Hard', 'Live'),
    ('6fa2144d-bbbb-4d40-bbbb-6fa2144dbbbb', 'JEE Advanced Physics Grandmaster Challenge', 'jee-advanced-physics', '22fa214d-bbbb-4d40-bbbb-22fa214dbbbb', 'JEE Advanced', 'Cracking magnetism and thermodynamics with elite rankers.', 'Grandmaster', 'Live'),
    ('7fa2144d-bbbb-4d40-bbbb-7fa2144dbbbb', 'NEET Biology Speed Sprint (Reproduction)', 'neet-biology-reproduction', '33fa214d-bbbb-4d40-bbbb-33fa214dbbbb', 'NEET UG', 'Check your reproductive biology concepts speed limits.', 'Easy', 'Evaluation')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- 13. Seed Settings
INSERT INTO public.contest_settings (contest_id, contest_type, entry_fee, max_participants, min_participants, platform_fee_percentage, min_winner_percentage, min_reward) VALUES
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'Mega', 499, 50000, 100, 20, 50, 499),
    ('6fa2144d-bbbb-4d40-bbbb-6fa2144dbbbb', 'Grand', 199, 10000, 50, 25, 50, 199),
    ('7fa2144d-bbbb-4d40-bbbb-7fa2144dbbbb', 'Sprint', 49, 10000, 20, 30, 50, 49)
ON CONFLICT (contest_id) DO NOTHING;

-- 14. Seed Schedules
INSERT INTO public.contest_schedule (contest_id, contest_date, start_time, end_time) VALUES
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', CURRENT_DATE, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '1 hour'),
    ('6fa2144d-bbbb-4d40-bbbb-6fa2144dbbbb', CURRENT_DATE, NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '30 minutes'),
    ('7fa2144d-bbbb-4d40-bbbb-7fa2144dbbbb', CURRENT_DATE, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour')
ON CONFLICT (contest_id) DO NOTHING;
