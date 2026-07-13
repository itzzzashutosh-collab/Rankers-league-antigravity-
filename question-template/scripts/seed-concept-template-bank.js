#!/usr/bin/env node
/**
 * seed-concept-template-bank.js
 * Phase 1 — Concept Template Bank Seeder
 *
 * Reads all 9 CSV files from the Exam Data folder and seeds:
 *   1. rl_exams (36 rows)
 *   2. rl_subjects (295 rows)
 *   3. rl_chapters (535 rows)
 *   4. rl_topics (3,039 rows)
 *   5. rl_concepts (8,144 rows — from basic_concepts_rows.csv as master)
 *   6. rl_concept_templates (6,195 rows — from concept_templates_rows.csv)
 *
 * Run: node scripts/seed-concept-template-bank.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Supabase Client ─────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── Config ──────────────────────────────────────────────────────────────────
const EXAM_DATA_DIR = 'D:\\Antigravite -Rankers league (7 july)\\Exam data';
const BATCH_SIZE = 100; // Supabase upsert batch size

// ─── Helpers ─────────────────────────────────────────────────────────────────
function readCSV(filename) {
  const filepath = path.join(EXAM_DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️  File not found: ${filename} — skipping`);
    return [];
  }
  const content = fs.readFileSync(filepath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true,
    trim: true,
  });
}

function parseJsonArray(val) {
  if (!val || val === '' || val === '[]') return [];
  try {
    // Handle CSV-escaped JSON like ["a","b"]
    const cleaned = val.replace(/""/g, '"').replace(/^"|"$/g, '');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

async function upsertBatch(table, rows, conflictColumn = 'id') {
  if (rows.length === 0) return;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase
      .from(table)
      .upsert(batch, { onConflict: conflictColumn, ignoreDuplicates: false });
    if (error) {
      console.error(`  ❌ Error upserting into ${table} (batch ${i / BATCH_SIZE + 1}):`, error.message);
    } else {
      process.stdout.write(`  ✓ ${table}: upserted rows ${i + 1}–${Math.min(i + BATCH_SIZE, rows.length)}\r`);
    }
  }
  console.log(`  ✅ ${table}: ${rows.length} rows done`);
}

// ─── Step 1: Seed Exams ───────────────────────────────────────────────────────
async function seedExams() {
  console.log('\n📚 [1/6] Seeding rl_exams...');
  const rows = readCSV('exams_rows.csv');
  const mapped = rows.map((r) => ({
    exam_id: r.id,
    exam_name: r.exam_name,
    full_form: r.full_form || null,
    description: r.description || null,
    nationality: r.nationality || 'Indian',
    exam_mode: r.exam_mode || 'Online',
    exam_category: r.exam_category || null,
    official_website: r.official_website || null,
    subjects: parseJsonArray(r.subjects),
    created_at: r.created_at || new Date().toISOString(),
  }));
  await upsertBatch('rl_exams', mapped, 'exam_id');
  return mapped.length;
}

// ─── Step 2: Seed Subjects ────────────────────────────────────────────────────
async function seedSubjects() {
  console.log('\n📖 [2/6] Seeding rl_subjects...');
  const rows = readCSV('subjects_rows.csv');
  const mapped = rows.map((r) => ({
    subject_id: r.id,
    exam_id: r.exam_id,
    exam_name: r.exam_name,
    subject_name: r.subject_name,
    chapter_count: parseInt(r.chapter_count) || 0,
    chapters_list: parseJsonArray(r.chapters_list),
    created_at: r.created_at || new Date().toISOString(),
  }));
  await upsertBatch('rl_subjects', mapped, 'subject_id');
  return mapped.length;
}

// ─── Step 3: Seed Chapters ────────────────────────────────────────────────────
async function seedChapters() {
  console.log('\n📑 [3/6] Seeding rl_chapters...');
  const rows = readCSV('chapters_rows.csv');
  const mapped = rows.map((r) => ({
    chapter_id: r.chapter_id,
    exam_id: r.exam_id,
    subject_id: r.subject_id,
    exam_name: r.exam_name,
    subject_name: r.subject_name,
    chapter_name: r.chapter_name,
    topic_count: parseInt(r.topic_count) || 0,
    topics_list: parseJsonArray(r.topics_list),
    created_at: r.created_at || new Date().toISOString(),
  }));
  await upsertBatch('rl_chapters', mapped, 'chapter_id');
  return mapped.length;
}

// ─── Step 4: Seed Topics ──────────────────────────────────────────────────────
async function seedTopics() {
  console.log('\n🗂️  [4/6] Seeding rl_topics...');
  const rows = readCSV('topics_rows.csv');
  const mapped = rows.map((r) => ({
    topic_id: r.topic_id,
    exam_name: r.exam_name,
    subject_name: r.subject_name,
    chapter_name: r.chapter_name,
    topic_name: r.topic_name,
    topic_description: r.topic_description || null,
    concept_count: parseInt(r.concept_count) || 0,
    concepts_list: parseJsonArray(r.concepts_list),
  }));
  await upsertBatch('rl_topics', mapped, 'topic_id');
  return mapped.length;
}

// ─── Step 5: Seed Concepts (master from basic_concepts_rows.csv) ─────────────
async function seedConcepts() {
  console.log('\n💡 [5/6] Seeding rl_concepts (master source: basic_concepts_rows.csv)...');
  const rows = readCSV('basic_concepts_rows.csv');

  // Also load standard_concepts for weightage data (JEE Main only)
  const stdRows = readCSV('standard_concepts_rows.csv');
  const weightageMap = {};
  for (const r of stdRows) {
    weightageMap[r.concept_id] = parseFloat(r.exam_weightage_percent) || 0;
  }

  const mapped = rows.map((r) => ({
    concept_id: r.concept_id,
    exam_name: r.exam_name,
    subject_name: r.subject_name,
    chapter_name: r.chapter_name,
    topic_name: r.topic_name,
    concept_name: r.concept_name,
    concept_description: r.concept_description || null,
    concept_formula: r.formula || r.concept_formula || null,
    concept_difficulty: 'Medium',
    concept_mergable: r.is_mixable === 'true' || r.concept_mergable === 'true',
    mergable_with: parseJsonArray(r.mixed_with || r.mergable_with),
    is_mixable: r.is_mixable === 'true',
    mixed_with: parseJsonArray(r.mixed_with),
    mixed_with_ids: parseJsonArray(r.mixed_with_ids),
    exam_weightage_percent: weightageMap[r.concept_id] || 0,
    created_at: r.created_at || new Date().toISOString(),
  }));

  // Deduplicate by concept_id (master wins)
  const seen = new Set();
  const deduped = mapped.filter((r) => {
    if (seen.has(r.concept_id)) return false;
    seen.add(r.concept_id);
    return true;
  });

  await upsertBatch('rl_concepts', deduped, 'concept_id');
  return deduped.length;
}

// ─── Step 6: Seed Concept Templates ──────────────────────────────────────────
async function seedTemplates() {
  console.log('\n📋 [6/6] Seeding rl_concept_templates (from concept_templates_rows.csv)...');
  const rows = readCSV('concept_templates_rows.csv');

  // Map contest_level to our 5-level system
  const difficultyMap = {
    easy: { level: 'easy', num: 1 },
    medium: { level: 'medium', num: 2 },
    hard: { level: 'hard', num: 3 },
    pro: { level: 'pro', num: 4 },
    legend: { level: 'legend', num: 5 },
  };

  const mapped = rows.map((r) => {
    const diff = difficultyMap[r.contest_level?.toLowerCase()] || { level: 'medium', num: 2 };
    return {
      template_id: randomUUID(),
      concept_id: r.concept_id,
      original_template_id: r.concept_template_id,
      exam_name: r.exam_name,
      subject_name: r.subject_name,
      chapter_name: r.chapter_name,
      topic_name: r.topic_name,
      concept_name: r.concept_name,
      template_name: r.template_name || null,
      template_type: r.question_type || 'hyper_local_daily_life',
      difficulty_level: diff.level,
      difficulty_number: diff.num,
      stem_template: r.concept_template_questions || '',
      option_a: r.option_a || null,
      option_b: r.option_b || null,
      option_c: r.option_c || null,
      option_d: r.option_d || null,
      correct_answer: r.correct_answer || null,
      explanation: r.explanation || null,
      status: 'reviewed',     // existing templates are considered reviewed
      created_at: r.created_at || new Date().toISOString(),
    };
  });

  await upsertBatch('rl_concept_templates', mapped, 'template_id');
  return mapped.length;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Rankers League — Concept Template Bank Seeder');
  console.log('='.repeat(55));
  console.log(`📁 Exam Data Dir: ${EXAM_DATA_DIR}`);
  console.log(`🗄️  Supabase URL: ${SUPABASE_URL}`);
  console.log('='.repeat(55));

  const startTime = Date.now();
  const results = {};

  try {
    results.exams = await seedExams();
    results.subjects = await seedSubjects();
    results.chapters = await seedChapters();
    results.topics = await seedTopics();
    results.concepts = await seedConcepts();
    results.templates = await seedTemplates();

    // Refresh coverage materialized view
    console.log('\n🔄 Refreshing coverage materialized view...');
    const { error: viewErr } = await supabase.rpc('refresh_template_coverage');
    if (viewErr) {
      // View refresh via RPC may not be needed — fallback SQL
      console.log('  ℹ️  Run manually: REFRESH MATERIALIZED VIEW public.rl_template_coverage;');
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n' + '='.repeat(55));
    console.log('✅ SEEDING COMPLETE');
    console.log('='.repeat(55));
    console.log('📊 Summary:');
    Object.entries(results).forEach(([k, v]) => console.log(`  ${k.padEnd(15)} → ${v} rows`));
    console.log(`⏱️  Total time: ${elapsed}s`);
    console.log('\n📌 Next steps:');
    console.log('  node scripts/generate-template-stubs.js   — create stubs for uncovered concepts');
    console.log('  node scripts/validate-templates.js         — quality check all templates');
    console.log('='.repeat(55));
  } catch (err) {
    console.error('\n❌ Fatal error during seeding:', err);
    process.exit(1);
  }
}

main();
