-- Migration 08: Extend profiles with WhatsApp, coaching/school info
-- Run this in the Supabase SQL editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS whatsapp_number       TEXT,
  ADD COLUMN IF NOT EXISTS is_in_coaching        BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS coaching_name         TEXT,
  ADD COLUMN IF NOT EXISTS school_name           TEXT;

-- Add a comment for clarity
COMMENT ON COLUMN profiles.whatsapp_number  IS 'Optional WhatsApp contact number';
COMMENT ON COLUMN profiles.is_in_coaching   IS 'Whether the user is enrolled in a coaching institute';
COMMENT ON COLUMN profiles.coaching_name    IS 'Name of the coaching institute (if is_in_coaching = true)';
COMMENT ON COLUMN profiles.school_name      IS 'Name of the school/college (if is_in_coaching = false)';
