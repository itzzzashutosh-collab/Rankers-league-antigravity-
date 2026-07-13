# Tasks

- [x] Create database schema for unified `latest_` tables hierarchy (`38_latest_tables.sql`)
- [x] Run migrations to build the tables in Supabase
- [x] Parse and seed exams, subjects, chapters, and topics from CSV sources
- [x] Merge all 4 concept CSV files (`concepts_rows.csv`, `basic_concepts_rows.csv`, `standard_concepts_rows.csv`, `new_concept_rows.csv`) into `latest_concepts` table
  - [x] Deduplicate by ID and unique hierarchy name keys
  - [x] Verify total concepts = 8,131
- [x] Seed existing templates and auto-generate stubs (ensuring exactly 5 templates per concept)
  - [x] Total templates generated = 40,655
  - [x] Verify total templates count matches `8131 * 5 = 40,655`
- [x] Populate non-null options, answers, variables, and explanations for 100% of the templates
  - [x] Verify templates with null options = 0
- [x] Update Next.js backend API routes to query from `latest_` tables
  - [x] `latest_exams`
  - [x] `latest_concept_templates`
  - [x] `latest_template_coverage`
- [x] Create materialized view `latest_template_coverage`
- [x] Sync all modified and newly created files to `/question-template` delivery folder
- [x] Push all changes to Git remote repository
