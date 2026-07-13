-- Enterprise Examination Paper Builder Database Schema

-- 1. Papers Catalog Table
CREATE TABLE IF NOT EXISTS public.papers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'JEE-2026-MAIN-A'
    version VARCHAR(20) DEFAULT '1.0',
    contest_id UUID, -- Optional foreign link to contests
    exam_name VARCHAR(150) NOT NULL, -- e.g. 'JEE Main', 'NEET UG', 'UPSC CSE'
    language VARCHAR(50) DEFAULT 'English',
    duration_minutes INT DEFAULT 180,
    max_marks NUMERIC DEFAULT 360,
    negative_marking BOOLEAN DEFAULT TRUE,
    instructions TEXT,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Building', 'Review', 'Approved', 'Locked', 'Published', 'Archived')),
    creator_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    is_immutable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Paper Sections Table
CREATE TABLE IF NOT EXISTS public.paper_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. 'Physics Section A', 'Chemistry Section B'
    marks_per_question NUMERIC DEFAULT 4,
    negative_marks_per_question NUMERIC DEFAULT -1,
    duration_minutes INT,
    instructions TEXT,
    order_index INT DEFAULT 0
);

-- 3. Paper Blueprints Table
CREATE TABLE IF NOT EXISTS public.paper_blueprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(150) DEFAULT 'All',
    difficulty VARCHAR(50) DEFAULT 'Medium',
    target_question_count INT DEFAULT 10,
    marks_weightage NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Paper Question Mapping Table (Only Approved Questions)
CREATE TABLE IF NOT EXISTS public.paper_question_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    section_id UUID REFERENCES public.paper_sections(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id) ON DELETE RESTRICT, -- Do not allow deleting active paper questions
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Paper Randomization Table
CREATE TABLE IF NOT EXISTS public.paper_randomization (
    paper_id UUID PRIMARY KEY REFERENCES public.papers(id) ON DELETE CASCADE,
    random_mode VARCHAR(50) DEFAULT 'Fixed' CHECK (random_mode IN ('Fixed', 'Random', 'Section-wise', 'Candidate-wise')),
    randomize_options BOOLEAN DEFAULT TRUE,
    randomize_sections BOOLEAN DEFAULT FALSE
);

-- 6. Paper Templates blueprints catalog
CREATE TABLE IF NOT EXISTS public.paper_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL, -- e.g. 'JEE Main Standard Blueprint'
    exam_name VARCHAR(150) NOT NULL,
    default_duration_minutes INT DEFAULT 180,
    default_max_marks NUMERIC DEFAULT 360,
    sections_json JSONB DEFAULT '[]'::jsonb, -- sections specifications
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Paper Quality Scores Table
CREATE TABLE IF NOT EXISTS public.paper_quality_scores (
    paper_id UUID PRIMARY KEY REFERENCES public.papers(id) ON DELETE CASCADE,
    difficulty_balance_score INT DEFAULT 100, -- out of 100
    chapter_coverage_score INT DEFAULT 100,
    topic_diversity_score INT DEFAULT 100,
    exposure_risk_score INT DEFAULT 0, -- percent exposure risk
    overall_quality_score INT DEFAULT 100,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Paper Validation Logs Table
CREATE TABLE IF NOT EXISTS public.paper_validation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    code VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'Warning' CHECK (severity IN ('Warning', 'Critical'))
);

-- 9. Paper Audit log trail
CREATE TABLE IF NOT EXISTS public.paper_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Paper Review Workflow approvals ledger
CREATE TABLE IF NOT EXISTS public.paper_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    decision VARCHAR(50) CHECK (decision IN ('Approved', 'Rejected')),
    comments TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Paper Versions snaps
CREATE TABLE IF NOT EXISTS public.paper_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paper_id UUID REFERENCES public.papers(id) ON DELETE CASCADE,
    version_label VARCHAR(20) NOT NULL, -- e.g. 'v1.0', 'v2.0'
    mapped_questions_json JSONB DEFAULT '[]'::jsonb,
    sections_json JSONB DEFAULT '[]'::jsonb,
    changed_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_question_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_randomization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_quality_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_versions ENABLE ROW LEVEL SECURITY;

