-- Rebuild contest registrations & device validation ledger
-- 14_contest_registration.sql

-- Drop existing tables/dependencies to allow schema modifications
DROP TABLE IF EXISTS contest_payments CASCADE;
DROP TABLE IF EXISTS contest_sessions CASCADE;
DROP TABLE IF EXISTS trusted_devices CASCADE;
DROP TABLE IF EXISTS contest_verification_codes CASCADE;
DROP TABLE IF EXISTS contest_participants CASCADE;
DROP TABLE IF EXISTS contest_registrations CASCADE;
DROP TABLE IF EXISTS contest_status_history CASCADE;
DROP TABLE IF EXISTS contest_checkout CASCADE;
DROP TABLE IF EXISTS contest_audit_logs CASCADE;

-- 1. Contest Registrations Ledger (production ready)
CREATE TABLE contest_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  registration_number VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'RL-REG-UPSC-xxxx'
  selected_language VARCHAR(50) NOT NULL DEFAULT 'English',
  status VARCHAR(50) NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'completed')),
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'waived')),
  entry_fee_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, contest_id)
);

-- 2. Contest Participants Credentials Detail
CREATE TABLE contest_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES contest_registrations(id) ON DELETE CASCADE,
  seat_number VARCHAR(50) NOT NULL, -- e.g. 'SEAT-104A'
  reporting_time TIMESTAMP WITH TIME ZONE NOT NULL,
  verification_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(registration_id)
);

-- 3. One-Time Verification Codes (Hashed)
CREATE TABLE contest_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  code_hash VARCHAR(256) NOT NULL, -- Never store plain text
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trusted Devices Catalog
CREATE TABLE trusted_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(256) NOT NULL, -- unique browser/device fingerprint
  device_name VARCHAR(150) NOT NULL, -- e.g. 'Chrome on Windows'
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, device_fingerprint)
);

-- 5. Contest Active Telemetry Sessions
CREATE TABLE contest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES contest_registrations(id) ON DELETE CASCADE,
  device_fingerprint VARCHAR(256),
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  session_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (session_status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(registration_id)
);

-- 6. Contest Checkout Ledger (cart session tracking)
CREATE TABLE contest_checkout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Contest Payments Log
CREATE TABLE contest_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES contest_registrations(id) ON DELETE CASCADE,
  wallet_transaction_id UUID, -- links to financial wallet transactions if paid
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  payment_method VARCHAR(50) NOT NULL DEFAULT 'wallet', -- e.g. 'wallet', 'free_tier'
  payment_status VARCHAR(50) NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Contest Status Timeline History
CREATE TABLE contest_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id VARCHAR(100) NOT NULL REFERENCES contest_results(contest_id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- e.g. 'upcoming', 'active', 'completed'
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. General Registration Audit Log
CREATE TABLE contest_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL, -- e.g. 'REGISTRATION_CREATED', 'LOBBY_ENTERED'
  ip_address INET,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS Policies Setup
ALTER TABLE contest_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_checkout ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_all_registrations ON contest_registrations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_all_participants ON contest_participants
  FOR ALL USING (EXISTS (
    SELECT 1 FROM contest_registrations r
    WHERE r.id = registration_id AND r.user_id = auth.uid()
  ));

CREATE POLICY user_all_verification_codes ON contest_verification_codes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_all_trusted_devices ON trusted_devices
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_all_sessions ON contest_sessions
  FOR ALL USING (EXISTS (
    SELECT 1 FROM contest_registrations r
    WHERE r.id = registration_id AND r.user_id = auth.uid()
  ));

CREATE POLICY user_all_checkout ON contest_checkout
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_all_payments ON contest_payments
  FOR ALL USING (EXISTS (
    SELECT 1 FROM contest_registrations r
    WHERE r.id = registration_id AND r.user_id = auth.uid()
  ));

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_contest_registrations_user ON contest_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_registrations_contest ON contest_registrations(contest_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user ON trusted_devices(user_id, device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_contest_participants_reg ON contest_participants(registration_id);
