-- Alter profiles table to add phone_number column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
