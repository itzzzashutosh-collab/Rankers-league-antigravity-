-- Database Schema for Latest Unified Exam Hierarchy & Template Bank
-- Prefix: latest_

-- 1. EXAMS
CREATE TABLE IF NOT EXISTS public.latest_exams (
    exam_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name TEXT NOT NULL UNIQUE,
    full_form TEXT,
    description TEXT,
    nationality TEXT,
    exam_mode TEXT,
    exam_category TEXT,
    official_website TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS
CREATE TABLE IF NOT EXISTS public.latest_subjects (
    subject_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name TEXT NOT NULL REFERENCES public.latest_exams(exam_name) ON DELETE CASCADE,
    subject_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (exam_name, subject_name)
);

-- 3. CHAPTERS
CREATE TABLE IF NOT EXISTS public.latest_chapters (
    chapter_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (exam_name, subject_name) REFERENCES public.latest_subjects(exam_name, subject_name) ON DELETE CASCADE,
    UNIQUE (exam_name, subject_name, chapter_name)
);

-- 4. TOPICS
CREATE TABLE IF NOT EXISTS public.latest_topics (
    topic_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    topic_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (exam_name, subject_name, chapter_name) REFERENCES public.latest_chapters(exam_name, subject_name, chapter_name) ON DELETE CASCADE,
    UNIQUE (exam_name, subject_name, chapter_name, topic_name)
);

-- 5. CONCEPTS
CREATE TABLE IF NOT EXISTS public.latest_concepts (
    concept_id TEXT PRIMARY KEY, -- keep text or uuid since CSV uses text/UUIDs
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    concept_description TEXT,
    concept_formula TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (exam_name, subject_name, chapter_name, topic_name) REFERENCES public.latest_topics(exam_name, subject_name, chapter_name, topic_name) ON DELETE CASCADE,
    UNIQUE (exam_name, subject_name, chapter_name, topic_name, concept_name)
);

-- 6. CONCEPT TEMPLATES
CREATE TABLE IF NOT EXISTS public.latest_concept_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concept_id TEXT REFERENCES public.latest_concepts(concept_id) ON DELETE CASCADE,
    original_template_id TEXT,
    
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    
    template_name TEXT,
    template_type TEXT DEFAULT 'direct_substitution',
    difficulty_level TEXT NOT NULL DEFAULT 'easy',
    difficulty_number SMALLINT NOT NULL DEFAULT 1,
    
    stem_template TEXT NOT NULL,
    unknown_variable TEXT,
    supported_unknowns TEXT[] DEFAULT ARRAY[]::TEXT[],
    variables JSONB DEFAULT '[]'::jsonb,
    formula_name TEXT,
    formula_latex TEXT,
    
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer TEXT,
    explanation TEXT,
    status TEXT DEFAULT 'stub',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.latest_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latest_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latest_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latest_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latest_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latest_concept_templates ENABLE ROW LEVEL SECURITY;

-- Read/Write Policies
CREATE POLICY "Public read latest_exams" ON public.latest_exams FOR SELECT USING (TRUE);
CREATE POLICY "Public read latest_subjects" ON public.latest_subjects FOR SELECT USING (TRUE);
CREATE POLICY "Public read latest_chapters" ON public.latest_chapters FOR SELECT USING (TRUE);
CREATE POLICY "Public read latest_topics" ON public.latest_topics FOR SELECT USING (TRUE);
CREATE POLICY "Public read latest_concepts" ON public.latest_concepts FOR SELECT USING (TRUE);
CREATE POLICY "Public read latest_concept_templates" ON public.latest_concept_templates FOR SELECT USING (TRUE);

CREATE POLICY "Admins write latest_exams" ON public.latest_exams FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write latest_subjects" ON public.latest_subjects FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write latest_chapters" ON public.latest_chapters FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write latest_topics" ON public.latest_topics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write latest_concepts" ON public.latest_concepts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write latest_concept_templates" ON public.latest_concept_templates FOR ALL TO authenticated USING (TRUE);
