-- ============================================================
-- Ranker's League: Enterprise Communication & Automation Center
-- Schema 25: Complete Communication & Event Infrastructure
-- ============================================================

-- 1. Communication Templates
CREATE TABLE IF NOT EXISTS public.communication_templates (
    id VARCHAR(80) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    channel VARCHAR(40) NOT NULL CHECK (channel IN ('Email', 'SMS', 'WhatsApp', 'In-App')),
    subject_template VARCHAR(250),
    body_template TEXT NOT NULL,
    variables VARCHAR(80)[] DEFAULT '{}'::VARCHAR[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Template Versions (Immutable archive)
CREATE TABLE IF NOT EXISTS public.template_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id VARCHAR(80) REFERENCES public.communication_templates(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    subject_template VARCHAR(250),
    body_template TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Audience Segments (Dynamic target groups)
CREATE TABLE IF NOT EXISTS public.audience_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    rules JSONB DEFAULT '{}'::jsonb, -- filter expressions, category prep, tiers, subscribers
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Communication Campaigns
CREATE TABLE IF NOT EXISTS public.communication_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    template_id VARCHAR(80) REFERENCES public.communication_templates(id) ON DELETE SET NULL,
    audience_segment_id UUID REFERENCES public.audience_segments(id) ON DELETE SET NULL,
    schedule_type VARCHAR(40) DEFAULT 'Immediate' CHECK (schedule_type IN ('Immediate', 'Scheduled', 'Recurring')),
    scheduled_at TIMESTAMPTZ,
    status VARCHAR(40) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Scheduled', 'Sending', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Automation Workflows
CREATE TABLE IF NOT EXISTS public.automation_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    trigger_event VARCHAR(100) NOT NULL, -- e.g. 'Participant Registered', 'Contest Joined'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Workflow individual step nodes
CREATE TABLE IF NOT EXISTS public.workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES public.automation_workflows(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    step_type VARCHAR(40) NOT NULL CHECK (step_type IN ('Send Message', 'Wait', 'Branch')),
    config JSONB DEFAULT '{}'::jsonb, -- template_id, duration_minutes, conditional flags
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Real-time message queue
CREATE TABLE IF NOT EXISTS public.message_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID,
    recipient_address VARCHAR(150) NOT NULL, -- email, phone
    channel VARCHAR(40) NOT NULL,
    subject VARCHAR(250),
    body TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Low', 'Normal', 'High', 'Critical')),
    status VARCHAR(40) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Delivered', 'Failed', 'Cancelled')),
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 8. Message delivery logs (Immutable history logs)
CREATE TABLE IF NOT EXISTS public.message_delivery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID,
    recipient_username VARCHAR(80),
    channel VARCHAR(40) NOT NULL,
    template_id VARCHAR(80),
    status VARCHAR(40) NOT NULL,
    delivered_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_delivery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read templates" ON public.communication_templates FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read template versions" ON public.template_versions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins read audience" ON public.audience_segments FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins campaigns" ON public.communication_campaigns FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins workflows" ON public.automation_workflows FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins workflow steps" ON public.workflow_steps FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins msg queue" ON public.message_queue FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins delivery history" ON public.message_delivery FOR ALL TO authenticated USING (TRUE);

-- Seed standard notification templates
INSERT INTO public.communication_templates (id, title, description, channel, subject_template, body_template, variables) VALUES
    ('WELCOME_MESSAGE', 'Welcome to Ranker''s League', 'Sent instantly upon registration completion.', 'Email', 'Welcome to Ranker''s League, {{name}}!', 'Hello {{name}},\n\nYour account @{{username}} is verified. Prepare to compete!', ARRAY['name', 'username']),
    ('CONTEST_LOBBY_OPEN', 'Lobby Open Notification', 'Notification alert when examination lobby opens.', 'SMS', NULL, 'The lobby for contest "{{contest}}" is now open. Join instantly!', ARRAY['contest']),
    ('PRIZE_CREDIT', 'Contest Prize Credited', 'Sent when contest earnings hit wallet.', 'In-App', 'Earnings Credited', 'Congratulations! You won {{amount}} in the "{{contest}}" challenge. Balance updated.', ARRAY['amount', 'contest'])
ON CONFLICT (id) DO NOTHING;

-- Seed Audience Segments
INSERT INTO public.audience_segments (name, description, rules) VALUES
    ('JEE Competitors', 'All active general categories prepping for engineering tests.', '{"category": "JEE"}'::jsonb),
    ('Premium Subscribers', 'Participants on Pro or Elite plans.', '{"subscription": ["Pro", "Elite"]}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Seed Automation Workflows
INSERT INTO public.automation_workflows (name, description, trigger_event) VALUES
    ('Contest Lifecycle Flow', 'Automated campaign sequence triggered when a new competitive exam is published.', 'Contest Published')
ON CONFLICT (name) DO NOTHING;

-- Seed Message Queue
INSERT INTO public.message_queue (recipient_address, channel, subject, body, priority, status) VALUES
    ('amit@gmail.com', 'Email', 'Welcome to Ranker''s League, Amit!', 'Hello Amit, Your account @amit_sharma_98 is verified.', 'Normal', 'Delivered'),
    ('+91-98765-43210', 'SMS', NULL, 'The lobby for contest "JEE Physics Challenge" is now open.', 'High', 'Pending')
ON CONFLICT (id) DO NOTHING;
