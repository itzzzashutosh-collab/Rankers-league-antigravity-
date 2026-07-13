-- ================================================================
-- RLS Policies — 03_rls_auth_policies.sql
-- ================================================================

-- Enable RLS on all auth tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usernames ENABLE ROW LEVEL SECURITY;
ALTER TABLE participant_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE authentication_logs ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- profiles RLS
-- ================================================================
-- Public: anyone can read non-sensitive profile fields (for /profile/[username] page)
CREATE POLICY profiles_public_read ON profiles
  FOR SELECT USING (true);

-- Private: only owner can update their own profile
CREATE POLICY profiles_owner_update ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Private: only owner can insert their profile row (handled by trigger)
CREATE POLICY profiles_owner_insert ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ================================================================
-- usernames RLS
-- ================================================================
-- Anyone can read usernames (for availability checks)
CREATE POLICY usernames_public_read ON usernames
  FOR SELECT USING (true);

-- Only owner can insert/delete their username
CREATE POLICY usernames_owner_insert ON usernames
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY usernames_owner_delete ON usernames
  FOR DELETE USING (auth.uid() = user_id);

-- ================================================================
-- participant_identity RLS
-- ================================================================
-- Public: participant IDs and URLs are public
CREATE POLICY identity_public_read ON participant_identity
  FOR SELECT USING (true);

-- Only owner can insert
CREATE POLICY identity_owner_insert ON participant_identity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- user_preferences RLS
-- ================================================================
-- Only the owner can read/write their preferences
CREATE POLICY prefs_owner_all ON user_preferences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- avatars RLS
-- ================================================================
-- Only owner can manage avatars
CREATE POLICY avatars_owner_all ON avatars
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- user_sessions RLS
-- ================================================================
-- Only owner can view and manage their own sessions
CREATE POLICY sessions_owner_all ON user_sessions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- user_devices RLS
-- ================================================================
-- Only owner can read their own devices
CREATE POLICY devices_owner_read ON user_devices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY devices_owner_insert ON user_devices
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- authentication_logs RLS — Service role only (no user access)
-- ================================================================
-- No RLS policies: only service_role key can insert/read logs
