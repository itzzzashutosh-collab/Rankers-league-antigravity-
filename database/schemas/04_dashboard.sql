-- ================================================================
-- Prompt 12: Personal Dashboard — Database Schema
-- 04_dashboard.sql
-- ================================================================

-- ================================================================
-- 1. contest_enrollments — which users joined which contests
-- ================================================================
CREATE TYPE enrollment_status AS ENUM ('registered', 'live', 'completed', 'cancelled', 'disqualified');

CREATE TABLE contest_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL,
  contest_slug VARCHAR(120),
  contest_name VARCHAR(200) NOT NULL,
  exam_category VARCHAR(50),
  contest_date TIMESTAMP WITH TIME ZONE,
  entry_fee_paid NUMERIC(10, 2) DEFAULT 0,
  status enrollment_status NOT NULL DEFAULT 'registered',
  final_rank INT,
  final_score NUMERIC(6, 2),
  aura_earned INT DEFAULT 0,
  prize_won NUMERIC(10, 2) DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 2. user_statistics — cached performance stats per user
-- ================================================================
CREATE TABLE user_statistics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_contests_joined INT NOT NULL DEFAULT 0,
  total_contests_completed INT NOT NULL DEFAULT 0,
  total_contests_won INT NOT NULL DEFAULT 0,
  best_rank INT,
  average_score NUMERIC(6, 2) DEFAULT 0,
  total_aura_earned INT NOT NULL DEFAULT 0,
  monthly_aura_earned INT NOT NULL DEFAULT 0,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  accuracy_percentage NUMERIC(5, 2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 3. aura_history — every aura credit/debit event
-- ================================================================
CREATE TYPE aura_event_type AS ENUM (
  'contest_join', 'contest_completed', 'rank_1', 'rank_top10', 'rank_top50',
  'first_contest', 'streak_bonus', 'achievement_unlock', 'profile_complete',
  'welcome_bonus', 'correction'
);

CREATE TABLE aura_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type aura_event_type NOT NULL,
  points INT NOT NULL,
  description TEXT NOT NULL,
  contest_id UUID,
  contest_name VARCHAR(200),
  balance_after INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 4. user_achievements — unlocked badges and milestones
-- ================================================================
CREATE TYPE achievement_category AS ENUM (
  'badge', 'rank', 'contest', 'aura', 'streak', 'milestone', 'special'
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key VARCHAR(80) NOT NULL,
  category achievement_category NOT NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(20) DEFAULT '🏆',
  color VARCHAR(30) DEFAULT 'primary',
  rarity VARCHAR(20) DEFAULT 'common',
  aura_reward INT DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, achievement_key)
);

-- ================================================================
-- 5. user_activity — activity timeline events
-- ================================================================
CREATE TYPE activity_event_type AS ENUM (
  'contest_joined', 'contest_completed', 'result_published',
  'aura_earned', 'achievement_unlocked', 'profile_updated',
  'rank_achieved', 'streak_milestone', 'account_created'
);

CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type activity_event_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  icon VARCHAR(20) DEFAULT '📌',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 6. dashboard_preferences — user UI settings
-- ================================================================
CREATE TABLE dashboard_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  sidebar_collapsed BOOLEAN DEFAULT FALSE,
  default_tab VARCHAR(30) DEFAULT 'overview',
  show_aura_hub BOOLEAN DEFAULT TRUE,
  show_activity BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- Indexes
-- ================================================================
CREATE INDEX idx_contest_enrollments_user ON contest_enrollments(user_id);
CREATE INDEX idx_contest_enrollments_status ON contest_enrollments(status);
CREATE INDEX idx_aura_history_user ON aura_history(user_id);
CREATE INDEX idx_aura_history_created ON aura_history(created_at DESC);
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_created ON user_activity(created_at DESC);

-- ================================================================
-- Triggers
-- ================================================================
CREATE OR REPLACE FUNCTION update_enrollment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrollment_updated_at
  BEFORE UPDATE ON contest_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_enrollment_updated_at();

-- Auto-create user_statistics row when profile is created
CREATE OR REPLACE FUNCTION handle_new_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_statistics (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  INSERT INTO dashboard_preferences (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  -- Welcome bonus aura
  INSERT INTO aura_history (user_id, event_type, points, description, balance_after)
  VALUES (NEW.id, 'welcome_bonus', 50, 'Welcome to Ranker''s League! 🎉', 50);
  -- Welcome activity
  INSERT INTO user_activity (user_id, event_type, title, description, icon)
  VALUES (NEW.id, 'account_created', 'Joined Ranker''s League', 'Your competitive journey begins!', '🚀');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_stats
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_stats();
