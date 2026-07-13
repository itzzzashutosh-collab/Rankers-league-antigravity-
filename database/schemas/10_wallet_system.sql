-- Schema for Wallet, Prize Wallet, Transactions, Payouts & Financial Center
-- 10_wallet_system.sql

-- 1. Reference/Type Tables
CREATE TABLE IF NOT EXISTS transaction_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS transaction_status (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS withdrawal_methods (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- Seed Type Data if not exists
INSERT INTO transaction_types (id, name, description) VALUES
('contest_entry', 'Contest Entry', 'Payment of entry fee for joining a contest'),
('contest_refund', 'Contest Refund', 'Refund of entry fee for a cancelled contest'),
('prize_credit', 'Prize Credit', 'Winnings from placing in a contest'),
('withdrawal', 'Withdrawal', 'Payout to user bank or UPI account'),
('withdrawal_reversal', 'Withdrawal Reversal', 'Cancelled or failed withdrawal returned to balance'),
('manual_adjustment', 'Manual Adjustment', 'Administrative debit or credit'),
('bonus_reward', 'Bonus Reward', 'Promotional or referral bonus reward')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO transaction_status (id, name, description) VALUES
('pending', 'Pending', 'Transaction is initiated and waiting for next steps'),
('processing', 'Processing', 'Transaction is undergoing verification or system execution'),
('completed', 'Completed', 'Transaction succeeded and funds are settled'),
('failed', 'Failed', 'Transaction failed due to error or rejection'),
('cancelled', 'Cancelled', 'Transaction was cancelled by user or administrator')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO withdrawal_methods (id, name) VALUES
('upi', 'UPI ID'),
('bank_account', 'Bank Account')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;


-- 2. Wallet Table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Wallet Balances Table
CREATE TABLE IF NOT EXISTS wallet_balances (
  wallet_id UUID PRIMARY KEY REFERENCES wallets(id) ON DELETE CASCADE,
  available_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0.00),
  pending_rewards NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (pending_rewards >= 0.00),
  processing_rewards NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (processing_rewards >= 0.00),
  contest_entry_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (contest_entry_balance >= 0.00),
  lifetime_earnings NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (lifetime_earnings >= 0.00),
  lifetime_withdrawals NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (lifetime_withdrawals >= 0.00),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 4. User Financial Accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_holder VARCHAR(150) NOT NULL,
  account_number TEXT NOT NULL, -- Encrypted/Secured string (represented as text)
  ifsc VARCHAR(20) NOT NULL,
  bank_name VARCHAR(150) NOT NULL,
  branch VARCHAR(150) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upi_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  upi_id VARCHAR(100) NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 5. Withdrawal Requests
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 100.00 AND amount <= 50000.00), -- Minimum 100, Maximum 50,000 for verification limit
  method_id VARCHAR(50) NOT NULL REFERENCES withdrawal_methods(id),
  status_id VARCHAR(50) NOT NULL REFERENCES transaction_status(id) DEFAULT 'pending',
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE SET NULL,
  upi_account_id UUID REFERENCES upi_accounts(id) ON DELETE SET NULL,
  reference_number VARCHAR(100),
  estimated_processing_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 6. Transactions
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type_id VARCHAR(50) NOT NULL REFERENCES transaction_types(id),
  status_id VARCHAR(50) NOT NULL REFERENCES transaction_status(id),
  amount NUMERIC(12, 2) NOT NULL, -- positive for credits, negative for debits
  reference_number VARCHAR(100) UNIQUE NOT NULL,
  contest_id UUID, -- optional, if relating to user contest registration/earnings
  contest_name VARCHAR(200),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE
);


-- 7. Specific Financial Action Records (Sub-ledgers)
CREATE TABLE IF NOT EXISTS contest_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0.00),
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reward_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0.00),
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE SET NULL,
  credited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reward_processing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0.00),
  status_id VARCHAR(50) NOT NULL REFERENCES transaction_status(id) DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES wallet_transactions(id) ON DELETE CASCADE,
  gateway_reference VARCHAR(100),
  payment_method VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS financial_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  amount NUMERIC(12, 2),
  before_state JSONB,
  after_state JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- 8. Enable triggers for updated_at across new tables
