CREATE TYPE league_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE calibration_tier AS ENUM ('elite', 'prime', 'apex');
CREATE TYPE audit_status AS ENUM ('verified', 'pending', 'none');

CREATE TABLE aspirants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name VARCHAR(100) NOT NULL,
  verification_status audit_status NOT NULL DEFAULT 'none',
  global_standing_points INT NOT NULL DEFAULT 0,
  national_rank INT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE championships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
  entry_fee_credits INT NOT NULL DEFAULT 0,
  max_participants INT NOT NULL,
  current_participants INT NOT NULL DEFAULT 0,
  status league_status NOT NULL DEFAULT 'upcoming',
  rewards_pool_credits INT NOT NULL,
  difficulty_tier calibration_tier NOT NULL DEFAULT 'prime'
);

CREATE TABLE standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID REFERENCES championships(id) ON DELETE CASCADE,
  aspirant_name VARCHAR(100) NOT NULL,
  aspirant_tier VARCHAR(50) NOT NULL,
  rank_position INT NOT NULL,
  percentile NUMERIC(5, 2) NOT NULL,
  total_score NUMERIC(6, 2) NOT NULL,
  accuracy_rate NUMERIC(5, 2) NOT NULL,
  duration_seconds INT NOT NULL
);
