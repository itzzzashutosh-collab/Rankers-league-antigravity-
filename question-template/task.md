# Phase 1 — Concept Template Bank Tasks

## Step 1 — Analysis & Setup
- [x] Read all 9 CSV files and understand schema
- [x] Identify coverage gap (6,867 concepts with 0 templates)
- [x] Understand existing backend/DB structure

## Step 2 — Database Migrations
- [x] `001_concept_template_bank.sql` — master template table
- [x] `002_formula_metadata.sql` — formula metadata table
- [x] `003_template_variations.sql` — variations table
- [x] Run migrations against Supabase

## Step 3 — Seeding Scripts
- [x] `seed-concept-template-bank.js` — import existing 6,195 templates
- [x] `generate-template-stubs.js` — create stubs for 6,867 uncovered concepts
- [x] `validate-templates.js` — quality check all templates
- [x] Run seeds and verify row counts

## Step 4 — Admin Panel UI
- [x] Template Bank Dashboard page
- [x] Per-exam template view
- [x] Concept Template Editor (with LaTeX preview)
- [x] Coverage heatmap component

## Step 5 — API Routes
- [x] GET /api/concept-templates (filtered list)
- [x] GET/PUT/DELETE /api/concept-templates/[id]
- [x] GET /api/concept-templates/coverage
- [x] POST /api/concept-templates/validate

## Step 6 — Frontend Browse View
- [x] /concept-bank page (exam grid)
- [x] /concept-bank/[examId] page
- [x] /concept-bank/[conceptId] page with KaTeX

## Step 7 — Git Commit & Push
- [x] Commit all changes
- [x] Push to GitHub