-- Admins full access policies
CREATE POLICY "Admins full access on papers" ON public.papers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on sections" ON public.paper_sections FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on blueprints" ON public.paper_blueprints FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on question mappings" ON public.paper_question_mapping FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on randomization" ON public.paper_randomization FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on templates" ON public.paper_templates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on quality scores" ON public.paper_quality_scores FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on validation logs" ON public.paper_validation_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on audit logs" ON public.paper_audit_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on reviews" ON public.paper_reviews FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full access on versions" ON public.paper_versions FOR ALL TO authenticated USING (TRUE);

-- 12. Seed Core Templates
INSERT INTO public.paper_templates (id, name, exam_name, default_duration_minutes, default_max_marks, sections_json) VALUES
    ('44fa214d-dddd-4d40-bbbb-44fa214dbbbb', 'JEE Main Standard Blueprint', 'JEE Main', 180, 360, '[{"name":"Physics","questions":30},{"name":"Chemistry","questions":30},{"name":"Mathematics","questions":30}]'::jsonb),
    ('55fa214d-dddd-4d40-bbbb-55fa214dbbbb', 'NEET UG Biology Special', 'NEET UG', 180, 720, '[{"name":"Botany","questions":45},{"name":"Zoology","questions":45}]'::jsonb),
    ('66fa214d-dddd-4d40-bbbb-66fa214dbbbb', 'UPSC GS-01 Prelims Blueprint', 'UPSC CSE', 120, 200, '[{"name":"General Studies","questions":100}]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- 13. Seed Sample Completed Exam Papers
INSERT INTO public.papers (id, name, code, version, exam_name, duration_minutes, max_marks, status) VALUES
    ('8fa2144d-bbbb-4d40-bbbb-8fa2144dbbbb', 'JEE Main Physics Grandmaster Paper 2026', 'JEE-2026-PHYSICS-A', '1.0', 'JEE Main', 180, 360, 'Approved'),
    ('9fa2144d-bbbb-4d40-bbbb-9fa2144dbbbb', 'UPSC Prelims GS Paper 01 Standard Series', 'UPSC-2026-GS-A', '1.0', 'UPSC CSE', 120, 200, 'Draft')
ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status;

-- 14. Seed Sections
INSERT INTO public.paper_sections (paper_id, name, marks_per_question, negative_marks_per_question, order_index) VALUES
    ('8fa2144d-bbbb-4d40-bbbb-8fa2144dbbbb', 'Physics Section A', 4, -1, 0),
    ('8fa2144d-bbbb-4d40-bbbb-8fa2144dbbbb', 'Physics Section B', 4, 0, 1),
    ('9fa2144d-bbbb-4d40-bbbb-9fa2144dbbbb', 'General Studies Section A', 2, -0.66, 0)
ON CONFLICT (id) DO NOTHING;

-- 15. Seed Question Mapping logs
-- Mapping seeded Coulomb charges question (22fa214d-ffff-4d40-bbbb-22fa214dbbbb) into Physics Paper
INSERT INTO public.paper_question_mapping (paper_id, section_id, question_id, order_index) VALUES
    ('8fa2144d-bbbb-4d40-bbbb-8fa2144dbbbb', (SELECT id FROM public.paper_sections WHERE paper_id = '8fa2144d-bbbb-4d40-bbbb-8fa2144dbbbb' LIMIT 1), '22fa214d-ffff-4d40-bbbb-22fa214dbbbb', 0)
ON CONFLICT (id) DO NOTHING;

-- 16. Seed Quality Scores
INSERT INTO public.paper_quality_scores (paper_id, difficulty_balance_score, chapter_coverage_score, topic_diversity_score, exposure_risk_score, overall_quality_score) VALUES
    ('8fa2144d-bbbb-4d40-bbbb-8fa2144dbbbb', 95, 90, 88, 5, 91),
    ('9fa2144d-bbbb-4d40-bbbb-9fa2144dbbbb', 80, 75, 70, 0, 75)
ON CONFLICT (paper_id) DO NOTHING;
