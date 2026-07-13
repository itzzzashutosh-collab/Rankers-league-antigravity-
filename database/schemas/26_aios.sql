-- ============================================================
-- Ranker's League: AI Operating System (AIOS) Foundational Schema
-- Schema 26: Unified Agent Orchestration & Runtime Ledger
-- ============================================================

-- 1. AI Departments
CREATE TABLE IF NOT EXISTS public.ai_departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    budget_limit_usd NUMERIC(12, 4) DEFAULT 100.0000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AI Roles
CREATE TABLE IF NOT EXISTS public.ai_roles (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- 3. AI Capabilities
CREATE TABLE IF NOT EXISTS public.ai_capabilities (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT
);

-- 4. Dynamic Registered Agents
CREATE TABLE IF NOT EXISTS public.ai_agents (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    department_id VARCHAR(50) REFERENCES public.ai_departments(id) ON DELETE SET NULL,
    role_id VARCHAR(50) REFERENCES public.ai_roles(id) ON DELETE SET NULL,
    model_name VARCHAR(100) NOT NULL,
    capabilities VARCHAR(80)[] DEFAULT '{}'::VARCHAR[],
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(40) DEFAULT 'Online' CHECK (status IN ('Online', 'Offline', 'Busy', 'Sleeping', 'Maintenance', 'Error')),
    health_score INT DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
    owner_id UUID,
    version VARCHAR(40) DEFAULT '1.0.0',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Task Manager
CREATE TABLE IF NOT EXISTS public.ai_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    status VARCHAR(40) DEFAULT 'Queue' CHECK (status IN ('Queue', 'Planner', 'Execution', 'Review', 'Approval', 'Completed', 'Failed')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    payload JSONB DEFAULT '{}'::jsonb,
    result JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI Task History Review Ledger
CREATE TABLE IF NOT EXISTS public.ai_task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.ai_tasks(id) ON DELETE CASCADE,
    agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI Workflows
CREATE TABLE IF NOT EXISTS public.ai_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI Workflow step nodes
CREATE TABLE IF NOT EXISTS public.ai_workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.ai_workflows(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    step_type VARCHAR(40) NOT NULL CHECK (step_type IN ('Agent', 'Wait', 'Condition')),
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AI Events Queue Bus
CREATE TABLE IF NOT EXISTS public.ai_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AI Communication logs
CREATE TABLE IF NOT EXISTS public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    receiver_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    message_type VARCHAR(40) DEFAULT 'Direct' CHECK (message_type IN ('Direct', 'Broadcast', 'Department', 'Executive')),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AI Short and Long term Memory
CREATE TABLE IF NOT EXISTS public.ai_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    memory_type VARCHAR(40) NOT NULL CHECK (memory_type IN ('Short-term', 'Long-term', 'Semantic')),
    memory_key TEXT NOT NULL,
    memory_value TEXT NOT NULL,
    embedding VECTOR(1536), -- Vector memory configuration stub
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AI Prompt version library
CREATE TABLE IF NOT EXISTS public.ai_prompt_registry (
    id VARCHAR(80) PRIMARY KEY,
    version INT NOT NULL DEFAULT 1,
    prompt_template TEXT NOT NULL,
    expected_output TEXT,
    validation_rules JSONB DEFAULT '{}'::jsonb,
    approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. AI Knowledge Repositories
CREATE TABLE IF NOT EXISTS public.ai_knowledge_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    category VARCHAR(60) NOT NULL, -- Business, Platform, Support, Legal
    source_url TEXT,
    document_hash VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. AI Registered integrations tools
CREATE TABLE IF NOT EXISTS public.ai_tool_registry (
    id VARCHAR(80) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tool_type VARCHAR(60) NOT NULL, -- 'Supabase', 'Discord', 'Filesystem', 'Email'
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. AI Operating Systems execution audit log
CREATE TABLE IF NOT EXISTS public.ai_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    agent_id VARCHAR(80),
    action VARCHAR(200) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Cost tracking details
CREATE TABLE IF NOT EXISTS public.ai_cost_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    token_usage_input INT DEFAULT 0,
    token_usage_output INT DEFAULT 0,
    calculated_cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_cost_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full departments" ON public.ai_departments FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full roles" ON public.ai_roles FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full capabilities" ON public.ai_capabilities FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full agents" ON public.ai_agents FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full tasks" ON public.ai_tasks FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full task_history" ON public.ai_task_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full workflows" ON public.ai_workflows FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full steps" ON public.ai_workflow_steps FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full events" ON public.ai_events FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full messages" ON public.ai_messages FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full memory" ON public.ai_memory FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full prompts" ON public.ai_prompt_registry FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full knowledge" ON public.ai_knowledge_sources FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full tools" ON public.ai_tool_registry FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full audit" ON public.ai_audit_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins full costs" ON public.ai_cost_tracking FOR ALL TO authenticated USING (TRUE);

-- Seeds Departments
INSERT INTO public.ai_departments (id, name, description) VALUES
    ('DEP_EXEC', 'Executive Office', 'Task allocation, operational planner and CEOs orchestration.'),
    ('DEP_MKT', 'Marketing Team', 'SEO compose, contest announcements, platform upgrades outreach.'),
    ('DEP_FIN', 'Financial Desk', 'Auditing wallet ledgers, payouts review automation triggers.')
ON CONFLICT (id) DO NOTHING;

-- Seeds Roles
INSERT INTO public.ai_roles (id, name, description) VALUES
    ('ROLE_CEO', 'CEO Chief', 'Executive department planner.'),
    ('ROLE_SPEC', 'Specialist Manager', 'Supervises workflow steps execution.'),
    ('ROLE_WRK', 'General Worker', 'Task executor.')
ON CONFLICT (id) DO NOTHING;

-- Seeds Capabilities
INSERT INTO public.ai_capabilities (id, name, description) VALUES
    ('TEXT_COMPOSITION', 'Dynamic text creation', 'Can compose custom emails or marketing copy.'),
    ('FINANCE_AUDIT', 'Audit ledger items', 'Can review transactions for anomalies matching limits.')
ON CONFLICT (id) DO NOTHING;

-- Seeds Tools
INSERT INTO public.ai_tool_registry (id, name, tool_type) VALUES
    ('supabase_client', 'Supabase Database Access', 'Supabase'),
    ('discord_webhook', 'Discord Notification Broadcaster', 'Discord'),
    ('fs_utility', 'System Filesystem read/write', 'Filesystem')
ON CONFLICT (id) DO NOTHING;

-- Seeds Prompts
INSERT INTO public.ai_prompt_registry (id, version, prompt_template, expected_output) VALUES
    ('CEO_PLANNER_PROMPT', 1, 'Analyze the active platform event: {{event}}. Suggest 3 core next steps.', 'JSON list format of next steps.'),
    ('MKT_ANNOUNCEMENT_PROMPT', 1, 'Compose a weekly email promo for contest: {{contest_title}} with entry fee {{fee}}.', 'Text email copy.')
ON CONFLICT (id) DO NOTHING;

-- Seeds dynamic default agents (stubs)
INSERT INTO public.ai_agents (id, name, department_id, role_id, model_name, status, health_score) VALUES
    ('AGENT_CEO', 'Chief AI Executive', 'DEP_EXEC', 'ROLE_CEO', 'gpt-4o', 'Online', 98),
    ('AGENT_MKT', 'Campaign Marketing Manager', 'DEP_MKT', 'ROLE_SPEC', 'claude-3-5-sonnet', 'Online', 95)
ON CONFLICT (id) DO NOTHING;
