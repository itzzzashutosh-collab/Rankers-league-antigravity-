-- ============================================================
-- Ranker's League: Verifier & Trust Validation Ledger
-- Schema 31: Verification Reports, Evidence, and Hallucination Prevention
-- ============================================================

-- 1. Verifications Main Ledger
CREATE TABLE IF NOT EXISTS public.ai_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL, -- references public.ai_reviews(id)
    reviewer_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    verifier_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'PartiallyVerified', 'Rejected', 'NeedsHumanReview')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Verification Rules table
CREATE TABLE IF NOT EXISTS public.ai_verification_rules (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'FactChecking', 'BusinessValidation', 'ConsistencyCheck'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Verification Reports
CREATE TABLE IF NOT EXISTS public.ai_verification_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
    summary TEXT,
    recommendations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Evidence reference mappings
CREATE TABLE IF NOT EXISTS public.ai_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
    evidence_type VARCHAR(60) NOT NULL, -- 'DatabaseRecord', 'WorkflowOutput', 'DocReference'
    source_reference TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Detailed Fact Validation Checks list
CREATE TABLE IF NOT EXISTS public.ai_fact_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
    fact_description TEXT NOT NULL,
    passed BOOLEAN DEFAULT TRUE,
    confidence_score NUMERIC(4, 2) CHECK (confidence_score BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Confidence scores index
CREATE TABLE IF NOT EXISTS public.ai_confidence_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
    fact_confidence NUMERIC(4, 2) CHECK (fact_confidence BETWEEN 0.00 AND 1.00),
    evidence_confidence NUMERIC(4, 2) CHECK (evidence_confidence BETWEEN 0.00 AND 1.00),
    calculation_confidence NUMERIC(4, 2) CHECK (calculation_confidence BETWEEN 0.00 AND 1.00),
    overall_confidence NUMERIC(4, 2) CHECK (overall_confidence BETWEEN 0.00 AND 1.00),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Hallucination flags logs
CREATE TABLE IF NOT EXISTS public.ai_hallucination_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
    issue_type VARCHAR(50) NOT NULL, -- 'UnsupportedClaim', 'ConflictingFacts', 'FakeCalculation'
    details TEXT NOT NULL,
    severity VARCHAR(30) DEFAULT 'High',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Execution history tracking
CREATE TABLE IF NOT EXISTS public.ai_verification_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verification_id UUID REFERENCES public.ai_verifications(id) ON DELETE CASCADE,
    action_taken VARCHAR(100) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Verification performance metrics
CREATE TABLE IF NOT EXISTS public.ai_verification_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verifier_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    checks_count INT DEFAULT 0,
    failures_count INT DEFAULT 0,
    duration_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Verification Audit Ledger
CREATE TABLE IF NOT EXISTS public.ai_verification_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    verification_id UUID,
    actor_id VARCHAR(80),
    action VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_verification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_verification_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_fact_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_confidence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_hallucination_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_verification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_verification_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_verification_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins verifications" ON public.ai_verifications FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins rules" ON public.ai_verification_rules FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins reports" ON public.ai_verification_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins evidence" ON public.ai_evidence FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins fact_checks" ON public.ai_fact_checks FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins scores" ON public.ai_confidence_scores FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins hallucinations" ON public.ai_hallucination_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins history" ON public.ai_verification_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins metrics" ON public.ai_verification_metrics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins audit" ON public.ai_verification_audit_logs FOR ALL TO authenticated USING (TRUE);

-- Seeds
INSERT INTO public.ai_verification_rules (id, name, rule_type, details) VALUES
    ('BALANCE_CALCULATION_RULE', 'Ensure candidate prize earnings equal the correct tier rewards config.', 'FactChecking', '{}'::jsonb),
    ('CONTEST_SEATS_RULE', 'Verify actual candidate counts match the database registrations count.', 'BusinessValidation', '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
