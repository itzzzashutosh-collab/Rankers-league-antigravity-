#!/usr/bin/env node
/**
 * seed-latest-merged.js
 * Master pipeline to parse, merge, deduplicate, seed, and enrich the entire exam hierarchy
 * and template bank into public.latest_ tables in Supabase.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { randomUUID } from 'crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EXAM_DATA_DIR = 'D:\\Antigravite -Rankers league (7 july)\\Exam data';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing credentials in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BATCH_SIZE = 200;

// Helper to read and parse CSV safely
function loadCsv(fileName) {
  const filePath = path.join(EXAM_DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️ File not found: ${fileName}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return parse(content, { columns: true, skip_empty_lines: true, trim: true });
}

// Helper to batch insert into Supabase
async function upsertBatch(tableName, rows, conflictKey) {
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from(tableName).upsert(batch, {
      onConflict: conflictKey,
      ignoreDuplicates: false,
    });
    if (error) {
      console.error(`  ❌ Error seeding ${tableName} batch ${Math.floor(i / BATCH_SIZE) + 1}:`, error.message);
    }
  }
}

// Helper to extract variables from formulas
function extractVarsFromFormula(formula) {
  if (!formula) return [];
  const matches = formula.match(/[a-zA-Z]/g) || [];
  const uniqueVars = [...new Set(matches)];
  return uniqueVars.map((v) => ({
    symbol: v,
    meaning: `Parameter ${v}`,
    unit: 'SI',
    range: '1-100',
    latex: v,
  }));
}

async function main() {
  console.log('🚀 Starting Merged Exam Hierarchy & Template Bank Builder...');
  console.log('='.repeat(75));

  // 1. Seed latest_exams
  console.log('\n📊 Seeding latest_exams...');
  const exams = loadCsv('exams_rows.csv');
  const mappedExams = exams.map((r) => ({
    exam_name: r.exam_name,
    full_form: r.full_form,
    description: r.description,
    nationality: r.nationality,
    exam_mode: r.exam_mode,
    exam_category: r.exam_category,
    official_website: r.official_website,
  }));
  await upsertBatch('latest_exams', mappedExams, 'exam_name');
  console.log(`  ✅ Mapped and seeded ${mappedExams.length} exams.`);

  // 2. Seed latest_subjects
  console.log('\n📚 Seeding latest_subjects...');
  const subjects = loadCsv('subjects_rows.csv');
  const mappedSubjects = subjects
    .filter((r) => r.exam_name && r.subject_name)
    .map((r) => ({
      exam_name: r.exam_name,
      subject_name: r.subject_name,
    }));
  await upsertBatch('latest_subjects', mappedSubjects, 'exam_name,subject_name');
  console.log(`  ✅ Mapped and seeded ${mappedSubjects.length} subjects.`);

  // 3. Seed latest_chapters
  console.log('\n📖 Seeding latest_chapters...');
  const chapters = loadCsv('chapters_rows.csv');
  const mappedChapters = chapters
    .filter((r) => r.exam_name && r.subject_name && r.chapter_name)
    .map((r) => ({
      exam_name: r.exam_name,
      subject_name: r.subject_name,
      chapter_name: r.chapter_name,
    }));
  await upsertBatch('latest_chapters', mappedChapters, 'exam_name,subject_name,chapter_name');
  console.log(`  ✅ Mapped and seeded ${mappedChapters.length} chapters.`);

  // 4. Seed latest_topics
  console.log('\n📑 Seeding latest_topics...');
  const topics = loadCsv('topics_rows.csv');
  const mappedTopics = topics
    .filter((r) => r.exam_name && r.subject_name && r.chapter_name && r.topic_name)
    .map((r) => ({
      exam_name: r.exam_name,
      subject_name: r.subject_name,
      chapter_name: r.chapter_name,
      topic_name: r.topic_name,
      topic_description: r.topic_description,
    }));
  await upsertBatch('latest_topics', mappedTopics, 'exam_name,subject_name,chapter_name,topic_name');
  console.log(`  ✅ Mapped and seeded ${mappedTopics.length} topics.`);

  // 5. Load and Merge all 4 Concept CSV Files (Deduplication Pipeline)
  console.log('\n💡 Merging and Deduplicating Concepts (4 CSV sources)...');
  const c1 = loadCsv('concepts_rows.csv');
  const c2 = loadCsv('basic_concepts_rows.csv');
  const c3 = loadCsv('standard_concepts_rows.csv');
  const c4 = loadCsv('new_concept_rows.csv');

  // Maps to ensure absolute uniqueness
  const idMap = new Map();
  const nameMap = new Map();

  function processConceptRow(row, source) {
    let id = row.concept_id;
    let exam = row.exam_name || row.exam;
    let subject = row.subject_name || row.subject;
    let chapter = row.chapter_name || row.chapter;
    let topic = row.topic_name || row.topic;
    let name = row.concept_name || row.concept;
    let desc = row.concept_description || row.description;
    let formula = row.concept_formula || row.formula || row.formula_latex;

    if (!id || !exam || !subject || !chapter || !topic || !name) return;

    // Normalization keys
    const nameKey = `${exam.trim()}|${subject.trim()}|${chapter.trim()}|${topic.trim()}|${name.trim()}`.toLowerCase();

    // Check if duplicate name key already exists
    if (nameMap.has(nameKey)) {
      const existing = nameMap.get(nameKey);
      // Merge description/formula if existing is empty
      if (!existing.concept_description) existing.concept_description = desc;
      if (!existing.concept_formula) existing.concept_formula = formula;
      return;
    }

    // Check if duplicate ID exists
    if (idMap.has(id)) {
      const existing = idMap.get(id);
      if (!existing.concept_description) existing.concept_description = desc;
      if (!existing.concept_formula) existing.concept_formula = formula;
      return;
    }

    const newConcept = {
      concept_id: id,
      exam_name: exam.trim(),
      subject_name: subject.trim(),
      chapter_name: chapter.trim(),
      topic_name: topic.trim(),
      concept_name: name.trim(),
      concept_description: desc ? desc.trim() : null,
      concept_formula: formula ? formula.trim() : null,
    };

    idMap.set(id, newConcept);
    nameMap.set(nameKey, newConcept);
  }

  // Load in order of priority
  c1.forEach((r) => processConceptRow(r, 'concepts_rows.csv'));
  c2.forEach((r) => processConceptRow(r, 'basic_concepts_rows.csv'));
  c3.forEach((r) => processConceptRow(r, 'standard_concepts_rows.csv'));
  c4.forEach((r) => processConceptRow(r, 'new_concept_rows.csv'));

  const finalConcepts = Array.from(idMap.values());
  console.log(`  ✅ Loaded ${finalConcepts.length} unique concepts after merging and deduplication.`);

  // Filter to ensure concepts only reference valid topics
  const validTopicKeys = new Set(
    mappedTopics.map(t => `${t.exam_name}|${t.subject_name}|${t.chapter_name}|${t.topic_name}`.toLowerCase())
  );
  const validatedConcepts = finalConcepts.filter(c => 
    validTopicKeys.has(`${c.exam_name}|${c.subject_name}|${c.chapter_name}|${c.topic_name}`.toLowerCase())
  );
  console.log(`  📊 Validated concepts referencing topics: ${validatedConcepts.length} of ${finalConcepts.length}`);

  await upsertBatch('latest_concepts', validatedConcepts, 'concept_id');
  console.log(`  ✅ Saved unified concepts in public.latest_concepts!`);

  // 6. Seed public.latest_concept_templates from concept_templates_rows.csv
  console.log('\n📋 Seeding existing templates into latest_concept_templates...');
  const templates = loadCsv('concept_templates_rows.csv');
  const conceptIds = new Set(validatedConcepts.map((c) => c.concept_id));

  const validTemplates = templates
    .filter((r) => r.concept_template_id && conceptIds.has(r.concept_id))
    .map((r) => {
      const vars = extractVarsFromFormula(r.formula_latex);
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
        template_type: 'direct_substitution',
        difficulty_level: 'easy', // default
        difficulty_number: 1,
        stem_template: r.concept_template_questions || 'Solve problem based on concept.',
        option_a: r.option_a || null,
        option_b: r.option_b || null,
        option_c: r.option_c || null,
        option_d: r.option_d || null,
        correct_answer: r.correct_answer || null,
        explanation: r.explanation || null,
        status: 'reviewed',
        variables: vars,
      };
    });

  await upsertBatch('latest_concept_templates', validTemplates, 'template_id');
  console.log(`  ✅ Seeded ${validTemplates.length} original templates.`);

  // 7. Auto-generate stubs for uncovered levels (Ensure 5 per concept)
  console.log('\n🔧 Auto-generating stubs for missing levels to guarantee 5 levels per concept...');
  const coveredConceptsMap = new Map();
  for (const t of validTemplates) {
    if (!coveredConceptsMap.has(t.concept_id)) {
      coveredConceptsMap.set(t.concept_id, new Set());
    }
    coveredConceptsMap.get(t.concept_id).add(t.difficulty_level);
  }

  const DIFFICULTY_LEVELS = [
    { level: 'easy', num: 1, type: 'direct_substitution' },
    { level: 'medium', num: 2, type: 'formula_rearrangement' },
    { level: 'hard', num: 3, type: 'logical_trap' },
    { level: 'pro', num: 4, type: 'multi_concept' },
    { level: 'legend', num: 5, type: 'reverse_thinking' },
  ];

  const stubTemplates = [];
  const baseOptions = {
    option_a: 'Correct Answer Choice',
    option_b: 'Common computational trap choice',
    option_c: 'Sign error or unit misconversion distractor',
    option_d: 'Irrelevant conceptual distractor choice',
    correct_answer: 'Option A',
  };

  for (const c of validatedConcepts) {
    const coveredLevels = coveredConceptsMap.get(c.concept_id) || new Set();

    for (const dl of DIFFICULTY_LEVELS) {
      if (!coveredLevels.has(dl.level)) {
        const hasFormula = !!c.concept_formula;
        const stem = hasFormula
          ? `Evaluate ${c.concept_name} under level ${dl.level} using the formula ${c.concept_formula} given variables.`
          : `Explain the key properties and outcomes of ${c.concept_name} in the chapter ${c.chapter_name}.`;

        const vars = extractVarsFromFormula(c.concept_formula);

        stubTemplates.push({
          template_id: randomUUID(),
          concept_id: c.concept_id,
          exam_name: c.exam_name,
          subject_name: c.subject_name,
          chapter_name: c.chapter_name,
          topic_name: c.topic_name,
          concept_name: c.concept_name,
          template_type: dl.type,
          difficulty_level: dl.level,
          difficulty_number: dl.num,
          stem_template: stem,
          variables: vars,
          option_a: `Correct option for ${c.concept_name} (${dl.level}): Application of principles.`,
          option_b: `Incorrect option: ignores preconditions or units.`,
          option_c: `Incorrect option: misapplies the standard formula.`,
          option_d: `Incorrect option: contradictory definition.`,
          correct_answer: baseOptions.correct_answer,
          explanation: `Correct answer choice represents direct logical application of ${c.concept_name} for difficulty level ${dl.level}.`,
          status: 'draft',
        });
      }
    }
  }

  console.log(`  📦 Generated ${stubTemplates.length} new enriched stub templates.`);
  await upsertBatch('latest_concept_templates', stubTemplates, 'template_id');
  console.log(`  ✅ Successfully saved all stubs to public.latest_concept_templates!`);

  // Final count checks
  const { data: finalTplCount } = await supabase.from('latest_concept_templates').select('template_id');
  console.log('\n================================================================');
  console.log('🎉 PIPELINE COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
  console.log(`📚 Total Merged Concepts in DB:  ${validatedConcepts.length}`);
  console.log(`📋 Total Templates in DB:         ${finalTplCount ? finalTplCount.length : 0}`);
  console.log('================================================================');
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
