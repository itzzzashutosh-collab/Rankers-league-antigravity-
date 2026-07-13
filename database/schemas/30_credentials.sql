-- ============================================================
-- Ranker's League: AI OS Credentials and Key Storage Schema
-- Schema 30: API Vault and Secure Mappings
-- ============================================================

-- 1. AI Provider Credentials Table
CREATE TABLE IF NOT EXISTS public.ai_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(60) NOT NULL CHECK (provider IN ('OpenAI', 'Anthropic', 'Gemini', 'OpenRouter', 'Local')),
    label VARCHAR(150) NOT NULL,
    api_key_masked VARCHAR(100) NOT NULL,
    api_key_encrypted TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.ai_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins credentials" ON public.ai_credentials FOR ALL TO authenticated USING (TRUE);

-- Seed default keys indicators
INSERT INTO public.ai_credentials (provider, label, api_key_masked, is_active) VALUES
    ('OpenAI', 'Production GPT-4o Key', 'sk-proj-...XyZa', true),
    ('Anthropic', 'Marketing Claude Sonnet Key', 'sk-ant-api03-...qWrt', true),
    ('Gemini', 'Developer Pro Keys', 'AIzaSy...7m8n', true)
ON CONFLICT DO NOTHING;
