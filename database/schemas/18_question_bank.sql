-- Enterprise Question Bank & Knowledge Management Database Schema

-- 1. Topics Hierarchy
CREATE TABLE IF NOT EXISTS public.question_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(150) NOT NULL,
    topic VARCHAR(150) NOT NULL,
    subtopic VARCHAR(150) DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_hierarchy UNIQUE (subject, chapter, topic, subtopic)
);

-- 2. Questions Catalog Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    statement TEXT NOT NULL, -- Supporting LaTeX / Markdown
    language VARCHAR(50) DEFAULT 'English',
    difficulty VARCHAR(50) DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Grandmaster')),
    marks NUMERIC DEFAULT 4,
    negative_marks NUMERIC DEFAULT -1,
    estimated_time_seconds INT DEFAULT 120,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'In Review', 'Approved', 'Rejected', 'Archived', 'Deprecated')),
    version INT DEFAULT 1,
    author_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.question_topics(id) ON DELETE SET NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Question Versions Snapshot Table
CREATE TABLE IF NOT EXISTS public.question_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    statement_snapshot TEXT NOT NULL,
    options_snapshot JSONB DEFAULT '[]'::jsonb,
    solutions_snapshot JSONB DEFAULT '{}'::jsonb,
    changed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Question Options Table
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    option_index VARCHAR(10) NOT NULL, -- A, B, C, D, etc.
    content TEXT NOT NULL, -- Text, Image URL, LaTeX formula
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Solutions Table
CREATE TABLE IF NOT EXISTS public.question_solutions (
    question_id UUID PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
    detailed_solution TEXT NOT NULL,
    short_solution TEXT,
    hints TEXT,
    common_mistakes TEXT,
    formulas_used TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 6. Shared Media Assets
CREATE TABLE IF NOT EXISTS public.question_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) DEFAULT 'image',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Question Reviews Queue
CREATE TABLE IF NOT EXISTS public.question_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    status VARCHAR(50) CHECK (status IN ('Approved', 'Rejected')),
    comments TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Question Usage Ledger
CREATE TABLE IF NOT EXISTS public.question_usage (
    question_id UUID PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
    contests_count INT DEFAULT 0,
    papers_count INT DEFAULT 0,
    success_rate_percent NUMERIC DEFAULT 0,
    avg_solve_time_seconds INT DEFAULT 0,
    last_used_at TIMESTAMPTZ
);

-- 9. Question Duplicates Registry
CREATE TABLE IF NOT EXISTS public.question_duplicates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    matched_question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    similarity_score NUMERIC CHECK (similarity_score BETWEEN 0 AND 100),
    status VARCHAR(50) DEFAULT 'Pending Review' CHECK (status IN ('Pending Review', 'Ignored', 'Resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Automated Validation Logs
CREATE TABLE IF NOT EXISTS public.question_validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    error_code VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Warning' CHECK (severity IN ('Warning', 'Critical')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Question Audit Logs
CREATE TABLE IF NOT EXISTS public.question_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    question_id UUID,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.question_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_duplicates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read-write all topics" ON public.question_topics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all questions" ON public.questions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all versions" ON public.question_versions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all options" ON public.question_options FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all solutions" ON public.question_solutions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all media" ON public.question_media FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all reviews" ON public.question_reviews FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all usage" ON public.question_usage FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all duplicates" ON public.question_duplicates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all validation logs" ON public.question_validation_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read-write all audits" ON public.question_audit_logs FOR ALL TO authenticated USING (TRUE);

-- 12. Seed Exam Hierarchy Tree
INSERT INTO public.question_topics (id, subject, chapter, topic, subtopic) VALUES
    ('01fa214d-cccc-4d40-bbbb-01fa214dbbbb', 'Physics', 'Electrostatics', 'Electric Charge', 'Coulombs Law'),
    ('02fa214d-cccc-4d40-bbbb-02fa214dbbbb', 'Physics', 'Magnetism', 'Magnetic Induction', 'Faradays Law'),
    ('03fa214d-cccc-4d40-bbbb-03fa214dbbbb', 'Chemistry', 'Chemical Kinetics', 'Order of Reaction', 'First Order'),
    ('04fa214d-cccc-4d40-bbbb-04fa214dbbbb', 'Biology', 'Reproduction', 'Plant Reproduction', 'Pollination')
ON CONFLICT (subject, chapter, topic, subtopic) DO NOTHING;

-- 13. Seed Core Demo Questions
INSERT INTO public.questions (id, title, statement, difficulty, marks, topic_id, tags, status) VALUES
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 'Coulombs Law Magnitude', 'What is the magnitude of electrostatic force between two 1C charges separated by 1m in vacuum?', 'Medium', 4, '01fa214d-cccc-4d40-bbbb-01fa214dbbbb', ARRAY['Electrostatics', 'JEE'], 'Approved'),
    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 'Faradays Induction Rule', 'A bar magnet is dropped down a hollow copper tube. Describe its motion due to magnetic currents induction.', 'Hard', 4, '02fa214d-cccc-4d40-bbbb-02fa214dbbbb', ARRAY['Magnetism', 'JEE-Advanced'], 'Approved'),
    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 'Order of Kinematics Reaction', 'What fraction of a reactant remains in a first-order chemical reaction after three half-lives have elapsed?', 'Easy', 4, '03fa214d-cccc-4d40-bbbb-03fa214dbbbb', ARRAY['Kinetics', 'NEET'], 'In Review')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- 14. Seed Options
INSERT INTO public.question_options (question_id, option_index, content, is_correct) VALUES
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 'A', '9 * 10^9 Newtons', TRUE),
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 'B', '1 Newton', FALSE),
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 'C', '3 * 10^8 Newtons', FALSE),
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 'D', 'None of the above', FALSE),

    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 'A', 'It falls with terminal velocity due to eddy currents damping', TRUE),
    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 'B', 'It falls freely with acceleration g', FALSE),
    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 'C', 'It repels and bounces backwards', FALSE),
    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 'D', 'None of these', FALSE),

    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 'A', '1/8', TRUE),
    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 'B', '1/6', FALSE),
    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 'C', '1/3', FALSE),
    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 'D', '1/4', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 15. Seed Solutions
INSERT INTO public.question_solutions (question_id, detailed_solution, hints) VALUES
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 'According to Coulombs Law, F = k * (q1 * q2) / r^2. Given q1 = q2 = 1, r = 1, F = k = 8.987 * 10^9 N.', 'Use formula force = k q1 q2 / r^2'),
    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 'Eddy currents induced in the copper tube create a secondary opposing magnetic field that decelerates the falling magnet.', 'Lenz Law dictates magnetic opposition'),
    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 'After three half-lives: (1/2)^3 = 1/8.', 'Formula reactant fraction = (1/2)^n')
ON CONFLICT (question_id) DO NOTHING;

-- 16. Seed Usage
INSERT INTO public.question_usage (question_id, contests_count, papers_count, success_rate_percent, avg_solve_time_seconds) VALUES
    ('22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 3, 5, 82, 45),
    ('33fa214d-ffff-4d40-bbbb-33fa214dbbbb', 1, 2, 41, 140),
    ('44fa214d-ffff-4d40-bbbb-44fa214dbbbb', 0, 0, 0, 0)
ON CONFLICT (question_id) DO NOTHING;