CREATE OR REPLACE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_wallet_balances_updated_at BEFORE UPDATE ON wallet_balances
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_upi_accounts_updated_at BEFORE UPDATE ON upi_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON withdrawal_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER update_reward_processing_updated_at BEFORE UPDATE ON reward_processing
FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- 9. Auto-create wallet and wallet_balances on user signup
CREATE OR REPLACE FUNCTION handle_new_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (id) VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO wallet_balances (wallet_id) VALUES (NEW.id)
  ON CONFLICT (wallet_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on profiles
DROP TRIGGER IF EXISTS on_profile_created_wallet ON profiles;
CREATE TRIGGER on_profile_created_wallet
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_wallet();


-- 10. Backfill existing profiles
INSERT INTO wallets (id)
SELECT id FROM profiles
ON CONFLICT (id) DO NOTHING;

INSERT INTO wallet_balances (wallet_id)
SELECT id FROM profiles
ON CONFLICT (wallet_id) DO NOTHING;


-- 11. Transaction trigger to auto-update wallet_balances
CREATE OR REPLACE FUNCTION process_wallet_transaction()
RETURNS TRIGGER AS $$
DECLARE
  v_available NUMERIC(12, 2);
  v_pending NUMERIC(12, 2);
  v_processing NUMERIC(12, 2);
  v_entry NUMERIC(12, 2);
  v_earnings NUMERIC(12, 2);
  v_withdrawals NUMERIC(12, 2);
BEGIN
  -- Lock current balance row for update
  SELECT available_balance, pending_rewards, processing_rewards, contest_entry_balance, lifetime_earnings, lifetime_withdrawals
  INTO v_available, v_pending, v_processing, v_entry, v_earnings, v_withdrawals
  FROM wallet_balances
  WHERE wallet_id = NEW.wallet_id
  FOR UPDATE;

  -- Apply changes depending on type
  IF NEW.type_id = 'prize_credit' AND NEW.status_id = 'completed' THEN
    -- Prize credit completed: Available increases, pending rewards decreases, lifetime earnings increases
    -- Note: amount is positive for credit
    v_available := v_available + NEW.amount;
    -- If there was a pending reward recorded, we decrease it (ensure it doesn't go below 0)
    v_pending := GREATEST(0.00, v_pending - NEW.amount);
    v_earnings := v_earnings + NEW.amount;

  ELSIF NEW.type_id = 'contest_entry' AND NEW.status_id = 'completed' THEN
    -- Contest entry completed: Debit from contest entry balance first, then available balance
    -- Note: NEW.amount is stored as a negative number for debits, or positive in code. Let's assume input amount is positive for simplicity,
    -- but to prevent bugs let's use ABS(NEW.amount).
    DECLARE
      v_debit NUMERIC(12, 2) := ABS(NEW.amount);
    BEGIN
      IF v_entry >= v_debit THEN
        v_entry := v_entry - v_debit;
      ELSE
        v_debit := v_debit - v_entry;
        v_entry := 0.00;
        IF v_available >= v_debit THEN
          v_available := v_available - v_debit;
        ELSE
          RAISE EXCEPTION 'Insufficient balance for contest entry';
        END IF;
      END IF;
    END;

  ELSIF NEW.type_id = 'contest_refund' AND NEW.status_id = 'completed' THEN
    -- Contest refund: Returns to available balance
    v_available := v_available + ABS(NEW.amount);

  ELSIF NEW.type_id = 'withdrawal' AND NEW.status_id = 'processing' THEN
    -- Withdrawal initiated: Subtract from available balance, add to processing rewards/withdrawing locked funds
    DECLARE
      v_debit NUMERIC(12, 2) := ABS(NEW.amount);
    BEGIN
      IF v_available >= v_debit THEN
        v_available := v_available - v_debit;
        v_processing := v_processing + v_debit;
      ELSE
        RAISE EXCEPTION 'Insufficient balance for withdrawal';
      END IF;
    END;

  ELSIF NEW.type_id = 'withdrawal' AND NEW.status_id = 'completed' THEN
    -- Withdrawal settled: Subtract from processing, add to lifetime withdrawals
    DECLARE
      v_debit NUMERIC(12, 2) := ABS(NEW.amount);
    BEGIN
      v_processing := GREATEST(0.00, v_processing - v_debit);
      v_withdrawals := v_withdrawals + v_debit;
    END;

  ELSIF NEW.type_id = 'withdrawal' AND NEW.status_id = 'failed' THEN
    -- Withdrawal failed: Return processing back to available
    DECLARE
      v_credit NUMERIC(12, 2) := ABS(NEW.amount);
    BEGIN
      v_processing := GREATEST(0.00, v_processing - v_credit);
      v_available := v_available + v_credit;
    END;

  ELSIF NEW.type_id = 'withdrawal_reversal' AND NEW.status_id = 'completed' THEN
    -- Withdrawal reversal completed: Return to available balance
    v_available := v_available + ABS(NEW.amount);

  ELSIF NEW.type_id = 'manual_adjustment' AND NEW.status_id = 'completed' THEN
    -- Admin adjustment: can be positive or negative
    IF NEW.amount >= 0.00 THEN
      v_available := v_available + NEW.amount;
    ELSE
      IF v_available >= ABS(NEW.amount) THEN
        v_available := v_available - ABS(NEW.amount);
      ELSE
        RAISE EXCEPTION 'Insufficient available balance for debit adjustment';
      END IF;
    END IF;

  ELSIF NEW.type_id = 'bonus_reward' AND NEW.status_id = 'completed' THEN
    -- Bonus reward: credited to available balance
    v_available := v_available + ABS(NEW.amount);
  END IF;

  -- Update the balance sheet
  UPDATE wallet_balances
  SET
    available_balance = v_available,
    pending_rewards = v_pending,
    processing_rewards = v_processing,
    contest_entry_balance = v_entry,
    lifetime_earnings = v_earnings,
    lifetime_withdrawals = v_withdrawals,
    updated_at = CURRENT_TIMESTAMP
  WHERE wallet_id = NEW.wallet_id;

  -- Create Financial Audit Log entry
  INSERT INTO financial_audit_logs (
    user_id,
    action,
    amount,
    before_state,
    after_state
  )
  VALUES (
    NEW.wallet_id,
    'transaction_' || NEW.type_id || '_' || NEW.status_id,
    NEW.amount,
    json_build_object(
      'available_balance', (SELECT available_balance FROM wallet_balances WHERE wallet_id = NEW.wallet_id),
      'pending_rewards', (SELECT pending_rewards FROM wallet_balances WHERE wallet_id = NEW.wallet_id),
      'processing_rewards', (SELECT processing_rewards FROM wallet_balances WHERE wallet_id = NEW.wallet_id),
      'contest_entry_balance', (SELECT contest_entry_balance FROM wallet_balances WHERE wallet_id = NEW.wallet_id)
    )::jsonb,
    json_build_object(
      'available_balance', v_available,
      'pending_rewards', v_pending,
      'processing_rewards', v_processing,
      'contest_entry_balance', v_entry
    )::jsonb
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on wallet_transactions
DROP TRIGGER IF EXISTS on_transaction_inserted ON wallet_transactions;
CREATE TRIGGER on_transaction_inserted
  AFTER INSERT OR UPDATE OF status_id ON wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION process_wallet_transaction();


-- 12. Security RLS Policies
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE upi_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contest_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_audit_logs ENABLE ROW LEVEL SECURITY;

-- Define RLS rules: Users can only see their own records. Service role sees everything.
DROP POLICY IF EXISTS user_read_wallets ON wallets;
CREATE POLICY user_read_wallets ON wallets FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS user_read_wallet_balances ON wallet_balances;
CREATE POLICY user_read_wallet_balances ON wallet_balances FOR SELECT USING (auth.uid() = wallet_id);

DROP POLICY IF EXISTS user_all_bank_accounts ON bank_accounts;
CREATE POLICY user_all_bank_accounts ON bank_accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_all_upi_accounts ON upi_accounts;
CREATE POLICY user_all_upi_accounts ON upi_accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS user_read_withdrawal_requests ON withdrawal_requests;
CREATE POLICY user_read_withdrawal_requests ON withdrawal_requests
  FOR SELECT USING (auth.uid() = wallet_id);

DROP POLICY IF EXISTS user_create_withdrawal_requests ON withdrawal_requests;
CREATE POLICY user_create_withdrawal_requests ON withdrawal_requests
  FOR INSERT WITH CHECK (auth.uid() = wallet_id);

DROP POLICY IF EXISTS user_read_transactions ON wallet_transactions;
CREATE POLICY user_read_transactions ON wallet_transactions
  FOR SELECT USING (auth.uid() = wallet_id);

DROP POLICY IF EXISTS user_read_contest_payments ON contest_payments;
CREATE POLICY user_read_contest_payments ON contest_payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_read_reward_credits ON reward_credits;
CREATE POLICY user_read_reward_credits ON reward_credits
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_read_reward_processing ON reward_processing;
CREATE POLICY user_read_reward_processing ON reward_processing
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_read_financial_audit ON financial_audit_logs;
CREATE POLICY user_read_financial_audit ON financial_audit_logs
  FOR SELECT USING (auth.uid() = user_id);


-- 13. Index creation for optimized lookup speeds
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created ON wallet_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_withdrawal_requests_wallet_id ON withdrawal_requests(wallet_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_upi_accounts_user_id ON upi_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_audit_logs_user_id ON financial_audit_logs(user_id);
