-- Exam Sessions, Results and Payouts Database Schemas

-- 1. Extend or add details to completed contest properties
CREATE TABLE contest_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'upsc-elite-live'
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL, -- e.g. 'UPSC', 'JEE', 'NEET'
  exam_name VARCHAR(150) NOT NULL, -- e.g. 'UPSC CSE Prelims'
  contest_date VARCHAR(100) NOT NULL,
  participants_count INT NOT NULL DEFAULT 0,
  entry_fee INT NOT NULL DEFAULT 0,
  max_score INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  winning_cutoff_score INT NOT NULL DEFAULT 0,
  winning_cutoff_rank INT NOT NULL DEFAULT 0,
  result_status VARCHAR(50) NOT NULL DEFAULT 'published', -- 'published', 'under_verification', 'final'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User dynamic contest registration access credentials & states
CREATE TABLE contest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  secret_code VARCHAR(50) NOT NULL,
  verification_status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  lobby_joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Live Examination candidate workspace logs & telemetry
CREATE TABLE contest_exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  saved_answers JSONB DEFAULT '{}'::jsonb, -- mapping questionIndex -> selectedOption
  time_remaining_seconds INT NOT NULL,
  fullscreen_exit_count INT DEFAULT 0,
  connection_status VARCHAR(50) DEFAULT 'connected', -- 'connected', 'offline'
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Payout distributions matrix results ledger
CREATE TABLE contest_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  rank_position INT NOT NULL,
  score INT NOT NULL,
  aura_points_earned INT NOT NULL DEFAULT 0,
  prize_allocated INT NOT NULL DEFAULT 0,
  payout_status VARCHAR(50) NOT NULL DEFAULT 'no_prize', -- 'prize_won', 'prize_processing', 'prize_credited', 'no_prize'
  credited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
