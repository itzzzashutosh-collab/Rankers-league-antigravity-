-- ============================================================
-- Ranker's League: Task Planner & Agent Blueprints Ledger
-- Schema 27: Skill, Knowledge & Task Execution Engine
-- ============================================================

-- 1. Skill Registry
CREATE TABLE IF NOT EXISTS public.ai_skill_registry (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    purpose TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Skill Versions
CREATE TABLE IF NOT EXISTS public.ai_skill_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_id VARCHAR(80) REFERENCES public.ai_skill_registry(id) ON DELETE CASCADE,
    version VARCHAR(40) NOT NULL,
    rules_md TEXT,
    workflow_md TEXT,
    examples_md TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Knowledge Registry
CREATE TABLE IF NOT EXISTS public.ai_knowledge_registry (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Expanded Knowledge Sources
CREATE TABLE IF NOT EXISTS public.ai_knowledge_registry_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registry_id VARCHAR(80) REFERENCES public.ai_knowledge_registry(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    content_md TEXT,
    version VARCHAR(40) DEFAULT '1.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Task Plans
CREATE TABLE IF NOT EXISTS public.ai_task_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL, -- references public.ai_tasks(id)
    estimated_complexity VARCHAR(40) CHECK (estimated_complexity IN ('Low', 'Medium', 'High', 'Critical')),
    estimated_cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
    estimated_tokens INT DEFAULT 0,
    estimated_time_seconds INT DEFAULT 0,
    recommended_agent_id VARCHAR(80),
    risk_assessment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Execution Graphs
CREATE TABLE IF NOT EXISTS public.ai_execution_graphs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES public.ai_task_plans(id) ON DELETE CASCADE,
    node_id VARCHAR(80) NOT NULL,
    label VARCHAR(150) NOT NULL,
    dependencies VARCHAR(80)[] DEFAULT '{}'::VARCHAR[],
    status VARCHAR(40) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Running', 'Completed', 'Failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Confidence Scores
CREATE TABLE IF NOT EXISTS public.ai_confidence_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    reasoning_score NUMERIC(4, 2) CHECK (reasoning_score BETWEEN 0.00 AND 1.00),
    evidence_score NUMERIC(4, 2) CHECK (evidence_score BETWEEN 0.00 AND 1.00),
    knowledge_score NUMERIC(4, 2) CHECK (knowledge_score BETWEEN 0.00 AND 1.00),
    tools_score NUMERIC(4, 2) CHECK (tools_score BETWEEN 0.00 AND 1.00),
    overall_score NUMERIC(4, 2) CHECK (overall_score BETWEEN 0.00 AND 1.00),
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Agent Templates
CREATE TABLE IF NOT EXISTS public.ai_agent_templates (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    yaml_config TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Model Registry
CREATE TABLE IF NOT EXISTS public.ai_model_registry (
    id VARCHAR(80) PRIMARY KEY,
    provider VARCHAR(60) NOT NULL, -- 'OpenAI', 'Anthropic', 'Gemini'
    model_name VARCHAR(100) UNIQUE NOT NULL,
    temperature_default NUMERIC(3,2) DEFAULT 0.2,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Agent Metrics
CREATE TABLE IF NOT EXISTS public.ai_agent_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(80) NOT NULL,
    tasks_completed INT DEFAULT 0,
    tasks_failed INT DEFAULT 0,
    average_latency_ms INT DEFAULT 0,
    total_cost_usd NUMERIC(12, 6) DEFAULT 0.000000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_skill_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_skill_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_registry_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_task_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_confidence_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agent_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins skills" ON public.ai_skill_registry FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins skill_versions" ON public.ai_skill_versions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins knowledge" ON public.ai_knowledge_registry FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins knowledge_sources" ON public.ai_knowledge_registry_sources FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins task_plans" ON public.ai_task_plans FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins execution_graphs" ON public.ai_execution_graphs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins confidence" ON public.ai_confidence_scores FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins templates" ON public.ai_agent_templates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins models" ON public.ai_model_registry FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins metrics" ON public.ai_agent_metrics FOR ALL TO authenticated USING (TRUE);

-- Seeds Model Registry
INSERT INTO public.ai_model_registry (id, provider, model_name) VALUES
    ('gpt-4o', 'OpenAI', 'gpt-4o'),
    ('claude-3-5-sonnet', 'Anthropic', 'claude-3-5-sonnet'),
    ('gemini-1.5-pro', 'Gemini', 'gemini-1.5-pro')
ON CONFLICT (id) DO NOTHING;

-- Seeds Skills Registry
INSERT INTO public.ai_skill_registry (id, name, purpose) VALUES
    ('planning', 'Task breakdown and sequencing steps.', 'Divide complex tasks into ordered execution steps.'),
    ('reasoning', 'Analyze events logic matching parameters.', 'Formulate logical inferences based on input payloads.'),
    ('review', 'Verify output alignment with prompt rules.', 'Analyze generated response body against constraints.')
ON CONFLICT (id) DO NOTHING;
