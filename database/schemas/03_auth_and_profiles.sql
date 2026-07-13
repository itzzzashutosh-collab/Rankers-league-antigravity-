-- ================================================================
-- Prompt 11: Authentication, Profile Creation & User Onboarding
-- Database Schema — 03_auth_and_profiles.sql
-- ================================================================

-- Enums
CREATE TYPE gender_type AS ENUM ('male', 'female', 'non_binary', 'prefer_not_to_say');
CREATE TYPE profile_status AS ENUM ('incomplete', 'complete', 'suspended');
CREATE TYPE exam_category AS ENUM (
  'JEE_MAIN', 'JEE_ADVANCED', 'NEET_UG', 'NEET_PG', 'CUET_UG',
  'BITSAT', 'VITEEE', 'SRMJEEE', 'MHT_CET', 'WBJEE', 'GATE',
  'CAT', 'XAT', 'GMAT', 'GRE', 'SAT', 'ACT',
  'CLAT', 'AILET', 'LSAT',
  'UPSC_CSE', 'SSC_CGL', 'SSC_CHSL', 'NDA', 'CDS', 'AFCAT',
  'RRB_NTPC', 'SBI_PO', 'SBI_CLERK', 'RBI_GRADE_B', 'UGC_NET',
  'NIFT', 'UCEED', 'IELTS', 'TOEFL'
);
CREATE TYPE academic_level AS ENUM (
  'class_9', 'class_10', 'class_11', 'class_12',
  'graduate', 'post_graduate', 'working_professional', 'other'
);
CREATE TYPE preferred_lang AS ENUM ('en', 'hi');
CREATE TYPE session_status AS ENUM ('active', 'expired', 'logged_out');

-- ================================================================
-- 1. profiles — core user profile data
-- ================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(100),
  username VARCHAR(20) UNIQUE,
  date_of_birth DATE,
  gender gender_type,
  country VARCHAR(60),
  state VARCHAR(60),
  city VARCHAR(60),
  preferred_language preferred_lang NOT NULL DEFAULT 'en',
  primary_exam_category exam_category,
  academic_level academic_level,
  target_exam_year SMALLINT CHECK (target_exam_year >= 2024 AND target_exam_year <= 2040),
  avatar_url TEXT,
  profile_status profile_status NOT NULL DEFAULT 'incomplete',
  aura_points INT NOT NULL DEFAULT 0,
  national_rank INT,
  total_contests_joined INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 2. usernames — fast unique username registry
-- ================================================================
CREATE TABLE usernames (
  username VARCHAR(20) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reserved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 3. participant_identity — public participant IDs and URLs
-- ================================================================
CREATE TABLE participant_identity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_id VARCHAR(20) UNIQUE NOT NULL, -- e.g. RL-20260001
  public_profile_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 4. user_preferences — theme, notifications, language
-- ================================================================
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme VARCHAR(10) NOT NULL DEFAULT 'dark',
  email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
  contest_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  result_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  prize_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 5. avatars — avatar storage metadata
-- ================================================================
CREATE TABLE avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  original_filename TEXT,
  file_size_bytes INT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 6. user_sessions — active device/session tracking
-- ================================================================
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  device_name VARCHAR(100),
  browser VARCHAR(80),
  operating_system VARCHAR(80),
  ip_address INET,
  country_code CHAR(2),
  status session_status NOT NULL DEFAULT 'active',
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE
);

-- ================================================================
-- 7. user_devices — device fingerprints
-- ================================================================
CREATE TABLE user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint TEXT UNIQUE NOT NULL,
  user_agent TEXT,
  is_trusted BOOLEAN NOT NULL DEFAULT FALSE,
  first_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- 8. authentication_logs — OTP attempts, login history
-- ================================================================
CREATE TABLE authentication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- 'otp_sent', 'otp_verified', 'otp_failed', 'login', 'logout'
  ip_address INET,
  success BOOLEAN NOT NULL,
  failure_reason TEXT,
  attempt_count SMALLINT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ================================================================
-- Indexes for performance
-- ================================================================
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_exam_category ON profiles(primary_exam_category);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_status ON user_sessions(status);
CREATE INDEX idx_auth_logs_phone ON authentication_logs(phone_number);
CREATE INDEX idx_auth_logs_user_id ON authentication_logs(user_id);

-- ================================================================
-- Auto-update updated_at triggers
-- ================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- Auto-create profile row on auth.users insert
-- ================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
