-- Seed data for testing Contest Registration, Checkouts & Trusted Devices
-- 12_contest_registration_seed.sql

DO $$
DECLARE
  r RECORD;
  v_reg_id UUID;
  v_reg_no VARCHAR(100);
BEGIN
  FOR r IN SELECT id, username FROM profiles LOOP
    
    -- 1. Create a registration for UPSC Elite Mock
    v_reg_no := 'REG-UPSC-2026-' || UPPER(SUBSTRING(r.id::text, 1, 8));
    INSERT INTO contest_registrations (
      user_id,
      contest_id,
      registration_number,
      selected_language,
      status,
      payment_status,
      entry_fee_paid
    )
    VALUES (
      r.id,
      'upsc-elite-live',
      v_reg_no,
      'English',
      'confirmed',
      'paid',
      499.00
    )
    ON CONFLICT (user_id, contest_id) DO NOTHING
    RETURNING id INTO v_reg_id;

    -- Create associated participant credentials (seat number & reporting time)
    IF v_reg_id IS NOT NULL THEN
      INSERT INTO contest_participants (
        registration_id,
        seat_number,
        reporting_time,
        verification_status
      )
      VALUES (
        v_reg_id,
        'SEAT-UPSC-' || UPPER(SUBSTRING(r.id::text, 1, 4)),
        CURRENT_TIMESTAMP + INTERVAL '4 days',
        'pending'
      )
      ON CONFLICT DO NOTHING;

      -- Seed payment record
      INSERT INTO contest_payments (
        registration_id,
        amount,
        payment_method,
        payment_status
      )
      VALUES (
        v_reg_id,
        499.00,
        'wallet',
        'completed'
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 2. Create another registration for JEE Advanced Mock
    v_reg_id := NULL;
    v_reg_no := 'REG-JEE-2026-' || UPPER(SUBSTRING(r.id::text, 1, 8));
    INSERT INTO contest_registrations (
      user_id,
      contest_id,
      registration_number,
      selected_language,
      status,
      payment_status,
      entry_fee_paid
    )
    VALUES (
      r.id,
      'jee-advanced-live',
      v_reg_no,
      'English',
      'confirmed',
      'paid',
      349.00
    )
    ON CONFLICT (user_id, contest_id) DO NOTHING
    RETURNING id INTO v_reg_id;

    IF v_reg_id IS NOT NULL THEN
      INSERT INTO contest_participants (
        registration_id,
        seat_number,
        reporting_time,
        verification_status
      )
      VALUES (
        v_reg_id,
        'SEAT-JEE-' || UPPER(SUBSTRING(r.id::text, 1, 4)),
        CURRENT_TIMESTAMP + INTERVAL '7 days',
        'pending'
      )
      ON CONFLICT DO NOTHING;

      INSERT INTO contest_payments (
        registration_id,
        amount,
        payment_method,
        payment_status
      )
      VALUES (
        v_reg_id,
        349.00,
        'wallet',
        'completed'
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- 3. Seed a trusted device (e.g. desktop mock browser fingerprint)
    INSERT INTO trusted_devices (
      user_id,
      device_fingerprint,
      device_name,
      expires_at
    )
    VALUES (
      r.id,
      'MOCK_FINGERPRINT_123456',
      'Chrome on Windows (Trusted)',
      CURRENT_TIMESTAMP + INTERVAL '30 days'
    )
    ON CONFLICT (user_id, device_fingerprint) DO NOTHING;

  END LOOP;
END $$;
