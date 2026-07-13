-- Schema for Achievements, Badges, Certificates, Player Tiers & Aura progress
-- 12_achievements_system.sql

-- 1. Categories
CREATE TABLE IF NOT EXISTS achievement_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS badge_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

INSERT INTO achievement_categories (id, name) VALUES
('competition', 'Competition'),
('ranking', 'Ranking'),
('aura', 'Aura Winnings'),
('participation', 'Participation'),
('consistency', 'Consistency'),
('winning', 'Winning'),
('milestones', 'Milestones'),
('special_events', 'Special Events'),
('seasonal', 'Seasonal')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO badge_categories (id, name) VALUES
('rankings', 'Rank Achievements'),
('participation', 'Engagement & Volume'),
('accuracy', 'Performance Accuracy'),
('streaks', 'Activity Streaks'),
('special', 'Special Badges')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;


-- 2. Core Achievement Definition Catalogue
CREATE TABLE IF NOT EXISTS achievements (
  key VARCHAR(80) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES achievement_categories(id) ON DELETE SET NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(20),
  rarity VARCHAR(20) CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  aura_reward INT DEFAULT 0
);

-- 3. Achievement Progress Sheet
CREATE TABLE IF NOT EXISTS achievement_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key VARCHAR(80) REFERENCES achievements(key) ON DELETE CASCADE,
  current_progress INT NOT NULL DEFAULT 0,
  target_value INT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_key)
);


-- 4. Core Badges Catalogue
CREATE TABLE IF NOT EXISTS badges (
  key VARCHAR(80) PRIMARY KEY,
  category_id VARCHAR(50) REFERENCES badge_categories(id) ON DELETE SET NULL,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  target_value INT NOT NULL,
  icon VARCHAR(20),
  rarity VARCHAR(20) CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  badge_artwork TEXT
);

-- 5. Badge Progress Sheet
CREATE TABLE IF NOT EXISTS badge_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key VARCHAR(80) REFERENCES badges(key) ON DELETE CASCADE,
  current_progress INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_key)
);

-- 6. User Earned Badges Log
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key VARCHAR(80) REFERENCES badges(key) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_key)
);


-- 7. Certificate Configuration & Models
CREATE TABLE IF NOT EXISTS certificate_templates (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  certificate_type VARCHAR(50) CHECK (certificate_type IN ('participation', 'winner', 'top_performer', 'special_recognition', 'national_rank', 'global_rank')),
  template_layout TEXT
);

INSERT INTO certificate_templates (id, title, certificate_type, template_layout) VALUES
('participation_default', 'Participation Certificate', 'participation', 'standard_participation_layout'),
('winner_championship', 'Championship Winner Certificate', 'winner', 'gold_championship_winner_layout'),
('top_performer_elite', 'Elite Performer Certificate', 'top_performer', 'silver_top_performer_layout'),
('national_rank_merit', 'National Merit Certificate', 'national_rank', 'national_merit_layout')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, certificate_type = EXCLUDED.certificate_type;


-- 8. User Certificates Table
CREATE TABLE IF NOT EXISTS user_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID,
  contest_slug VARCHAR(120),
  contest_name VARCHAR(200) NOT NULL,
  exam_category VARCHAR(50),
  participant_name VARCHAR(150) NOT NULL,
  rank INT,
  score NUMERIC(6, 2),
  certificate_type VARCHAR(50) NOT NULL,
  certificate_number VARCHAR(100) UNIQUE NOT NULL,
  verification_id VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Certificate Verification Auditor
CREATE TABLE IF NOT EXISTS certificate_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id UUID NOT NULL REFERENCES user_certificates(id) ON DELETE CASCADE,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  verification_ip INET,
  view_count INT NOT NULL DEFAULT 0
);


-- 10. Aura Levels/Tiers Progress Definition (color VARCHAR(150) to support long tailwind styling names)
CREATE TABLE IF NOT EXISTS aura_levels (
  tier VARCHAR(50) PRIMARY KEY,
  min_aura INT NOT NULL,
  max_aura INT NOT NULL,
  color VARCHAR(150) NOT NULL,
  badge VARCHAR(50) NOT NULL
);

INSERT INTO aura_levels (tier, min_aura, max_aura, color, badge) VALUES
('Explorer', 0, 499, 'text-zinc-400 border-zinc-500/20 bg-zinc-500/5', 'Explorer'),
('Challenger', 500, 999, 'text-sky-400 border-sky-500/20 bg-sky-500/5', 'Challenger'),
('Achiever', 1000, 1999, 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', 'Achiever'),
('Elite', 2000, 3999, 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5', 'Elite'),
('Master', 4000, 6999, 'text-purple-400 border-purple-500/20 bg-purple-500/5', 'Master'),
('Champion', 7000, 11999, 'text-pink-400 border-pink-500/20 bg-pink-500/5', 'Champion'),
('Legend', 12000, 19999, 'text-amber-400 border-amber-500/20 bg-amber-500/5', 'Legend'),
('Grandmaster', 20000, 34999, 'text-rose-400 border-rose-500/20 bg-rose-500/5', 'Grandmaster'),
('Immortal', 35000, 9999999, 'text-red-400 border-red-500/30 bg-red-500/10', 'Immortal')
ON CONFLICT (tier) DO UPDATE SET min_aura = EXCLUDED.min_aura, max_aura = EXCLUDED.max_aura, color = EXCLUDED.color, badge = EXCLUDED.badge;


-- 11. Streaks Audit Table
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_active_date DATE,
  weekly_activity_mask INT DEFAULT 0,
  monthly_activity_mask INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 12. Milestones Definitions
CREATE TABLE IF NOT EXISTS milestones (
  key VARCHAR(80) PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  contest_threshold INT NOT NULL,
  description TEXT NOT NULL,
  aura_bonus INT DEFAULT 0
);

INSERT INTO milestones (key, title, contest_threshold, description, aura_bonus) VALUES
('first_contest', 'First Step', 1, 'Completed your first championship arena contest', 50),
('5_contests', 'Frequent Flyer', 5, 'Completed 5 championship arena contests', 150),
('10_contests', 'Seasoned Contender', 10, 'Completed 10 championship arena contests', 300),
('25_contests', 'Quarter Century', 25, 'Completed 25 championship arena contests', 750),
('50_contests', 'Half Centurion', 50, 'Completed 50 championship arena contests', 1500),
('100_contests', 'Centurion Legend', 100, 'Completed 100 championship arena contests', 3500)
ON CONFLICT (key) DO UPDATE SET title = EXCLUDED.title, contest_threshold = EXCLUDED.contest_threshold;


-- 13. Enable triggers for updated_at across new tables
DROP TRIGGER IF EXISTS update_badge_progress_updated_at ON badge_progress;
CREATE TRIGGER update_badge_progress_updated_at BEFORE UPDATE ON badge_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_streaks_updated_at ON streaks;
CREATE TRIGGER update_streaks_updated_at BEFORE UPDATE ON streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 14. Auto-create streaks row on signup
CREATE OR REPLACE FUNCTION handle_new_streak_record()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO streaks (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_streak ON profiles;
CREATE TRIGGER on_profile_created_streak
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_streak_record();

-- Backfill streaks for existing profiles
INSERT INTO streaks (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;


-- 15. Indexing for high-performance sorting
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON user_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificate_verifications_id ON certificate_verifications(certificate_id);
