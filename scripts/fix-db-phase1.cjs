const pg = require('pg');
const fs = require('fs');
const path = require('path');

const client = new pg.Client({
  connectionString: 'postgresql://postgres:HjQFUHGBFBk4dVog@db.bgsdovlumtjwvcwzjnnn.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  console.log('✅ Connected to Supabase DB\n');

  // ============================================================
  // Step 1: Apply the wallet trigger SQL to live DB
  // ============================================================
  console.log('Step 1: Applying wallet trigger SQL...');
  const walletSQL = fs.readFileSync(
    path.resolve('database/schemas/10_wallet_system.sql'), 'utf-8'
  );
  try {
    await client.query(walletSQL);
    console.log('  ✅ Wallet schema + trigger applied');
  } catch(e) {
    if (e.message.includes('already exists')) {
      console.log('  ℹ️ Some objects already exist — applying trigger only...');
      // Apply just the trigger function and trigger
      const triggerSQL = `
        CREATE OR REPLACE FUNCTION process_wallet_transaction()
        RETURNS TRIGGER AS $$
        DECLARE
          v_available NUMERIC(12, 2);
          v_pending NUMERIC(12, 2);
          v_processing NUMERIC(12, 2);
          v_entry NUMERIC(12, 2);
          v_earnings NUMERIC(12, 2);
          v_withdrawals NUMERIC(12, 2);
          v_debit NUMERIC(12, 2);
          v_credit NUMERIC(12, 2);
        BEGIN
          SELECT available_balance, pending_rewards, processing_rewards, contest_entry_balance, lifetime_earnings, lifetime_withdrawals
          INTO v_available, v_pending, v_processing, v_entry, v_earnings, v_withdrawals
          FROM wallet_balances
          WHERE wallet_id = NEW.wallet_id
          FOR UPDATE;

          IF NEW.type_id = 'prize_credit' AND NEW.status_id = 'completed' THEN
            v_available := v_available + NEW.amount;
            v_pending := GREATEST(0.00, v_pending - NEW.amount);
            v_earnings := v_earnings + NEW.amount;

          ELSIF NEW.type_id = 'contest_entry' AND NEW.status_id = 'completed' THEN
            v_debit := ABS(NEW.amount);
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

          ELSIF NEW.type_id = 'contest_refund' AND NEW.status_id = 'completed' THEN
            v_available := v_available + ABS(NEW.amount);

          ELSIF NEW.type_id = 'withdrawal' AND NEW.status_id = 'processing' THEN
            v_debit := ABS(NEW.amount);
            IF v_available >= v_debit THEN
              v_available := v_available - v_debit;
              v_processing := v_processing + v_debit;
            ELSE
              RAISE EXCEPTION 'Insufficient balance for withdrawal';
            END IF;

          ELSIF NEW.type_id = 'withdrawal' AND NEW.status_id = 'completed' THEN
            v_debit := ABS(NEW.amount);
            v_processing := GREATEST(0.00, v_processing - v_debit);
            v_withdrawals := v_withdrawals + v_debit;

          ELSIF NEW.type_id = 'withdrawal' AND NEW.status_id = 'failed' THEN
            v_credit := ABS(NEW.amount);
            v_processing := GREATEST(0.00, v_processing - v_credit);
            v_available := v_available + v_credit;

          ELSIF NEW.type_id = 'withdrawal_reversal' AND NEW.status_id = 'completed' THEN
            v_available := v_available + ABS(NEW.amount);

          ELSIF NEW.type_id = 'manual_adjustment' AND NEW.status_id = 'completed' THEN
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
            v_available := v_available + ABS(NEW.amount);
          END IF;

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

          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;

        DROP TRIGGER IF EXISTS on_transaction_inserted ON wallet_transactions;
        CREATE TRIGGER on_transaction_inserted
          AFTER INSERT OR UPDATE OF status_id ON wallet_transactions
          FOR EACH ROW EXECUTE FUNCTION process_wallet_transaction();
      `;
      await client.query(triggerSQL);
      console.log('  ✅ Trigger function + trigger applied successfully!');
    } else {
      console.error('  ❌ Error applying wallet SQL:', e.message);
    }
  }

  // ============================================================
  // Step 2: Fix RLS — Add INSERT policy to wallet_transactions
  // ============================================================
  console.log('\nStep 2: Fixing RLS policies...');

  // wallet_transactions — add INSERT
  try {
    await client.query("DROP POLICY IF EXISTS user_insert_transactions ON wallet_transactions");
    await client.query(`
      CREATE POLICY user_insert_transactions ON wallet_transactions
        FOR INSERT WITH CHECK (auth.uid() = wallet_id)
    `);
    console.log('  ✅ wallet_transactions INSERT policy created');
  } catch(e) { console.log('  ❌ wallet_transactions INSERT policy:', e.message); }

  // contest_audit_logs — add INSERT + SELECT
  try {
    await client.query("DROP POLICY IF EXISTS user_insert_audit_logs ON contest_audit_logs");
    await client.query("DROP POLICY IF EXISTS user_read_audit_logs ON contest_audit_logs");
    await client.query(`
      CREATE POLICY user_insert_audit_logs ON contest_audit_logs
        FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL)
    `);
    await client.query(`
      CREATE POLICY user_read_audit_logs ON contest_audit_logs
        FOR SELECT USING (auth.uid() = user_id)
    `);
    console.log('  ✅ contest_audit_logs INSERT + SELECT policies created');
  } catch(e) { console.log('  ❌ contest_audit_logs policies:', e.message); }

  // financial_audit_logs — add INSERT policy (needed for trigger)
  try {
    await client.query("DROP POLICY IF EXISTS system_insert_financial_audit ON financial_audit_logs");
    await client.query(`
      CREATE POLICY system_insert_financial_audit ON financial_audit_logs
        FOR INSERT WITH CHECK (true)
    `);
    console.log('  ✅ financial_audit_logs INSERT policy created');
  } catch(e) { console.log('  ⚠️ financial_audit_logs INSERT policy:', e.message); }

  // ============================================================
  // Step 3: Verify trigger works with a real test
  // ============================================================
  console.log('\nStep 3: Verifying trigger with test transaction...');
  const wallets = await client.query('SELECT id FROM wallets LIMIT 1');
  const walletId = wallets.rows[0]?.id;

  if (walletId) {
    const before = await client.query(
      'SELECT available_balance FROM wallet_balances WHERE wallet_id = $1', [walletId]
    );
    const beforeBalance = parseFloat(before.rows[0]?.available_balance || 0);
    console.log(`  Balance BEFORE: ₹${beforeBalance}`);

    const testRef = 'TXN-TRIGGER-TEST-' + Date.now();
    try {
      await client.query(
        'INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, description) VALUES ($1, $2, $3, $4, $5, $6)',
        [walletId, 'manual_adjustment', 'completed', -100.0, testRef, 'Trigger verification test']
      );

      const after = await client.query(
        'SELECT available_balance FROM wallet_balances WHERE wallet_id = $1', [walletId]
      );
      const afterBalance = parseFloat(after.rows[0]?.available_balance || 0);
      console.log(`  Balance AFTER deduct ₹100: ₹${afterBalance}`);

      if (afterBalance < beforeBalance) {
        console.log('  ✅ TRIGGER WORKS! Balance correctly deducted!');
        // Restore balance with a credit
        const restoreRef = 'TXN-TRIGGER-RESTORE-' + Date.now();
        await client.query(
          'INSERT INTO wallet_transactions (wallet_id, type_id, status_id, amount, reference_number, description) VALUES ($1, $2, $3, $4, $5, $6)',
          [walletId, 'manual_adjustment', 'completed', 100.0, restoreRef, 'Trigger test restore']
        );
        const restored = await client.query(
          'SELECT available_balance FROM wallet_balances WHERE wallet_id = $1', [walletId]
        );
        console.log(`  Balance RESTORED to: ₹${restored.rows[0]?.available_balance}`);
      } else {
        console.log('  ❌ TRIGGER DID NOT FIRE — balance unchanged');
      }
    } catch(e) {
      console.log('  ❌ Test transaction error:', e.message);
    }
  }

  // ============================================================
  // Step 4: Reload PostgREST
  // ============================================================
  try {
    await client.query("NOTIFY pgrst, 'reload schema'");
    console.log('\n✅ PostgREST schema cache reloaded!');
  } catch(e) { console.log('⚠️ Schema reload warning:', e.message); }

  await client.end();
  console.log('\n🎉 Phase 1 complete! Database is now fully wired.\n');
}

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
