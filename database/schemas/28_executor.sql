-- ============================================================
-- Ranker's League: Task Executor & Action Logs Ledger
-- Schema 28: Execution Engine, Security, and Tool Audits
-- ============================================================

-- 1. Task Execution Logs
CREATE TABLE IF NOT EXISTS public.ai_task_execution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES public.ai_task_plans(id) ON DELETE SET NULL,
    agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    status VARCHAR(40) DEFAULT 'Running' CHECK (status IN ('Running', 'Completed', 'Failed', 'Cancelled', 'Paused')),
    token_usage_input INT DEFAULT 0,
    token_usage_output INT DEFAULT 0,
    cost_usd NUMERIC(10, 6) DEFAULT 0.000000,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Execution Steps Nodes
CREATE TABLE IF NOT EXISTS public.ai_execution_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES public.ai_task_execution(id) ON DELETE CASCADE,
    step_id VARCHAR(80) NOT NULL,
    label VARCHAR(200) NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Running', 'Completed', 'Failed', 'Cancelled')),
    retry_count INT DEFAULT 0,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 3. Execution Step Results Pointers
CREATE TABLE IF NOT EXISTS public.ai_execution_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
    output_payload JSONB DEFAULT '{}'::jsonb,
    validation_status VARCHAR(40) DEFAULT 'Unverified' CHECK (validation_status IN ('Unverified', 'Passed', 'Failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Stdout/Stderr logs console
CREATE TABLE IF NOT EXISTS public.ai_execution_logs (
    id BIGSERIAL PRIMARY KEY,
    step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
    log_type VARCHAR(20) DEFAULT 'info' CHECK (log_type IN ('info', 'warn', 'error', 'debug')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tool Usage logs
CREATE TABLE IF NOT EXISTS public.ai_tool_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
    tool_id VARCHAR(80) REFERENCES public.ai_tool_registry(id) ON DELETE SET NULL,
    args JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(40) CHECK (status IN ('Success', 'Failed')),
    duration_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Permission check logs
CREATE TABLE IF NOT EXISTS public.ai_permission_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id VARCHAR(80) REFERENCES public.ai_agents(id) ON DELETE SET NULL,
    action VARCHAR(150) NOT NULL,
    allowed BOOLEAN DEFAULT TRUE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Step Metrics details
CREATE TABLE IF NOT EXISTS public.ai_step_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
    duration_ms INT DEFAULT 0,
    memory_usage_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Execution Lifecycle History
CREATE TABLE IF NOT EXISTS public.ai_execution_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES public.ai_task_execution(id) ON DELETE CASCADE,
    lifecycle_event VARCHAR(100) NOT NULL, -- 'Started', 'StepComplete', 'Finished'
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Failure Error Stack Traces
CREATE TABLE IF NOT EXISTS public.ai_execution_failures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    step_id UUID REFERENCES public.ai_execution_steps(id) ON DELETE CASCADE,
    error_code VARCHAR(80) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    rollback_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Execution Events
CREATE TABLE IF NOT EXISTS public.ai_execution_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES public.ai_task_execution(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- 'TaskStarted', 'PermissionDenied', 'TaskFailed'
    payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_task_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_permission_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_step_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_execution_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins execution" ON public.ai_task_execution FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins steps" ON public.ai_execution_steps FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins results" ON public.ai_execution_results FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins logs" ON public.ai_execution_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins tool_usage" ON public.ai_tool_usage FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins permission_checks" ON public.ai_permission_checks FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins step_metrics" ON public.ai_step_metrics FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins history" ON public.ai_execution_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins failures" ON public.ai_execution_failures FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins events" ON public.ai_execution_events FOR ALL TO authenticated USING (TRUE);
