-- ============================================================
-- Ranker's League: Financial Operations Platform
-- Schema 22: Complete Financial Infrastructure
-- ============================================================

-- 1. Master financial transaction ledger (immutable)
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID,
    contest_id UUID,
    transaction_type VARCHAR(60) NOT NULL CHECK (
        transaction_type IN (
            'Contest Entry', 'Prize Credit', 'Wallet Top-up',
            'Withdrawal', 'Refund', 'Subscription',
            'Manual Adjustment', 'System Adjustment', 'Platform Fee'
        )
    ),
    amount NUMERIC(14,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(40) DEFAULT 'Pending' CHECK (
        status IN ('Pending', 'Processing', 'Completed', 'Failed', 'Reversed')
    ),
    reference_id VARCHAR(150),
    source VARCHAR(100),
    destination VARCHAR(100),
    meta JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 2. Immutable double-entry wallet ledger
CREATE TABLE IF NOT EXISTS public.wallet_ledgers (
    id BIGSERIAL PRIMARY KEY,
    participant_id UUID NOT NULL,
    transaction_id UUID REFERENCES public.financial_transactions(id) ON DELETE SET NULL,
    ledger_type VARCHAR(40) NOT NULL CHECK (ledger_type IN ('Debit','Credit')),
    category VARCHAR(60) NOT NULL,  -- 'Contest Entry', 'Prize', 'Withdrawal', etc.
    amount NUMERIC(14,2) NOT NULL,
    running_balance NUMERIC(14,2) NOT NULL DEFAULT 0,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Ledger is insert-only: no updates or deletes allowed
CREATE RULE protect_wallet_ledger_update AS ON UPDATE TO public.wallet_ledgers DO INSTEAD NOTHING;
CREATE RULE protect_wallet_ledger_delete AS ON DELETE TO public.wallet_ledgers DO INSTEAD NOTHING;

-- 3. Materialised wallet balances (refreshed by trigger)
CREATE TABLE IF NOT EXISTS public.wallet_balances (
    participant_id UUID PRIMARY KEY,
    wallet_balance NUMERIC(14,2) DEFAULT 0,
    prize_balance NUMERIC(14,2) DEFAULT 0,
    locked_balance NUMERIC(14,2) DEFAULT 0,
    withdrawable_balance NUMERIC(14,2) DEFAULT 0,
    lifetime_credits NUMERIC(14,2) DEFAULT 0,
    lifetime_withdrawals NUMERIC(14,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Contest entry fee collections
CREATE TABLE IF NOT EXISTS public.contest_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    contest_title VARCHAR(200),
    total_participants INT DEFAULT 0,
    entry_fee NUMERIC(14,2) NOT NULL,
    gross_collection NUMERIC(14,2) DEFAULT 0,
    platform_fee_pct NUMERIC(5,2) DEFAULT 20,
    platform_fee_amount NUMERIC(14,2) DEFAULT 0,
    prize_pool NUMERIC(14,2) DEFAULT 0,
    net_profit NUMERIC(14,2) DEFAULT 0,
    status VARCHAR(40) DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Contest revenue breakdown
CREATE TABLE IF NOT EXISTS public.contest_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    revenue_type VARCHAR(60) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    period_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Prize distribution records
CREATE TABLE IF NOT EXISTS public.contest_prize_distribution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contest_id UUID NOT NULL,
    participant_id UUID,
    rank INT NOT NULL,
    prize_amount NUMERIC(14,2) NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (
        status IN ('Pending', 'Processing', 'Credited', 'Failed')
    ),
    credited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Withdrawal requests
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID,
    participant_username VARCHAR(80),
    amount NUMERIC(14,2) NOT NULL,
    method VARCHAR(60) DEFAULT 'Bank Transfer' CHECK (
        method IN ('Bank Transfer', 'UPI', 'Wallet', 'Other')
    ),
    bank_details JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (
        status IN ('Pending', 'Under Review', 'Approved', 'Processing', 'Completed', 'Rejected', 'On Hold')
    ),
    rejection_reason TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 8. Withdrawal review audit trail
CREATE TABLE IF NOT EXISTS public.withdrawal_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    withdrawal_id UUID REFERENCES public.withdrawal_requests(id) ON DELETE CASCADE,
    reviewed_by UUID,
    action VARCHAR(40) NOT NULL CHECK (action IN ('Approved', 'Rejected', 'On Hold', 'Requested Info')),
    note TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Refund requests
CREATE TABLE IF NOT EXISTS public.refund_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID,
    participant_username VARCHAR(80),
    contest_id UUID,
    contest_title VARCHAR(200),
    reason TEXT NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    status VARCHAR(40) DEFAULT 'Pending' CHECK (
        status IN ('Pending', 'Under Review', 'Approved', 'Rejected', 'Completed')
    ),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- 10. Refund reviews
CREATE TABLE IF NOT EXISTS public.refund_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    refund_id UUID REFERENCES public.refund_requests(id) ON DELETE CASCADE,
    reviewed_by UUID,
    action VARCHAR(40) NOT NULL,
    note TEXT,
    reviewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Subscription revenue
CREATE TABLE IF NOT EXISTS public.subscription_revenue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan VARCHAR(60) NOT NULL,
    period_month DATE NOT NULL,
    active_subscribers INT DEFAULT 0,
    new_subscribers INT DEFAULT 0,
    churned_subscribers INT DEFAULT 0,
    mrr NUMERIC(14,2) DEFAULT 0,
    arr NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Subscription billing history
CREATE TABLE IF NOT EXISTS public.subscription_billing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID,
    participant_username VARCHAR(80),
    plan VARCHAR(60) NOT NULL,
    amount NUMERIC(14,2) NOT NULL,
    status VARCHAR(40) DEFAULT 'Paid' CHECK (status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
    billing_date TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    reference_id VARCHAR(150)
);

-- 13. Platform fee configuration history (immutable)
CREATE TABLE IF NOT EXISTS public.platform_fee_history (
    id BIGSERIAL PRIMARY KEY,
    fee_percentage NUMERIC(5,2) NOT NULL,
    effective_from DATE NOT NULL,
    changed_by UUID,
    reason TEXT,
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Generated financial reports
CREATE TABLE IF NOT EXISTS public.financial_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(60) NOT NULL,
    period_label VARCHAR(80) NOT NULL,
    period_start DATE,
    period_end DATE,
    data JSONB DEFAULT '{}'::jsonb,
    generated_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Financial audit logs
CREATE TABLE IF NOT EXISTS public.financial_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID,
    action VARCHAR(150) NOT NULL,
    entity_type VARCHAR(60),
    entity_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Payment reconciliation stubs (gateway-agnostic)
CREATE TABLE IF NOT EXISTS public.payment_reconciliation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES public.financial_transactions(id),
    gateway VARCHAR(60),
    gateway_reference VARCHAR(200),
    gateway_status VARCHAR(60),
    reconciled BOOLEAN DEFAULT FALSE,
    reconciled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fin_txn_participant ON public.financial_transactions(participant_id);
CREATE INDEX IF NOT EXISTS idx_fin_txn_type ON public.financial_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_fin_txn_status ON public.financial_transactions(status);
CREATE INDEX IF NOT EXISTS idx_fin_txn_created ON public.financial_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_participant ON public.wallet_ledgers(participant_id);
CREATE INDEX IF NOT EXISTS idx_withdrawal_status ON public.withdrawal_requests(status);
CREATE INDEX IF NOT EXISTS idx_refund_status ON public.refund_requests(status);

-- RLS
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledgers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_prize_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refund_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_fee_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_reconciliation ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Admins access financial_transactions" ON public.financial_transactions FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access wallet_ledgers" ON public.wallet_ledgers FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access wallet_balances" ON public.wallet_balances FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access contest_collections" ON public.contest_collections FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access prize_distribution" ON public.contest_prize_distribution FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access withdrawal_requests" ON public.withdrawal_requests FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access withdrawal_reviews" ON public.withdrawal_reviews FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access refund_requests" ON public.refund_requests FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access refund_reviews" ON public.refund_reviews FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access subscription_revenue" ON public.subscription_revenue FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access subscription_billing" ON public.subscription_billing FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access platform_fee_history" ON public.platform_fee_history FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access financial_reports" ON public.financial_reports FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access financial_audit_logs" ON public.financial_audit_logs FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Admins access payment_reconciliation" ON public.payment_reconciliation FOR ALL TO authenticated USING (TRUE);

-- Seed: Platform fee history
INSERT INTO public.platform_fee_history (fee_percentage, effective_from, reason) VALUES
    (20.00, '2025-01-01', 'Initial platform fee configuration'),
    (18.00, '2025-07-01', 'Competitive adjustment — reduced fee for growth phase')
ON CONFLICT DO NOTHING;

-- Seed: Contest collections
INSERT INTO public.contest_collections (id, contest_title, total_participants, entry_fee, gross_collection, platform_fee_pct, platform_fee_amount, prize_pool, net_profit) VALUES
    ('cc001-0000-0000-0000-000000000001', 'JEE Advanced Physics Grandmaster Challenge', 1248, 499, 622752, 18, 112095.36, 510656.64, 112095.36),
    ('cc002-0000-0000-0000-000000000002', 'NEET Biology Sprint — Season 4', 876, 299, 261924, 18, 47146.32, 214777.68, 47146.32),
    ('cc003-0000-0000-0000-000000000003', 'UPSC GK Blitz — July Edition', 432, 199, 85968, 18, 15474.24, 70493.76, 15474.24)
ON CONFLICT (id) DO NOTHING;

-- Seed: Financial transactions
INSERT INTO public.financial_transactions (id, transaction_type, amount, status, reference_id, source, destination, created_at) VALUES
    ('ft001-0000-0000-0000-000000000001', 'Prize Credit', 50000, 'Completed', 'PZ-2026-001', 'Prize Pool', 'Participant Wallet', NOW() - INTERVAL '2 days'),
    ('ft002-0000-0000-0000-000000000002', 'Contest Entry', 499, 'Completed', 'CE-2026-002', 'Participant Wallet', 'Contest Pool', NOW() - INTERVAL '5 days'),
    ('ft003-0000-0000-0000-000000000003', 'Withdrawal', 25000, 'Pending', 'WD-2026-003', 'Participant Wallet', 'Bank Account', NOW() - INTERVAL '1 hour'),
    ('ft004-0000-0000-0000-000000000004', 'Subscription', 999, 'Completed', 'SUB-2026-004', 'Participant', 'Platform', NOW() - INTERVAL '10 days'),
    ('ft005-0000-0000-0000-000000000005', 'Refund', 499, 'Pending', 'REF-2026-005', 'Platform', 'Participant Wallet', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Seed: Withdrawal requests
INSERT INTO public.withdrawal_requests (id, participant_username, amount, method, status, submitted_at) VALUES
    ('wr001-0000-0000-0000-000000000001', 'amit_sharma_98', 25000, 'Bank Transfer', 'Pending', NOW() - INTERVAL '1 hour'),
    ('wr002-0000-0000-0000-000000000002', 'priya_k_reddy', 15000, 'UPI', 'Under Review', NOW() - INTERVAL '3 hours'),
    ('wr003-0000-0000-0000-000000000003', 'rohan_verma_delhi', 8000, 'Bank Transfer', 'Approved', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Seed: Refund requests
INSERT INTO public.refund_requests (id, participant_username, contest_title, reason, amount, status, submitted_at) VALUES
    ('rf001-0000-0000-0000-000000000001', 'amit_sharma_98', 'JEE Advanced Physics Grandmaster Challenge', 'Technical issue during exam — connectivity dropped', 499, 'Pending', NOW() - INTERVAL '30 minutes'),
    ('rf002-0000-0000-0000-000000000002', 'priya_k_reddy', 'NEET Biology Sprint — Season 4', 'Duplicate payment charged', 299, 'Under Review', NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Seed: Subscription revenue (past 3 months)
INSERT INTO public.subscription_revenue (plan, period_month, active_subscribers, new_subscribers, churned_subscribers, mrr, arr) VALUES
    ('Pro', '2026-07-01', 384, 48, 12, 383616, 4603392),
    ('Basic', '2026-07-01', 892, 120, 34, 534360, 6412320),
    ('Elite', '2026-07-01', 96, 8, 2, 480000, 5760000),
    ('Pro', '2026-06-01', 348, 42, 10, 347652, 4171824),
    ('Basic', '2026-06-01', 806, 98, 28, 482790, 5793480)
ON CONFLICT DO NOTHING;
