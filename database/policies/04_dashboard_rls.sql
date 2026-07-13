-- ================================================================
-- Dashboard RLS Policies — 04_dashboard_rls.sql
-- ================================================================

-- contest_enrollments: owner only
ALTER TABLE contest_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY enrollments_owner_all ON contest_enrollments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_statistics: owner read/write, others can read (for leaderboard)
ALTER TABLE user_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY stats_public_read ON user_statistics FOR SELECT USING (true);
CREATE POLICY stats_owner_write ON user_statistics
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY stats_owner_insert ON user_statistics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- aura_history: owner only
ALTER TABLE aura_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY aura_owner_all ON aura_history
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_achievements: owner read/write, others can read count (for profiles)
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY achievements_public_read ON user_achievements FOR SELECT USING (true);
CREATE POLICY achievements_owner_write ON user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- user_activity: owner only
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY activity_owner_all ON user_activity
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- dashboard_preferences: owner only
ALTER TABLE dashboard_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY prefs_owner_all ON dashboard_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
