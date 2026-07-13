-- ============================================================
-- Ranker's League: Reviewer & Quality Control Ledger
-- Schema 29: QA Engine, Style Rules, and Suggestion logs
-- ============================================================

-- 1. Reviews Main Ledger
CREATE TABLE IF NOT EXISTS public.ai_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL, -- references public.ai_tasks(id)
    executor_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    reviewer_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'NeedsCorrection')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Style & Quality Rules Registry
CREATE TABLE IF NOT EXISTS public.ai_review_rules (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'StyleGuide', 'JSONSchema', 'BusinessRule'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Review Results checkpoint
CREATE TABLE IF NOT EXISTS public.ai_review_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
    rule_id VARCHAR(80) REFERENCES public.ai_review_rules(id) ON DELETE SET NULL,
    passed BOOLEAN DEFAULT TRUE,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Quality Scores ledger
CREATE TABLE IF NOT EXISTS public.ai_quality_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
    completeness_score NUMERIC(4, 2) CHECK (completeness_score BETWEEN 0.00 AND 1.00),
    formatting_score NUMERIC(4, 2) CHECK (formatting_score BETWEEN 0.00 AND 1.00),
    reasoning_score NUMERIC(4, 2) CHECK (reasoning_score BETWEEN 0.00 AND 1.00),
    overall_score NUMERIC(4, 2) CHECK (overall_score BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Review History Ledger
CREATE TABLE IF NOT EXISTS public.ai_review_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
    action_taken VARCHAR(100) NOT NULL, -- 'Approved', 'RejectedForCorrection'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Review metrics analytics
CREATE TABLE IF NOT EXISTS public.ai_review_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    reviews_count INT DEFAULT 0,
    corrections_requested_count INT DEFAULT 0,
    average_review_time_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Review findings entries
CREATE TABLE IF NOT EXISTS public.ai_review_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID REFERENCES public.ai_reviews(id) ON DELETE CASCADE,
    finding_type VARCHAR(40) NOT NULL CHECK (finding_type IN ('Critical', 'Major', 'Medium', 'Minor', 'Suggestion', 'Observation')),
    message TEXT NOT NULL,
    path TEXT, -- points to output JSON path
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Autocorrection suggestions
CREATE TABLE IF NOT EXISTS public.ai_review_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finding_id UUID REFERENCES public.ai_review_findings(id) ON DELETE CASCADE,
    suggested_fix TEXT NOT NULL,
    applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Review audit logs
CREATE TABLE IF NOT EXISTS public.ai_review_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    review_id UUID,
    actor_id VARCHAR(80),
    action VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_review_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins reviews" ON public.ai_reviews FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins review_rules" ON public.ai_review_rules FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins review_results" ON public.ai_review_results FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins quality_scores" ON public.ai_quality_scores FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins review_history" ON public.ai_review_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins review_metrics" ON public.ai_review_metrics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins findings" ON public.ai_review_findings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins suggestions" ON public.ai_review_suggestions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins audit" ON public.ai_review_audit_logs FOR ALL TO authenticated USING (TRUE);

-- Seeds review rules
INSERT INTO public.ai_review_rules (id, name, rule_type, details) VALUES
    ('JSON_SCHEMA_VALIDATION', 'Verify output JSON parses and aligns with required fields keys.', 'JSONSchema', '{}'::jsonb),
    ('BRAND_TONE_COMPLIANCE', 'Check tone aligns with professional minimal brand guide.', 'StyleGuide', '{}'::jsonb),
    ('BUDGET_CAP_ENFORCEMENT', 'Validate cost parameters do not breach maximum department limits.', 'BusinessRule', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
