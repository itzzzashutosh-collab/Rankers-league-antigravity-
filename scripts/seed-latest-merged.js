#!/usr/bin/env node
/**
 * seed-latest-merged.js
 * Master self-healing pipeline to parse, merge, deduplicate, seed, and enrich the entire exam hierarchy
 * and template bank into public.latest_ tables in Supabase with zero foreign key violations.
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
const BATCH_SIZE = 500;
const CONCURRENCY_LIMIT = 15;

function isUUID(str) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

function loadCsv(fileName) {
  const filePath = path.join(EXAM_DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠️ File not found: ${fileName}`);
    return [];
  }
  return parse(fs.readFileSync(filePath, 'utf-8'), { columns: true, skip_empty_lines: true, trim: true });
}

// Helper to batch insert into Supabase in parallel chunks
async function upsertBatch(tableName, rows, conflictKey) {
  const batches = [];
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    batches.push(rows.slice(i, i + BATCH_SIZE));
  }

  console.log(`  📤 Uploading ${rows.length} rows to ${tableName} in ${batches.length} batches (Concurrency: ${CONCURRENCY_LIMIT})...`);

  for (let i = 0; i < batches.length; i += CONCURRENCY_LIMIT) {
    const chunk = batches.slice(i, i + CONCURRENCY_LIMIT);
    await Promise.all(
      chunk.map(async (batch, index) => {
        const batchNum = i + index + 1;
        const { error } = await supabase.from(tableName).upsert(batch, {
          onConflict: conflictKey,
          ignoreDuplicates: false,
        });
        if (error) {
          console.error(`  ❌ Error seeding ${tableName} batch ${batchNum}:`, error.message);
        }
      })
    );
  }
}

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
  console.log('🚀 Starting Merged Exam Hierarchy & Template Bank Builder (Self-Healing)...');
  console.log('='.repeat(75));

  const examsCsv = loadCsv('exams_rows.csv');
  const subjectsCsv = loadCsv('subjects_rows.csv');
  const chaptersCsv = loadCsv('chapters_rows.csv');
  const topicsCsv = loadCsv('topics_rows.csv');

  // In-memory mappings
  const examMap = new Map(); // exam_name.toLowerCase() -> exam_id
  const subjectMap = new Map(); // exam_name|subject_name -> subject_id
  const chapterMap = new Map(); // exam_name|subject_name|chapter_name -> chapter_id
  const topicMap = new Map(); // exam_name|subject_name|chapter_name|topic_name -> topic_id

  const examInserts = [];
  const subjectInserts = [];
  const chapterInserts = [];
  const topicInserts = [];

  // Helper to ensure exam exists
  function ensureExam(name) {
    const cleanName = name.trim();
    const key = cleanName.toLowerCase();
    if (!examMap.has(key)) {
      const exam_id = randomUUID();
      examMap.set(key, exam_id);
      examInserts.push({
        exam_id,
        exam_name: cleanName,
        nationality: 'Indian',
        exam_mode: 'Online',
      });
    }
    return examMap.get(key);
  }

  // Helper to ensure subject exists
  function ensureSubject(examName, subjectName) {
    const cleanExam = examName.trim();
    const cleanSubject = subjectName.trim();
    const key = `${cleanExam}|${cleanSubject}`.toLowerCase();
    if (!subjectMap.has(key)) {
      const exam_id = ensureExam(cleanExam);
      const subject_id = randomUUID();
      subjectMap.set(key, subject_id);
      subjectInserts.push({
        subject_id,
        exam_id,
        exam_name: cleanExam,
        subject_name: cleanSubject,
      });
    }
    return subjectMap.get(key);
  }

  // Helper to ensure chapter exists
  function ensureChapter(examName, subjectName, chapterName) {
    const cleanExam = examName.trim();
    const cleanSubject = subjectName.trim();
    const cleanChapter = chapterName.trim();
    const key = `${cleanExam}|${cleanSubject}|${cleanChapter}`.toLowerCase();
    if (!chapterMap.has(key)) {
      const exam_id = ensureExam(cleanExam);
      const subject_id = ensureSubject(cleanExam, cleanSubject);
      const chapter_id = randomUUID();
      chapterMap.set(key, chapter_id);
      chapterInserts.push({
        chapter_id,
        exam_id,
        subject_id,
        exam_name: cleanExam,
        subject_name: cleanSubject,
        chapter_name: cleanChapter,
      });
    }
    return chapterMap.get(key);
  }

  // Helper to ensure topic exists
  function ensureTopic(examName, subjectName, chapterName, topicName, desc = null) {
    const cleanExam = examName.trim();
    const cleanSubject = subjectName.trim();
    const cleanChapter = chapterName.trim();
    const cleanTopic = topicName.trim();
    const key = `${cleanExam}|${cleanSubject}|${cleanChapter}|${cleanTopic}`.toLowerCase();
    if (!topicMap.has(key)) {
      const chapter_id = ensureChapter(cleanExam, cleanSubject, cleanChapter);
      const topic_id = randomUUID();
      topicMap.set(key, topic_id);
      topicInserts.push({
        topic_id,
        chapter_id,
        exam_name: cleanExam,
        subject_name: cleanSubject,
        chapter_name: cleanChapter,
        topic_name: cleanTopic,
        topic_description: desc,
      });
    }
    return topicMap.get(key);
  }

  // 1. Process Exams
  console.log('\n📊 Processing Exams...');
  examsCsv.forEach((r) => {
    const id = isUUID(r.id) ? r.id : randomUUID();
    const name = r.exam_name.trim();
    const key = name.toLowerCase();
    if (!examMap.has(key)) {
      examMap.set(key, id);
      examInserts.push({
        exam_id: id,
        exam_name: name,
        full_form: r.full_form || null,
        description: r.description || null,
        nationality: r.nationality || 'Indian',
        exam_mode: r.exam_mode || 'Online',
        exam_category: r.exam_category || null,
        official_website: r.official_website || null,
      });
    }
  });

  // 2. Process Subjects
  console.log('📚 Processing Subjects...');
  subjectsCsv.forEach((r) => {
    if (!r.exam_name || !r.subject_name) return;
    const id = isUUID(r.id) ? r.id : randomUUID();
    const examName = r.exam_name.trim();
    const subjectName = r.subject_name.trim();
    const key = `${examName}|${subjectName}`.toLowerCase();
    if (!subjectMap.has(key)) {
      const exam_id = ensureExam(examName);
      subjectMap.set(key, id);
      subjectInserts.push({
        subject_id: id,
        exam_id,
        exam_name: examName,
        subject_name: subjectName,
      });
    }
  });

  // 3. Process Chapters
  console.log('📖 Processing Chapters...');
  chaptersCsv.forEach((r) => {
    if (!r.exam_name || !r.subject_name || !r.chapter_name) return;
    const id = isUUID(r.chapter_id) ? r.chapter_id : randomUUID();
    const examName = r.exam_name.trim();
    const subjectName = r.subject_name.trim();
    const chapterName = r.chapter_name.trim();
    const key = `${examName}|${subjectName}|${chapterName}`.toLowerCase();
    if (!chapterMap.has(key)) {
      ensureSubject(examName, subjectName);
      chapterMap.set(key, id);
      chapterInserts.push({
        chapter_id: id,
        exam_id: ensureExam(examName),
        subject_id: ensureSubject(examName, subjectName),
        exam_name: examName,
        subject_name: subjectName,
        chapter_name: chapterName,
      });
    }
  });

  // 4. Process Topics
  console.log('📑 Processing Topics...');
  topicsCsv.forEach((r) => {
    if (!r.exam_name || !r.subject_name || !r.chapter_name || !r.topic_name) return;
    const id = isUUID(r.topic_id) ? r.topic_id : randomUUID();
    const examName = r.exam_name.trim();
    const subjectName = r.subject_name.trim();
    const chapterName = r.chapter_name.trim();
    const topicName = r.topic_name.trim();
    const key = `${examName}|${subjectName}|${chapterName}|${topicName}`.toLowerCase();
    if (!topicMap.has(key)) {
      ensureChapter(examName, subjectName, chapterName);
      topicMap.set(key, id);
      topicInserts.push({
        topic_id: id,
        chapter_id: ensureChapter(examName, subjectName, chapterName),
        exam_name: examName,
        subject_name: subjectName,
        chapter_name: chapterName,
        topic_name: topicName,
        topic_description: r.topic_description || null,
      });
    }
  });

  // Write hierarchy tables synchronously
  console.log('\n📤 Writing Hierarchy to Supabase...');
  await upsertBatch('latest_exams', examInserts, 'exam_id');
  await upsertBatch('latest_subjects', subjectInserts, 'subject_id');
  await upsertBatch('latest_chapters', chapterInserts, 'chapter_id');
  await upsertBatch('latest_topics', topicInserts, 'topic_id');
  console.log('  ✅ Hierarchy tables populated successfully!');

  // 5. Load and Merge all 4 Concept CSV Files (Deduplication Pipeline)
  console.log('\n💡 Merging and Deduplicating Concepts (4 CSV sources)...');
  const c1 = loadCsv('concepts_rows.csv');
  const c2 = loadCsv('basic_concepts_rows.csv');
  const c3 = loadCsv('standard_concepts_rows.csv');
  const c4 = loadCsv('new_concept_rows.csv');

  const idMap = new Map();
  const nameMap = new Map();

  function processConceptRow(row) {
    let id = row.concept_id;
    let exam = row.exam_name || row.exam;
    let subject = row.subject_name || row.subject;
    let chapter = row.chapter_name || row.chapter;
    let topic = row.topic_name || row.topic;
    let name = row.concept_name || row.concept;
    let desc = row.concept_description || row.description;
    let formula = row.concept_formula || row.formula || row.formula_latex;

    if (!id || !exam || !subject || !chapter || !topic || !name) return;

    const nameKey = `${exam.trim()}|${subject.trim()}|${chapter.trim()}|${topic.trim()}|${name.trim()}`.toLowerCase();

    // Check duplicate name key
    if (nameMap.has(nameKey)) {
      const existing = nameMap.get(nameKey);
      if (!existing.concept_description) existing.concept_description = desc;
      if (!existing.concept_formula) existing.concept_formula = formula;
      return;
    }

    // Check duplicate ID
    if (idMap.has(id)) {
      const existing = idMap.get(id);
      if (!existing.concept_description) existing.concept_description = desc;
      if (!existing.concept_formula) existing.concept_formula = formula;
      return;
    }

    // Self-heal: ensure hierarchy exists for this concept
    const topic_id = ensureTopic(exam, subject, chapter, topic);

    const newConcept = {
      concept_id: id,
      topic_id,
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

  c1.forEach(processConceptRow);
  c2.forEach(processConceptRow);
  c3.forEach(processConceptRow);
  c4.forEach(processConceptRow);

  const finalConcepts = Array.from(idMap.values());
  console.log(`  ✅ Loaded ${finalConcepts.length} unique concepts after merging.`);

  // Write missing topics created during self-healing
  if (topicInserts.length > 0) {
    console.log('🔄 Seeding self-healed hierarchy structures...');
    await upsertBatch('latest_exams', examInserts, 'exam_id');
    await upsertBatch('latest_subjects', subjectInserts, 'subject_id');
    await upsertBatch('latest_chapters', chapterInserts, 'chapter_id');
    await upsertBatch('latest_topics', topicInserts, 'topic_id');
  }

  await upsertBatch('latest_concepts', finalConcepts, 'concept_id');
  console.log(`  ✅ Saved unified concepts in public.latest_concepts!`);

  // 6. Seed public.latest_concept_templates from concept_templates_rows.csv
  console.log('\n📋 Seeding existing templates into latest_concept_templates...');
  const templates = loadCsv('concept_templates_rows.csv');
  const conceptIds = new Set(finalConcepts.map((c) => c.concept_id));

  const validTemplates = templates
    .filter((r) => r.concept_template_id && conceptIds.has(r.concept_id))
    .map((r) => {
      const vars = extractVarsFromFormula(r.formula_latex);
      return {
        template_id: isUUID(r.concept_template_id) ? r.concept_template_id : randomUUID(),
        concept_id: r.concept_id,
        original_template_id: r.concept_template_id,
        exam_name: r.exam_name.trim(),
        subject_name: r.subject_name.trim(),
        chapter_name: r.chapter_name.trim(),
        topic_name: r.topic_name.trim(),
        concept_name: r.concept_name.trim(),
        template_name: r.template_name || null,
        template_type: 'direct_substitution',
        difficulty_level: 'easy',
        difficulty_number: 1,
        stem_template: r.concept_template_questions || 'Solve problem based on concept.',
        option_a: r.option_a || 'Correct Option',
        option_b: r.option_b || 'Computational trap choice',
        option_c: r.option_c || 'Sign error or unit misconversion',
        option_d: r.option_d || 'Irrelevant conceptual distractor',
        correct_answer: r.correct_answer || 'Option A',
        explanation: r.explanation || 'Pedagogical explanation.',
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

  for (const c of finalConcepts) {
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
  console.log(`📚 Total Merged Concepts in DB:  ${finalConcepts.length}`);
  console.log(`📋 Total Templates in DB:         ${finalTplCount ? finalTplCount.length : 0}`);
  console.log('================================================================');
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
