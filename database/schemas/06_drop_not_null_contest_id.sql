-- Alter contest_enrollments to make contest_id nullable
ALTER TABLE contest_enrollments ALTER COLUMN contest_id DROP NOT NULL;
