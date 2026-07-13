-- ============================================================
-- Ranker's League: Digital CMO & Marketing Command Ledger
-- Schema 35: Campaigns, SEO, referrals, and content planners
-- ============================================================

-- 1. CMO campaigns table
CREATE TABLE IF NOT EXISTS public.cmo_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed', 'Paused')),
    budget_usd NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CMO Growth Metrics
CREATE TABLE IF NOT EXISTS public.cmo_growth_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_date DATE UNIQUE NOT NULL,
    registrations INT DEFAULT 0,
    active_users INT DEFAULT 0,
    cac_usd NUMERIC(10, 4) DEFAULT 0.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CMO Content Calendar
CREATE TABLE IF NOT EXISTS public.cmo_content_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(250) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'Blog', 'Newsletter', 'Tweet'
    publish_date DATE NOT NULL,
    status VARCHAR(40) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Reviewed', 'Verified', 'Published')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CMO Brand Assets
CREATE TABLE IF NOT EXISTS public.cmo_brand_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_name VARCHAR(150) NOT NULL,
    asset_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CMO Social Calendar
CREATE TABLE IF NOT EXISTS public.cmo_social_calendar (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL, -- 'Twitter', 'LinkedIn', 'Instagram'
    post_content TEXT NOT NULL,
    post_date TIMESTAMPTZ NOT NULL,
    status VARCHAR(40) DEFAULT 'Scheduled',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CMO SEO Metrics
CREATE TABLE IF NOT EXISTS public.cmo_seo_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword VARCHAR(150) NOT NULL UNIQUE,
    ranking_position INT DEFAULT 100,
    search_volume INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CMO Referrals registry
CREATE TABLE IF NOT EXISTS public.cmo_referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_code VARCHAR(50) NOT NULL UNIQUE,
    referrer_user_id UUID,
    conversions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CMO Partnerships
CREATE TABLE IF NOT EXISTS public.cmo_partnerships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_name VARCHAR(200) NOT NULL,
    integration_type VARCHAR(100) NOT NULL, -- 'Coaching', 'Sponsorship'
    status VARCHAR(40) DEFAULT 'Negotiation',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CMO Outreach
CREATE TABLE IF NOT EXISTS public.cmo_outreach (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_name VARCHAR(200) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CMO Reports
CREATE TABLE IF NOT EXISTS public.cmo_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL, -- 'CampaignRoi', 'SeoAudit'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CMO Marketing Budgets
CREATE TABLE IF NOT EXISTS public.cmo_marketing_budget (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    allocated_usd NUMERIC(10, 2) DEFAULT 0.00,
    spent_usd NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CMO Experiments log
CREATE TABLE IF NOT EXISTS public.cmo_experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hypothesis TEXT NOT NULL,
    status VARCHAR(40) DEFAULT 'Running',
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.cmo_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_growth_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_social_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_seo_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_marketing_budget ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cmo_experiments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins campaigns" ON public.cmo_campaigns FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins growth" ON public.cmo_growth_metrics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins content" ON public.cmo_content_calendar FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins assets" ON public.cmo_brand_assets FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins social" ON public.cmo_social_calendar FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins seo" ON public.cmo_seo_metrics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins referrals" ON public.cmo_referrals FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins partnerships" ON public.cmo_partnerships FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins outreach" ON public.cmo_outreach FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins reports" ON public.cmo_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins budget" ON public.cmo_marketing_budget FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins experiments" ON public.cmo_experiments FOR ALL TO authenticated USING (TRUE);

-- Seeds
INSERT INTO public.cmo_seo_metrics (keyword, ranking_position, search_volume) VALUES
    ('best upsc mock test platform', 3, 2400),
    ('neet chemistry practice free MCQs', 8, 4800)
ON CONFLICT (keyword) DO UPDATE SET ranking_position = EXCLUDED.ranking_position;

INSERT INTO public.cmo_content_calendar (title, content_type, publish_date, status) VALUES
    ('How to clear JEE Advanced physics paper rules', 'Blog', CURRENT_DATE + 2, 'Draft'),
    ('UPSC Elite Grandmaster Tier Payout Release notes', 'Newsletter', CURRENT_DATE + 4, 'Draft')
ON CONFLICT DO NOTHING;

INSERT INTO public.cmo_campaigns (title, status, budget_usd) VALUES
    ('NEET Biology Sprint Promotion launch', 'Active', 450.00)
ON CONFLICT DO NOTHING;
