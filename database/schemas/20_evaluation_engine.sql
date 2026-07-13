-- Enterprise Examination Evaluation Engine Database Schema

-- 1. Evaluation Jobs Table
CREATE TABLE IF NOT EXISTS public.evaluation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Completed', 'Failed')),
    current_stage VARCHAR(100) DEFAULT 'Answers Locked',
    participants_count INT DEFAULT 0,
    processed_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Evaluation Workers
CREATE TABLE IF NOT EXISTS public.evaluation_workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Idle' CHECK (status IN ('Idle', 'Active', 'Offline')),
    average_speed_ms INT DEFAULT 15, -- ms per script
    last_ping TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Live Evaluation Logs
CREATE TABLE IF NOT EXISTS public.evaluation_logs (
    id BIGSERIAL PRIMARY KEY,
    job_id UUID REFERENCES public.evaluation_jobs(id) ON DELETE CASCADE,
    level VARCHAR(20) DEFAULT 'INFO',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Candidate Answer Sheets
CREATE TABLE IF NOT EXISTS public.answer_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    answers_json JSONB DEFAULT '{}'::jsonb, -- index -> answer mapping
    submitted_at TIMESTAMPTZ,
    time_taken_seconds INT DEFAULT 0
);

-- 5. Marks Breakdown Table
CREATE TABLE IF NOT EXISTS public.marks_breakdown (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    answer_sheet_id UUID REFERENCES public.answer_sheets(id) ON DELETE CASCADE,
    question_id UUID NOT NULL,
    candidate_answer VARCHAR(50),
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded NUMERIC DEFAULT 0,
    negative_applied NUMERIC DEFAULT 0,
    bonus_awarded NUMERIC DEFAULT 0
);

-- 6. Overall Evaluation Results
CREATE TABLE IF NOT EXISTS public.evaluation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    total_score NUMERIC DEFAULT 0,
    correct_count INT DEFAULT 0,
    incorrect_count INT DEFAULT 0,
    unanswered_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tie-breaking Rules configuration
CREATE TABLE IF NOT EXISTS public.tie_break_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'Less Time Taken', 'Hard Question Accuracy'
    order_index INT UNIQUE NOT NULL
);

-- 8. Bonus Rules Configuration
CREATE TABLE IF NOT EXISTS public.bonus_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    question_id UUID NOT NULL,
    rule_type VARCHAR(100) CHECK (rule_type IN ('Everyone Gets Marks', 'Multiple Correct', 'Manual Bonus')),
    bonus_marks NUMERIC DEFAULT 4
);

-- 9. Contest Rankings List
CREATE TABLE IF NOT EXISTS public.contest_rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    overall_rank INT NOT NULL,
    national_rank INT,
    regional_rank INT,
    category_rank INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Prize Allocations Table
CREATE TABLE IF NOT EXISTS public.prize_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    rank_position INT NOT NULL,
    prize_amount NUMERIC DEFAULT 0,
    aura_points_allocated INT DEFAULT 0,
    is_credited BOOLEAN DEFAULT FALSE,
    credited_at TIMESTAMPTZ
);

-- 11. Wallet Credit Queue Ledger
CREATE TABLE IF NOT EXISTS public.wallet_credit_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL,
    amount NUMERIC NOT NULL,
    reference_id UUID, -- References prize_allocations
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Credited', 'Failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Certificates Queue
CREATE TABLE IF NOT EXISTS public.certificate_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    username VARCHAR(100) NOT NULL,
    certificate_type VARCHAR(50) DEFAULT 'Participation' CHECK (certificate_type IN ('Participation', 'Winner', 'Top Performer')),
    verification_code VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Generated')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Leaderboard Updates Logs
CREATE TABLE IF NOT EXISTS public.leaderboard_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    update_type VARCHAR(50) CHECK (update_type IN ('Weekly', 'Monthly', 'Yearly', 'Global')),
    records_count INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Result Publications ledger
CREATE TABLE IF NOT EXISTS public.result_publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID UNIQUE NOT NULL,
    published_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Evaluation Audit Logs
CREATE TABLE IF NOT EXISTS public.evaluation_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    contest_id UUID,
    action VARCHAR(150) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.evaluation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answer_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tie_break_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonus_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_credit_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access on evaluation jobs" ON public.evaluation_jobs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on workers" ON public.evaluation_workers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on logs" ON public.evaluation_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on answers" ON public.answer_sheets FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on breakdowns" ON public.marks_breakdown FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on results" ON public.evaluation_results FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on rules" ON public.tie_break_rules FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on bonuses" ON public.bonus_rules FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on rankings" ON public.contest_rankings FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on allocations" ON public.prize_allocations FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on wallets queue" ON public.wallet_credit_queue FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on certs queue" ON public.certificate_queue FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on leaderboards" ON public.leaderboard_updates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on publications" ON public.result_publications FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on evaluations audits" ON public.evaluation_audit_logs FOR ALL TO authenticated USING (TRUE);

-- 16. Seed Tie Breaking Rules
INSERT INTO public.tie_break_rules (rule_name, order_index) VALUES
    ('Higher Score', 0),
    ('Less Time Taken', 1),
    ('Higher Hard Question Accuracy', 2),
    ('Higher Last Section Score', 3),
    ('Earlier Submission', 4)
ON CONFLICT (rule_name) DO NOTHING;

-- 17. Seed Workers status
INSERT INTO public.evaluation_workers (name, status, average_speed_ms) VALUES
    ('Grader Thread 01 (AWS-Worker)', 'Idle', 12),
    ('Grader Thread 02 (AWS-Worker)', 'Idle', 15),
    ('Audit Auditor Core (Internal)', 'Offline', 45)
ON CONFLICT (id) DO NOTHING;

-- 18. Seed Demo Evaluation Jobs
INSERT INTO public.evaluation_jobs (id, contest_id, status, current_stage, participants_count, processed_count) VALUES
    ('aa2144dd-ffff-4d40-bbbb-aa2144ddbbbb', '5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'Completed', 'Result Published', 18450, 18450),
    ('bb2144dd-ffff-4d40-bbbb-bb2144ddbbbb', '6fa2144d-bbbb-4d40-bbbb-6fa2144dbbbb', 'Processing', 'Tie Breaking', 12400, 8900)
ON CONFLICT (id) DO NOTHING;

-- 19. Seed Demo Rankings
INSERT INTO public.contest_rankings (contest_id, username, overall_rank, national_rank) VALUES
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'amit_sharma_98', 1, 1),
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'priya_k_reddy', 2, 2),
    ('5fa2144d-bbbb-4d40-bbbb-5fa2144dbbbb', 'rohan_verma_delhi', 3, 3)
ON CONFLICT (id) DO NOTHING;
