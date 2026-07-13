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
  console.log("Connecting to Supabase for Platform Control Center Migration...");
  await client.connect();

  // Tables
  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.system_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      platform_name VARCHAR(150) DEFAULT 'Rankers League',
      platform_description TEXT,
      support_email VARCHAR(200) DEFAULT 'support@rankersleague.com',
      support_phone VARCHAR(40),
      default_language VARCHAR(50) DEFAULT 'English',
      timezone VARCHAR(80) DEFAULT 'Asia/Kolkata',
      currency VARCHAR(10) DEFAULT 'INR',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "system_settings");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.feature_flags (
      id VARCHAR(80) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      description TEXT,
      enabled BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "feature_flags");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.platform_configuration (
      id VARCHAR(80) PRIMARY KEY,
      config_value TEXT NOT NULL,
      description TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "platform_configuration");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) UNIQUE NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "roles");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.permissions (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      description TEXT
    )`, "permissions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.role_permissions (
      role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
      permission_id VARCHAR(100) REFERENCES public.permissions(id) ON DELETE CASCADE,
      PRIMARY KEY (role_id, permission_id)
    )`, "role_permissions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.admin_sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      admin_id UUID,
      ip_address VARCHAR(50),
      browser VARCHAR(100),
      os VARCHAR(100),
      last_activity TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "admin_sessions");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.security_alerts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      alert_type VARCHAR(100) NOT NULL,
      severity VARCHAR(20) DEFAULT 'Low',
      details JSONB DEFAULT '{}'::jsonb,
      ip_address VARCHAR(50),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "security_alerts");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.system_logs (
      id BIGSERIAL PRIMARY KEY,
      log_level VARCHAR(20) NOT NULL,
      category VARCHAR(60) NOT NULL,
      message TEXT NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "system_logs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.background_jobs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      job_name VARCHAR(150) NOT NULL,
      status VARCHAR(40) DEFAULT 'Pending',
      cron_expression VARCHAR(60),
      last_run TIMESTAMPTZ,
      next_run TIMESTAMPTZ,
      error_message TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "background_jobs");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.backup_history (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      backup_name VARCHAR(150) NOT NULL,
      backup_size_bytes BIGINT NOT NULL,
      status VARCHAR(40) DEFAULT 'Completed',
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "backup_history");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.maintenance_settings (
      id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
      enabled BOOLEAN DEFAULT FALSE,
      whitelist_ips VARCHAR(50)[] DEFAULT '{}'::VARCHAR[],
      banner_message TEXT,
      estimated_completion TIMESTAMPTZ,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`, "maintenance_settings");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.api_keys (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      masked_key VARCHAR(100) NOT NULL,
      role VARCHAR(50) DEFAULT 'read-only',
      expires_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "api_keys");

  await execSafe(`
    CREATE TABLE IF NOT EXISTS public.system_config_audit_logs (
      id BIGSERIAL PRIMARY KEY,
      changed_by UUID,
      action VARCHAR(150) NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`, "system_config_audit_logs");

  // RLS Policies
  for (const tbl of [
    "system_settings", "feature_flags", "platform_configuration", "roles",
    "permissions", "role_permissions", "admin_sessions", "security_alerts",
    "system_logs", "background_jobs", "backup_history", "maintenance_settings",
    "api_keys", "system_config_audit_logs"
  ]) {
    await execSafe(`ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY`, `RLS ${tbl}`);
    await execSafe(`CREATE POLICY "Admins access ${tbl}" ON public.${tbl} FOR ALL TO authenticated USING (TRUE)`, `Policy ${tbl}`);
  }

  // Seeds
  await execSafe(`
    INSERT INTO public.system_settings (id, platform_name, platform_description) VALUES
      ('default', 'Rankers League Platform Control Center', 'Unified operating center for Ranker''s League brand operations.')
    ON CONFLICT (id) DO NOTHING`, "Seed settings");

  await execSafe(`
    INSERT INTO public.maintenance_settings (id, enabled, banner_message) VALUES
      ('default', FALSE, 'Platform undergoing scheduled database updates.')
    ON CONFLICT (id) DO NOTHING`, "Seed maintenance");

  await execSafe(`
    INSERT INTO public.permissions (id, name, description) VALUES
      ('Contest.Create', 'Create contests', 'Allows creating new contest items'),
      ('Contest.Publish', 'Publish contests', 'Allows live publishing of approved contests'),
      ('Question.Approve', 'Approve questions', 'Allows editors to approve questions for examination assembly'),
      ('Wallet.Edit', 'Admin wallet modifications', 'Allows manually adjusting balances'),
      ('System.Restart', 'Perform system restarts', 'Allows resetting database locks and server configurations')
    ON CONFLICT (id) DO NOTHING`, "Seed permissions");

  await execSafe(`
    INSERT INTO public.roles (name, description) VALUES
      ('Super Admin', 'Platform owner with complete administrative access.'),
      ('Contest Manager', 'Can build, configure, and publish contest timelines.'),
      ('Moderator', 'Access to support requests and logs monitoring.')
    ON CONFLICT (name) DO NOTHING`, "Seed roles");

  await execSafe(`
    INSERT INTO public.feature_flags (id, name, description, enabled) VALUES
      ('AI_GENERATION', 'Intelligent blueprint question generator', 'AI paper composition suggestions', FALSE),
      ('FAST_WITHDRAWALS', 'Instant UPI payout processing', 'Automated trigger for values below threshold limit', TRUE)
    ON CONFLICT (id) DO NOTHING`, "Seed feature_flags");

  await execSafe(`
    INSERT INTO public.platform_configuration (id, config_value, description) VALUES
      ('MIN_WITHDRAWAL', '500', 'Minimum allowed withdrawal request in INR'),
      ('PLATFORM_FEE_DEFAULT', '18', 'Default contest platforms commission fee percentage'),
      ('LEADERBOARD_REFRESH_RATE', '60', 'Sync rates for live rank dashboards in seconds')
    ON CONFLICT (id) DO NOTHING`, "Seed configuration");

  await execSafe(`
    INSERT INTO public.background_jobs (job_name, status, cron_expression, next_run) VALUES
      ('Evaluation Sync Task', 'Completed', '*/5 * * * *', NOW() + INTERVAL '5 minutes'),
      ('Wallet Ledger Checkpoint', 'Completed', '0 0 * * *', NOW() + INTERVAL '1 day'),
      ('Expired Session Purge', 'Completed', '0 * * * *', NOW() + INTERVAL '1 hour')
    ON CONFLICT (job_name) DO NOTHING`, "Seed background_jobs");

  try { await client.query("NOTIFY pgrst, 'reload schema';"); console.log("PostgREST reloaded."); } catch {}
  await client.end();
  console.log("\n✅ Platform Control Center migration complete.");
}

run().catch(err => { console.error("Fatal:", err); process.exit(1); });
