-- Migration: Add support for multi-concept templates
-- Adds columns to track merged concepts

ALTER TABLE public.latest_concept_templates 
ADD COLUMN IF NOT EXISTS merged_concept_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS merged_concept_names TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Re-enable schema reload
NOTIFY pgrst, 'reload schema';
