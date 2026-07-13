-- Seed data for testing the Wallet and Financial Center
-- 09_wallet_seed.sql

DO $$
DECLARE
  r RECORD;
  v_ref VARCHAR(100);
  v_tx_id UUID;
  v_bank_id UUID;
  v_upi_id UUID;
BEGIN
  -- Loop through each profile (user) to give them initial dummy banking details & transaction history
  FOR r IN SELECT id, username FROM profiles LOOP
    
    -- 1. Create a bank account
    INSERT INTO bank_accounts (user_id, account_holder, account_number, ifsc, bank_name, branch, is_primary, is_verified)
    VALUES (
      r.id,
      COALESCE(r.username, 'User Account'),
      '•••• •••• •••• 9876',
      'HDFC0001242',
      'HDFC Bank Ltd',
      'Connaught Place, New Delhi',
      TRUE,
      TRUE
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_bank_id;

    -- 2. Create a UPI account
    INSERT INTO upi_accounts (user_id, upi_id, is_primary, is_verified)
    VALUES (
      r.id,
      LOWER(r.username) || '@okhdfcbank',
      TRUE,
      TRUE
    )
    ON CONFLICT DO NOTHING
    RETURNING id INTO v_upi_id;

    -- Update balances directly to give some starting money for realistic dashboard testing
    UPDATE wallet_balances
    SET
      available_balance = 3450.00,
      pending_rewards = 1200.00,
      processing_rewards = 500.00,
      contest_entry_balance = 750.00,
      lifetime_earnings = 5850.00,
      lifetime_withdrawals = 1200.00
    WHERE wallet_id = r.id;

    -- 3. Insert recent transactions to match balances

    -- a. Contest Entry Fee Debit
    v_ref := 'TXN-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-001';
    INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, contest_name, description, created_at, completed_at)
    VALUES (
      r.id,
      'contest_entry',
      'completed',
      -250.00,
      v_ref,
      'IIT JEE Advanced Simulator Cup',
      'Registration Fee for IIT JEE Simulator Cup',
      CURRENT_TIMESTAMP - INTERVAL '10 days',
      CURRENT_TIMESTAMP - INTERVAL '10 days'
    ) ON CONFLICT (reference_number) DO NOTHING;

    -- b. Prize Winnings Credit
    v_ref := 'TXN-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-002';
    INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, contest_name, description, created_at, completed_at)
    VALUES (
      r.id,
      'prize_credit',
      'completed',
      4500.00,
      v_ref,
      'IIT JEE Advanced Simulator Cup',
      'First Class Prize Winnings (Rank #12)',
      CURRENT_TIMESTAMP - INTERVAL '9 days',
      CURRENT_TIMESTAMP - INTERVAL '9 days'
    ) ON CONFLICT (reference_number) DO NOTHING;

    -- c. Withdrawal Request Debit
    v_ref := 'TXN-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-003';
    INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, contest_name, description, created_at, completed_at)
    VALUES (
      r.id,
      'withdrawal',
      'completed',
      -1200.00,
      v_ref,
      NULL,
      'Payout to Bank Account HDFC Bank',
      CURRENT_TIMESTAMP - INTERVAL '5 days',
      CURRENT_TIMESTAMP - INTERVAL '5 days'
    ) ON CONFLICT (reference_number) DO NOTHING
    RETURNING id INTO v_tx_id;

    -- Create withdrawal request record to go with it
    IF v_tx_id IS NOT NULL THEN
      INSERT INTO withdrawal_requests (wallet_id, amount, method_id, status_id, bank_account_id, reference_number, created_at, updated_at)
      VALUES (
        r.id,
        1200.00,
        'bank_account',
        'completed',
        v_bank_id,
        v_ref,
        CURRENT_TIMESTAMP - INTERVAL '5 days',
        CURRENT_TIMESTAMP - INTERVAL '5 days'
      ) ON CONFLICT DO NOTHING;
    END IF;

    -- d. Processing Withdrawal Request
    v_ref := 'TXN-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-004';
    INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, contest_name, description, created_at)
    VALUES (
      r.id,
      'withdrawal',
      'processing',
      -500.00,
      v_ref,
      NULL,
      'Withdrawal to UPI ' || LOWER(r.username) || '@okhdfcbank',
      CURRENT_TIMESTAMP - INTERVAL '1 day'
    ) ON CONFLICT (reference_number) DO NOTHING
    RETURNING id INTO v_tx_id;

    -- Create active processing withdrawal request
    IF v_tx_id IS NOT NULL THEN
      INSERT INTO withdrawal_requests (wallet_id, amount, method_id, status_id, upi_account_id, reference_number, estimated_processing_time, created_at)
      VALUES (
        r.id,
        500.00,
        'upi',
        'processing',
        v_upi_id,
        v_ref,
        CURRENT_TIMESTAMP + INTERVAL '12 hours',
        CURRENT_TIMESTAMP - INTERVAL '1 day'
      ) ON CONFLICT DO NOTHING;
    END IF;

    -- e. Welcome Bonus Credit
    v_ref := 'TXN-' || UPPER(SUBSTRING(r.id::text, 1, 8)) || '-005';
    INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, contest_name, description, created_at, completed_at)
    VALUES (
      r.id,
      'bonus_reward',
      'completed',
      100.00,
      v_ref,
      NULL,
      'Platform Welcome Account Crediting Bonus',
      CURRENT_TIMESTAMP - INTERVAL '15 days',
      CURRENT_TIMESTAMP - INTERVAL '15 days'
    ) ON CONFLICT (reference_number) DO NOTHING;

  END LOOP;
END $$;
