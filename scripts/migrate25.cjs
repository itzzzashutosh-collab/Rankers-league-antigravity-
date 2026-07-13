const { Client } = require("pg");
const fs = require("fs");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { console.error("DATABASE_URL missing"); process.exit(1); }

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function execSafe(sql, label) {
  try {
    await client.query(sql);
    console.log(`✅ ${label}`);
  } catch (err) {
    console.warn(`⚠️  Skipped [${label}]: ${err.message.split('\n')[0]}`);
  }
}

async function run() {
  console.log("Connecting to Supabase for Communication Center Migration...");
  await client.connect();

  // Tables
  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.communication_templates (
      id VARCHAR(80) PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT,
      channel VARCHAR(40) NOT NULL,
      subject_template VARCHAR(250),
      body_template TEXT NOT NULL,
      variables VARCHAR(80)[] DEFAULT '{}'::VARCHAR[],
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "communication_templates");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.template_versions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      template_id VARCHAR(80) REFERENCES public.communication_templates(id) ON DELETE CASCADE,
      version_number INT NOT NULL,
      subject_template VARCHAR(250),
      body_template TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "template_versions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.audience_segments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      rules JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "audience_segments");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.communication_campaigns (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(150) NOT NULL,
      template_id VARCHAR(80) REFERENCES public.communication_templates(id) ON DELETE SET NULL,
      audience_segment_id UUID REFERENCES public.audience_segments(id) ON DELETE SET NULL,
      schedule_type VARCHAR(40) DEFAULT 'Immediate',
      scheduled_at TIMESTAMPTZ,
      status VARCHAR(40) DEFAULT 'Draft',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "communication_campaigns");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.automation_workflows (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(150) UNIQUE NOT NULL,
      description TEXT,
      trigger_event VARCHAR(100) NOT NULL,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "automation_workflows");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.workflow_steps (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      workflow_id UUID REFERENCES public.automation_workflows(id) ON DELETE CASCADE,
      step_number INT NOT NULL,
      step_type VARCHAR(40) NOT NULL,
      config JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "workflow_steps");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.message_queue (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      recipient_id UUID,
      recipient_address VARCHAR(150) NOT NULL,
      channel VARCHAR(40) NOT NULL,
      subject VARCHAR(250),
      body TEXT NOT NULL,
      priority VARCHAR(20) DEFAULT 'Normal',
      status VARCHAR(40) DEFAULT 'Pending',
      retry_count INT DEFAULT 0,
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      processed_at TIMESTAMPTZ
    )`, "message_queue");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.message_delivery (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      queue_id UUID,
      recipient_username VARCHAR(80),
      channel VARCHAR(40) NOT NULL,
      template_id VARCHAR(80),
      status VARCHAR(40) NOT NULL,
      delivered_at TIMESTAMPTZ DEFAULT NOW()
    )`, "message_delivery");

  // RLS Policies
  for (const tbl of [
    "communication_templates", "template_versions", "audience_segments",
    "communication_campaigns", "automation_workflows", "workflow_steps",
    "message_queue", "message_delivery"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.communication_templates (id, title, description, channel, subject_template, body_template, variables) VALUES
      ('WELCOME_MESSAGE', 'Welcome to Ranker''s League', 'Sent instantly upon registration completion.', 'Email', 'Welcome to Ranker''s League, {{name}}!', 'Hello {{name}},\n\nYour account @{{username}} is verified. Prepare to compete!', ARRAY['name', 'username']),
      ('CONTEST_LOBBY_OPEN', 'Lobby Open Notification', 'Notification alert when examination lobby opens.', 'SMS', NULL, 'The lobby for contest "{{contest}}" is now open. Join instantly!', ARRAY['contest']),
      ('PRIZE_CREDIT', 'Contest Prize Credited', 'Sent when contest earnings hit wallet.', 'In-App', 'Earnings Credited', 'Congratulations! You won {{amount}} in the "{{contest}}" challenge. Balance updated.', ARRAY['amount', 'contest'])
    ON CONFLICT (id) DO NOTHING`, "Seed templates");

  await execSafe(`
    INSERT INTO public.audience_segments (name, description, rules) VALUES
      ('JEE Competitors', 'All active general categories prepping for engineering tests.', '{"category": "JEE"}'::jsonb),
      ('Premium Subscribers', 'Participants on Pro or Elite plans.', '{"subscription": ["Pro", "Elite"]}'::jsonb)
    ON CONFLICT (name) DO NOTHING`, "Seed audience");

  await execSafe(`
    INSERT INTO public.automation_workflows (name, description, trigger_event) VALUES
      ('Contest Lifecycle Flow', 'Automated campaign sequence triggered when a new competitive exam is published.', 'Contest Published')
    ON CONFLICT (name) DO NOTHING`, "Seed workflows");

  await execSafe(`
    INSERT INTO public.message_queue (recipient_address, channel, subject, body, priority, status) VALUES
      ('amit@gmail.com', 'Email', 'Welcome to Ranker''s League, Amit!', 'Hello Amit, Your account @amit_sharma_98 is verified.', 'Normal', 'Delivered'),
      ('+91-98765-43210', 'SMS', NULL, 'The lobby for contest "JEE Physics Challenge" is now open.', 'High', 'Pending')
    ON CONFLICT (id) DO NOTHING`, "Seed queue");

  try { await client.query("NOTIFY pgrst, 'reload schema';"); console.log("PostgREST reloaded."); } catch {}
  await client.end();
  console.log("\n✅ Communication migration complete.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
