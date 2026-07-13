-- ================================================================
-- Prompt 12: Competition Intelligence Hub & Performance Analytics
-- Database Schema — 07_performance_intelligence.sql
-- ================================================================

-- 1. performance_heatmaps
CREATE TABLE IF NOT EXISTS performance_heatmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  chapter VARCHAR(100) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  contest_name VARCHAR(200) NOT NULL,
  score NUMERIC(6, 2) NOT NULL DEFAULT 0,
  accuracy NUMERIC(5, 2) NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  incorrect_answers INT NOT NULL DEFAULT 0,
  skipped INT NOT NULL DEFAULT 0,
  average_time_seconds INT NOT NULL DEFAULT 0,
  contest_date TIMESTAMP WITH TIME ZONE NOT NULL,
  rank INT,
  aura_earned INT DEFAULT 0,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard', 'very_hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. performance_reports
CREATE TABLE IF NOT EXISTS performance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_summary TEXT NOT NULL,
  strongest_subject VARCHAR(50) NOT NULL,
  weakest_subject VARCHAR(50) NOT NULL,
  strongest_chapter VARCHAR(100) NOT NULL,
  weakest_chapter VARCHAR(100) NOT NULL,
  strongest_topic VARCHAR(100) NOT NULL,
  weakest_topic VARCHAR(100) NOT NULL,
  most_improved_subject VARCHAR(50) NOT NULL,
  needs_immediate_attention VARCHAR(100) NOT NULL,
  average_accuracy NUMERIC(5, 2) NOT NULL DEFAULT 0,
  average_contest_rank NUMERIC(8, 2) NOT NULL DEFAULT 0,
  average_aura NUMERIC(8, 2) NOT NULL DEFAULT 0,
  contest_consistency JSONB DEFAULT '{}',
  smart_insights JSONB DEFAULT '[]',
  improvement_opportunities JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. subject_statistics
CREATE TABLE IF NOT EXISTS subject_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  total_contests INT NOT NULL DEFAULT 0,
  average_score NUMERIC(6, 2) NOT NULL DEFAULT 0,
  accuracy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  rank_average NUMERIC(8, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject)
);

-- 4. chapter_statistics
CREATE TABLE IF NOT EXISTS chapter_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  chapter VARCHAR(100) NOT NULL,
  total_questions INT NOT NULL DEFAULT 0,
  correct_questions INT NOT NULL DEFAULT 0,
  accuracy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject, chapter)
);

-- 5. topic_statistics
CREATE TABLE IF NOT EXISTS topic_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  chapter VARCHAR(100) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  total_questions INT NOT NULL DEFAULT 0,
  correct_questions INT NOT NULL DEFAULT 0,
  accuracy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject, chapter, topic)
);

-- 6. difficulty_statistics
CREATE TABLE IF NOT EXISTS difficulty_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  difficulty_level VARCHAR(20) NOT NULL,
  total_questions INT NOT NULL DEFAULT 0,
  correct_questions INT NOT NULL DEFAULT 0,
  accuracy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, difficulty_level)
);

-- 7. time_statistics
CREATE TABLE IF NOT EXISTS time_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  chapter VARCHAR(100) NOT NULL,
  average_solve_time_seconds INT NOT NULL DEFAULT 0,
  pace VARCHAR(20) CHECK (pace IN ('fast', 'normal', 'slow', 'very_slow')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject, chapter)
);

-- 8. accuracy_statistics
CREATE TABLE IF NOT EXISTS accuracy_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL,
  accuracy_rate NUMERIC(5, 2) NOT NULL DEFAULT 0,
  accuracy_rate_trend JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject)
);

-- 9. consistency_statistics
CREATE TABLE IF NOT EXISTS consistency_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  contests_completed INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- 10. dashboard_summary
CREATE TABLE IF NOT EXISTS dashboard_summary (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_aura INT NOT NULL DEFAULT 0,
  global_rank INT,
  current_streak INT NOT NULL DEFAULT 0,
  next_tier_progress NUMERIC(5, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- Indexes
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_perf_heatmaps_user ON performance_heatmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_perf_heatmaps_sub ON performance_heatmaps(subject);
CREATE INDEX IF NOT EXISTS idx_perf_reports_user ON performance_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_consistency_stats_date ON consistency_statistics(date);
