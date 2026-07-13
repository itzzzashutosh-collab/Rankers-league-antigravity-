-- ============================================================
-- Migration 37: Concept Template Bank
-- Phase 1 of Rankers League Question Generation System
-- ============================================================

-- 1. EXAMS TABLE
CREATE TABLE IF NOT EXISTS public.rl_exams (
    exam_id TEXT PRIMARY KEY,
    exam_name TEXT NOT NULL UNIQUE,
    full_form TEXT,
    description TEXT,
    nationality TEXT DEFAULT 'Indian',
    exam_mode TEXT DEFAULT 'Online',
    exam_category TEXT,
    official_website TEXT,
    subjects TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.rl_subjects (
    subject_id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES public.rl_exams(exam_id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_count INT DEFAULT 0,
    chapters_list TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_exam_subject UNIQUE (exam_id, subject_name)
);

-- 3. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.rl_chapters (
    chapter_id TEXT PRIMARY KEY,
    exam_id TEXT REFERENCES public.rl_exams(exam_id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.rl_subjects(subject_id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_count INT DEFAULT 0,
    topics_list TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.rl_topics (
    topic_id TEXT PRIMARY KEY,
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    topic_description TEXT,
    concept_count INT DEFAULT 0,
    concepts_list TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- 5. CONCEPTS TABLE (master — sourced from basic_concepts_rows.csv)
CREATE TABLE IF NOT EXISTS public.rl_concepts (
    concept_id TEXT PRIMARY KEY,
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    concept_description TEXT,
    concept_formula TEXT,           -- LaTeX formula string
    concept_difficulty TEXT DEFAULT 'Medium' CHECK (concept_difficulty IN ('Easy', 'Medium', 'Hard')),
    concept_mergable BOOLEAN DEFAULT FALSE,
    mergable_with TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_mixable BOOLEAN DEFAULT FALSE,
    mixed_with TEXT[] DEFAULT ARRAY[]::TEXT[],
    mixed_with_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    exam_weightage_percent NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. FORMULA METADATA TABLE
CREATE TABLE IF NOT EXISTS public.rl_formula_metadata (
    formula_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    concept_id TEXT REFERENCES public.rl_concepts(concept_id) ON DELETE CASCADE,
    formula_name TEXT NOT NULL,
    formula_latex TEXT NOT NULL,          -- e.g. "v = u + at"
    variables JSONB DEFAULT '[]'::jsonb,  -- [{symbol, meaning, unit, range, latex}]
    rearrangements TEXT[] DEFAULT ARRAY[]::TEXT[],  -- LaTeX rearrangements
    preconditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    assumptions TEXT[] DEFAULT ARRAY[]::TEXT[],
    related_formulas TEXT[] DEFAULT ARRAY[]::TEXT[],
    units_system TEXT DEFAULT 'SI',
    common_mistakes TEXT[] DEFAULT ARRAY[]::TEXT[],
    shortcut_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONCEPT TEMPLATE BANK (master table — the core of Phase 1)
CREATE TABLE IF NOT EXISTS public.rl_concept_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source traceability
    concept_id TEXT REFERENCES public.rl_concepts(concept_id) ON DELETE CASCADE,
    original_template_id TEXT,   -- from CSV concept_template_id if migrated
    
    -- Hierarchy
    exam_name TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    concept_name TEXT NOT NULL,
    
    -- Template Identity
    template_name TEXT,
    template_type TEXT DEFAULT 'direct_substitution' CHECK (
        template_type IN (
            'direct_substitution',
            'formula_rearrangement',
            'logical_trap',
            'multi_concept',
            'reverse_thinking',
            'data_table',
            'graph_based',
            'assertion_reason',
            'match_the_column',
            'hyper_local_daily_life'
        )
    ),
    
    -- Difficulty (5-level system)
    difficulty_level TEXT NOT NULL DEFAULT 'easy' CHECK (
        difficulty_level IN ('easy', 'medium', 'hard', 'pro', 'legend')
    ),
    difficulty_number SMALLINT NOT NULL DEFAULT 1 CHECK (difficulty_number BETWEEN 1 AND 5),
    
    -- Template Blueprint (parameterized — no hardcoded values)
    stem_template TEXT NOT NULL,            -- "A {object} accelerates at {a} m/s² for {t} s..."
    unknown_variable TEXT,                   -- Which variable is asked e.g. "{v}"
    supported_unknowns TEXT[] DEFAULT ARRAY[]::TEXT[], -- All vars that can be unknown
    
    -- Variables (JSONB array)
    variables JSONB DEFAULT '[]'::jsonb,
    -- e.g. [{"symbol":"m","meaning":"Mass","unit":"kg","range":"1-100","latex":"m"}]
    
    -- Formula (LaTeX)
    formula_name TEXT,
    formula_latex TEXT,
    formula_rearrangements TEXT[] DEFAULT ARRAY[]::TEXT[],
    formula_preconditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Solution Blueprint
    solution_approach TEXT,
    solution_steps_template TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Pedagogical Metadata
    cognitive_level TEXT DEFAULT 'application' CHECK (
        cognitive_level IN ('knowledge','comprehension','application','analysis','synthesis','evaluation')
    ),
    skills_tested TEXT[] DEFAULT ARRAY[]::TEXT[],
    prerequisites TEXT[] DEFAULT ARRAY[]::TEXT[],
    common_mistakes TEXT[] DEFAULT ARRAY[]::TEXT[],
    logical_traps TEXT[] DEFAULT ARRAY[]::TEXT[],
    conditional_traps TEXT[] DEFAULT ARRAY[]::TEXT[],
    distractor_logic TEXT,
    
    -- Exam Metadata
    exam_weightage_hint TEXT,
    estimated_frequency TEXT DEFAULT 'appears_every_year' CHECK (
        estimated_frequency IN ('appears_every_year','alternate_years','rare','very_rare')
    ),
    context_tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    question_variants TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Generation Rules (JSONB)
    generation_rules JSONB DEFAULT '{}'::jsonb,
    -- e.g. {"min":{"a":1},"max":{"a":20},"integer_only":false,"decimal_places":2}
    
    -- Supported Variations
    supported_variations TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Legacy MCQ fields (from original concept_templates_rows.csv)
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_answer TEXT,
    explanation TEXT,
    
    -- Status
    status TEXT DEFAULT 'stub' CHECK (
        status IN ('stub','draft','reviewed','approved','deprecated')
    ),
    source_exam_pattern TEXT,
    version INT DEFAULT 1,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEMPLATE VARIATIONS TABLE
CREATE TABLE IF NOT EXISTS public.rl_template_variations (
    variation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES public.rl_concept_templates(template_id) ON DELETE CASCADE,
    variation_type TEXT NOT NULL CHECK (
        variation_type IN (
            'variable_replacement',
            'formula_rearrangement',
            'different_unknown',
            'unit_change',
            'context_change',
            'wording_variation',
            'data_table_format',
            'graph_format',
            'multi_part',
            'diagram_variation',
            'real_world_scenario',
            'numerical_change',
            'constraint_change'
        )
    ),
    variation_description TEXT,
    example_stem TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COVERAGE STATS VIEW (materialized for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.rl_template_coverage AS
SELECT
    c.exam_name,
    c.subject_name,
    c.chapter_name,
    COUNT(DISTINCT c.concept_id) AS total_concepts,
    COUNT(DISTINCT t.concept_id) AS concepts_with_templates,
    COUNT(t.template_id) AS total_templates,
    COUNT(t.template_id) FILTER (WHERE t.difficulty_level = 'easy') AS easy_count,
    COUNT(t.template_id) FILTER (WHERE t.difficulty_level = 'medium') AS medium_count,
    COUNT(t.template_id) FILTER (WHERE t.difficulty_level = 'hard') AS hard_count,
    COUNT(t.template_id) FILTER (WHERE t.difficulty_level = 'pro') AS pro_count,
    COUNT(t.template_id) FILTER (WHERE t.difficulty_level = 'legend') AS legend_count,
    COUNT(t.template_id) FILTER (WHERE t.status = 'approved') AS approved_count,
    COUNT(t.template_id) FILTER (WHERE t.status = 'stub') AS stub_count,
    ROUND(
        COUNT(DISTINCT t.concept_id)::numeric / NULLIF(COUNT(DISTINCT c.concept_id), 0) * 100,
        2
    ) AS coverage_percent
FROM public.rl_concepts c
LEFT JOIN public.rl_concept_templates t ON c.concept_id = t.concept_id
GROUP BY c.exam_name, c.subject_name, c.chapter_name;

-- 10. AUTO-UPDATE updated_at TRIGGER
CREATE OR REPLACE FUNCTION public.update_template_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_template_timestamp
    BEFORE UPDATE ON public.rl_concept_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_template_updated_at();

-- 11. INDEXES for performance
CREATE INDEX IF NOT EXISTS idx_rl_templates_concept_id ON public.rl_concept_templates(concept_id);
CREATE INDEX IF NOT EXISTS idx_rl_templates_exam ON public.rl_concept_templates(exam_name);
CREATE INDEX IF NOT EXISTS idx_rl_templates_difficulty ON public.rl_concept_templates(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_rl_templates_status ON public.rl_concept_templates(status);
CREATE INDEX IF NOT EXISTS idx_rl_templates_type ON public.rl_concept_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_rl_concepts_exam ON public.rl_concepts(exam_name);
CREATE INDEX IF NOT EXISTS idx_rl_concepts_chapter ON public.rl_concepts(chapter_name);

-- 12. ROW LEVEL SECURITY
ALTER TABLE public.rl_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_formula_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_concept_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rl_template_variations ENABLE ROW LEVEL SECURITY;

-- Public read access for exam hierarchy
CREATE POLICY "Public read exams" ON public.rl_exams FOR SELECT USING (TRUE);
CREATE POLICY "Public read subjects" ON public.rl_subjects FOR SELECT USING (TRUE);
CREATE POLICY "Public read chapters" ON public.rl_chapters FOR SELECT USING (TRUE);
CREATE POLICY "Public read topics" ON public.rl_topics FOR SELECT USING (TRUE);
CREATE POLICY "Public read concepts" ON public.rl_concepts FOR SELECT USING (TRUE);
CREATE POLICY "Public read formula metadata" ON public.rl_formula_metadata FOR SELECT USING (TRUE);
CREATE POLICY "Public read templates" ON public.rl_concept_templates FOR SELECT USING (TRUE);
CREATE POLICY "Public read variations" ON public.rl_template_variations FOR SELECT USING (TRUE);

-- Authenticated (admin) write access
CREATE POLICY "Admins write exams" ON public.rl_exams FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write subjects" ON public.rl_subjects FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write chapters" ON public.rl_chapters FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write topics" ON public.rl_topics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write concepts" ON public.rl_concepts FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write formula metadata" ON public.rl_formula_metadata FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write templates" ON public.rl_concept_templates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins write variations" ON public.rl_template_variations FOR ALL TO authenticated USING (TRUE);
