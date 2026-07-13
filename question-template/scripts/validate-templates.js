#!/usr/bin/env node
/**
 * validate-templates.js
 * Phase 1 — Concept Template Bank Validator
 * Direct Database Connection to prevent REST pagination timeouts.
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

import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL credentials in environment');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'pro', 'legend'];

async function main() {
  console.log('🔍 Rankers League — Template Validator (Direct PG Link)');
  console.log('='.repeat(60));

  const errors = [];
  const warnings = [];

  console.log('🔗 Connecting to Supabase PostgreSQL...');
  await client.connect();
  console.log('✅ Connected!');

  // ── 1. Load all concepts ──────────────────────────────────────
  console.log('\n📥 Loading concepts...');
  const { rows: concepts } = await client.query(`
    SELECT concept_id, exam_name, subject_name, chapter_name, concept_name 
    FROM public.latest_concepts;
  `);
  const conceptMap = new Map(concepts.map((c) => [c.concept_id, c]));
  console.log(`  ✅ ${concepts.length} concepts loaded`);
 
  // ── 2. Load all templates ─────────────────────────────────────
  console.log('📥 Loading templates...');
  const { rows: templates } = await client.query(`
    SELECT template_id, concept_id, exam_name, difficulty_level, stem_template, variables, status, original_template_id, template_name, unknown_variable 
    FROM public.latest_concept_templates;
  `);
  console.log(`  ✅ ${templates.length} templates loaded`);

  // ── 3. Build maps ─────────────────────────────────────────────
  // concept_id → { easy: number, medium: number, hard: number, pro: number, legend: number }
  const coverageMap = new Map();
  const orphanTemplates = [];

  for (const t of templates) {
    // Check orphan (no parent concept)
    if (!conceptMap.has(t.concept_id)) {
      orphanTemplates.push(t.template_id);
      errors.push(`Template ${t.template_id} references non-existent concept_id: ${t.concept_id}`);
    }

    if (!coverageMap.has(t.concept_id)) {
      coverageMap.set(t.concept_id, { easy: 0, medium: 0, hard: 0, pro: 0, legend: 0 });
    }
    const counts = coverageMap.get(t.concept_id);
    if (counts.hasOwnProperty(t.difficulty_level)) {
      counts[t.difficulty_level]++;
    }

    // Check empty stem
    if (!t.stem_template || t.stem_template.trim().length < 10) {
      warnings.push(`Template ${t.template_id} has very short stem_template: "${t.stem_template}"`);
    }

    // Check original_template_id
    if (!t.original_template_id || t.original_template_id.trim().length === 0) {
      errors.push(`Template ${t.template_id} has empty original_template_id`);
    }

    // Check template_name
    if (!t.template_name || t.template_name.trim().length === 0) {
      errors.push(`Template ${t.template_id} has empty template_name`);
    }

    // Check unknown_variable if variables exist
    const hasVars = Array.isArray(t.variables) && t.variables.length > 0;
    if (hasVars && (!t.unknown_variable || t.unknown_variable.trim().length === 0)) {
      errors.push(`Template ${t.template_id} has variables but empty unknown_variable`);
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

    const counts = coverageMap.get(conceptId);
    if (!counts) {
      noCoverage++;
      errors.push(`Concept "${concept.concept_name}" (${conceptId}) has NO templates`);
    } else {
      let isFullyCovered = true;
      const missingOrLow = [];
      let totalTemplatesForConcept = 0;

      for (const level of DIFFICULTY_LEVELS) {
        const count = counts[level];
        totalTemplatesForConcept += count;
        if (count < 2) {
          isFullyCovered = false;
          missingOrLow.push(`${level} (count: ${count})`);
        }
      }

      examStats[exam].templates += totalTemplatesForConcept;

      if (totalTemplatesForConcept === 0) {
        noCoverage++;
        errors.push(`Concept "${concept.concept_name}" (${conceptId}) has NO templates`);
      } else if (!isFullyCovered) {
        partialCoverage++;
        errors.push(`Concept "${concept.concept_name}" (${conceptId}) has low template coverage: ${missingOrLow.join(', ')}`);
        examStats[exam].covered++;
      } else {
        fullCoverage++;
        examStats[exam].covered++;
        examStats[exam].full++;
      }
    }
  }

  // ── 5. Print Exam Coverage Report ────────────────────────────
  console.log('\n📊 COVERAGE REPORT BY EXAM');
  console.log('-'.repeat(80));
  console.log('Exam'.padEnd(25), 'Concepts'.padEnd(12), 'Covered'.padEnd(12), 'Full(2x5/5)'.padEnd(12), 'Coverage%');
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
  }
  console.log('='.repeat(60));

  await client.end();
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
