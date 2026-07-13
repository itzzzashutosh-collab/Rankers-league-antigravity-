-- Schema for Notification Center, Communication Hub, Reminders & Announcements
-- 13_notification_system.sql

-- 1. Reference Tables
CREATE TABLE IF NOT EXISTS notification_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS announcement_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO notification_types (id, name) VALUES
('contest_registration', 'Contest Registration'),
('contest_reminder', 'Contest Reminder'),
('contest_starts_soon', 'Contest Starts Soon'),
('contest_started', 'Contest Started'),
('result_published', 'Result Published'),
('leaderboard_updated', 'Leaderboard Updated'),
('prize_credited', 'Prize Credited'),
('withdrawal_update', 'Withdrawal Update'),
('certificate_available', 'Certificate Available'),
('achievement_unlocked', 'Achievement Unlocked'),
('aura_earned', 'Aura Earned'),
('system_announcement', 'System Announcement'),
('platform_update', 'Platform Update'),
('maintenance_notice', 'Maintenance Notice'),
('security_alert', 'Security Alert')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO announcement_categories (id, name) VALUES
('new_categories', 'New Competition Categories'),
('upcoming_features', 'Upcoming Platform Features'),
('maintenance', 'Maintenance Windows'),
('policy_updates', 'Policy Updates'),
('special_events', 'Special Events')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;


-- 2. User Notification Preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  result_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  prize_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  achievement_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  platform_updates BOOLEAN NOT NULL DEFAULT TRUE,
  system_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  push_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Public Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id VARCHAR(50) REFERENCES announcement_categories(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low')),
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Announcement Views Auditing
CREATE TABLE IF NOT EXISTS announcement_views (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, announcement_id)
);


-- 5. User In-App Notifications (Private Inbox)
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type_id VARCHAR(50) REFERENCES notification_types(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('critical', 'high', 'normal', 'low')),
  action_url TEXT,
  action_label VARCHAR(100),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP WITH TIME ZONE
);


-- 6. Templates and Delivery Audits (Subledger channels)
CREATE TABLE IF NOT EXISTS notification_templates (
  id VARCHAR(100) PRIMARY KEY,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS notification_delivery_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES user_notifications(id) ON DELETE SET NULL,
  channel VARCHAR(50) NOT NULL, -- 'in_app', 'email', 'sms', 'push'
  status VARCHAR(50) NOT NULL, -- 'delivered', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 7. Trigger to maintain updated_at on preferences
CREATE OR REPLACE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 8. Auto-create notification preferences on profile creation
CREATE OR REPLACE FUNCTION handle_new_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notification_preferences (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_notification_preferences ON profiles;
CREATE TRIGGER on_profile_created_notification_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_notification_preferences();

-- Backfill preferences for existing profiles
INSERT INTO notification_preferences (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;


-- 9. Security RLS Policies
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Select policies
DROP POLICY IF EXISTS user_all_preferences ON notification_preferences;
CREATE POLICY user_all_preferences ON notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS public_read_announcements ON announcements;
CREATE POLICY public_read_announcements ON announcements
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS user_all_announcement_views ON announcement_views;
CREATE POLICY user_all_announcement_views ON announcement_views
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_all_notifications ON user_notifications;
CREATE POLICY user_all_notifications ON user_notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 10. Database indexing
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_is_read ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_announcements_publish_date ON announcements(publish_date DESC);
