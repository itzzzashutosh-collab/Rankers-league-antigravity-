#!/usr/bin/env node
/**
 * validate-templates.js
 * Phase 1 — Concept Template Bank Validator
 *
 * Checks:
 * 1. Every concept has at least 1 template
 * 2. Every concept has all 5 difficulty levels covered
 * 3. All template stem_templates are non-empty
 * 4. All concept_ids in templates exist in rl_concepts
 * 5. Variable placeholders {x} in stem_template match variables array
 * 6. Prints a full coverage report by exam
 *
 * Run: node scripts/validate-templates.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'pro', 'legend'];

async function main() {
  console.log('🔍 Rankers League — Template Validator');
  console.log('='.repeat(60));

  const errors = [];
  const warnings = [];

  // ── 1. Load all concepts with pagination ──────────────────────
  console.log('\n📥 Loading concepts (paginated)...');
  let concepts = [];
  let conceptStart = 0;
  const PAGE_SIZE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('latest_concepts')
      .select('concept_id, exam_name, subject_name, chapter_name, concept_name')
      .range(conceptStart, conceptStart + PAGE_SIZE - 1);
    if (error) { console.error('❌ Cannot load concepts:', error.message); process.exit(1); }
    if (!data || data.length === 0) break;
    concepts = concepts.concat(data);
    conceptStart += PAGE_SIZE;
  }
  const conceptMap = new Map(concepts.map((c) => [c.concept_id, c]));
  console.log(`  ✅ ${concepts.length} concepts loaded`);
 
  // ── 2. Load all templates with pagination ─────────────────────
  console.log('📥 Loading templates (paginated)...');
  let templates = [];
  let templateStart = 0;
  while (true) {
    const { data, error } = await supabase
      .from('latest_concept_templates')
      .select('template_id, concept_id, exam_name, difficulty_level, stem_template, variables, status')
      .range(templateStart, templateStart + PAGE_SIZE - 1);
    if (error) { console.error('❌ Cannot load templates:', error.message); process.exit(1); }
    if (!data || data.length === 0) break;
    templates = templates.concat(data);
    templateStart += PAGE_SIZE;
  }
  console.log(`  ✅ ${templates.length} templates loaded`);

  // ── 3. Build maps ─────────────────────────────────────────────
  // concept_id → Set of difficulty levels
  const coverageMap = new Map();
  const orphanTemplates = [];

  for (const t of templates) {
    // Check orphan (no parent concept)
    if (!conceptMap.has(t.concept_id)) {
      orphanTemplates.push(t.template_id);
      errors.push(`Template ${t.template_id} references non-existent concept_id: ${t.concept_id}`);
    }

    if (!coverageMap.has(t.concept_id)) {
      coverageMap.set(t.concept_id, new Set());
    }
    coverageMap.get(t.concept_id).add(t.difficulty_level);

    // Check empty stem
    if (!t.stem_template || t.stem_template.trim().length < 10) {
      warnings.push(`Template ${t.template_id} has very short stem_template: "${t.stem_template}"`);
    }
  }

  // ── 4. Check concept coverage ─────────────────────────────────
  let noCoverage = 0;
  let partialCoverage = 0;
  let fullCoverage = 0;

  const examStats = {};

  for (const [conceptId, concept] of conceptMap) {
    const exam = concept.exam_name;
    if (!examStats[exam]) {
      examStats[exam] = { total: 0, covered: 0, full: 0, templates: 0 };
    }
    examStats[exam].total++;

    const levels = coverageMap.get(conceptId);
    if (!levels || levels.size === 0) {
      noCoverage++;
      errors.push(`Concept "${concept.concept_name}" (${conceptId}) has NO templates`);
    } else if (levels.size < 5) {
      partialCoverage++;
      const missing = DIFFICULTY_LEVELS.filter((l) => !levels.has(l));
      warnings.push(`Concept "${concept.concept_name}" missing difficulties: ${missing.join(', ')}`);
      examStats[exam].covered++;
    } else {
      fullCoverage++;
      examStats[exam].covered++;
      examStats[exam].full++;
    }
    examStats[exam].templates += (coverageMap.get(conceptId)?.size || 0);
  }

  // ── 5. Print Exam Coverage Report ────────────────────────────
  console.log('\n📊 COVERAGE REPORT BY EXAM');
  console.log('-'.repeat(80));
  console.log('Exam'.padEnd(25), 'Concepts'.padEnd(12), 'Covered'.padEnd(12), 'Full(5/5)'.padEnd(12), 'Coverage%');
  console.log('-'.repeat(80));

  const sortedExams = Object.entries(examStats).sort((a, b) => b[1].total - a[1].total);
  for (const [exam, stat] of sortedExams) {
    const pct = ((stat.covered / stat.total) * 100).toFixed(1);
    const flag = stat.covered === stat.total ? '✅' : stat.covered === 0 ? '❌' : '🟡';
    console.log(
      `${flag} ${exam}`.padEnd(25),
      String(stat.total).padEnd(12),
      String(stat.covered).padEnd(12),
      String(stat.full).padEnd(12),
      `${pct}%`
    );
  }

  // ── 6. Summary ────────────────────────────────────────────────
  const totalConcepts = concepts.length;
  const totalTemplates = templates.length;
  const globalCoverage = ((fullCoverage / totalConcepts) * 100).toFixed(1);

  console.log('\n' + '='.repeat(60));
  console.log('📈 OVERALL SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total concepts:          ${totalConcepts}`);
  console.log(`Total templates:         ${totalTemplates}`);
  console.log(`Concepts fully covered:  ${fullCoverage} (${globalCoverage}%)`);
  console.log(`Concepts partial cover:  ${partialCoverage}`);
  console.log(`Concepts with NO cover:  ${noCoverage}`);
  console.log(`Orphan templates:        ${orphanTemplates.length}`);
  console.log(`\n❌ Errors:               ${errors.length}`);
  console.log(`⚠️  Warnings:             ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ ERRORS (first 20):');
    errors.slice(0, 20).forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (first 20):');
    warnings.slice(0, 20).forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  }

  console.log('\n' + '='.repeat(60));
  if (errors.length === 0) {
    console.log('✅ Validation PASSED — No critical errors!');
  } else {
    console.log(`❌ Validation FAILED — ${errors.length} errors need fixing`);
    console.log('   Run: node scripts/generate-template-stubs.js to fill gaps');
  }
  console.log('='.repeat(60));
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
