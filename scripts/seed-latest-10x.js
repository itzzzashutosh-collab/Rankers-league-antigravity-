#!/usr/bin/env node
/**
 * seed-latest-10x.js
 * Expanded self-healing pipeline to parse, merge, deduplicate, seed, and enrich the exam hierarchy.
 * Guarantees at least 10 templates (exactly 2 per difficulty level) per concept.
 * Integrates multiple concept merging for Pro & Legend levels.
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
  console.log('🚀 Starting Expanded 10x Exam Hierarchy & Template Bank Builder (Self-Healing)...');
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
  
  // Group concepts by chapter for multi-concept lookup later
  // Key: exam|subject|chapter (lowercase) -> Array of concept objects
  const conceptsByChapter = new Map();

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
      concept_description: desc ? desc.trim() : `Description for ${name.trim()} under ${topic.trim()}.`,
      concept_formula: formula ? formula.trim() : null,
    };

    idMap.set(id, newConcept);
    nameMap.set(nameKey, newConcept);

    // Grouping
    const chapKey = `${exam.trim()}|${subject.trim()}|${chapter.trim()}`.toLowerCase();
    if (!conceptsByChapter.has(chapKey)) {
      conceptsByChapter.set(chapKey, []);
    }
    conceptsByChapter.get(chapKey).push(newConcept);
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

  // 6. Seed public.latest_concept_templates from concept_templates_rows.csv with Deduplication
  console.log('\n📋 Loading and deduplicating original templates...');
  const templatesCsv = loadCsv('concept_templates_rows.csv');
  const conceptIds = new Set(finalConcepts.map((c) => c.concept_id));

  // Map to store clean templates per concept ID
  // concept_id -> Map of difficulty_level -> Array of template objects
  const conceptTemplatesMap = new Map();
  // To avoid duplicate stems for the same concept
  const seenTemplates = new Set(); 

  let addedOriginalCount = 0;

  for (const r of templatesCsv) {
    if (!r.concept_template_id || !conceptIds.has(r.concept_id)) continue;

    const stem = (r.concept_template_questions || 'Solve problem based on concept.').trim();
    const dupKey = `${r.concept_id}|${stem.toLowerCase()}`;
    if (seenTemplates.has(dupKey)) continue; // duplicate stem for same concept, skip
    seenTemplates.add(dupKey);

    // Map difficulty
    let difficulty = 'easy';
    let difficulty_num = 1;
    const rawDiff = (r.difficulty_level || '').toLowerCase();
    if (rawDiff.includes('medium')) {
      difficulty = 'medium';
      difficulty_num = 2;
    } else if (rawDiff.includes('hard')) {
      difficulty = 'hard';
      difficulty_num = 3;
    }

    const tplId = isUUID(r.concept_template_id) ? r.concept_template_id : randomUUID();
    const origTplId = r.concept_template_id.trim();

    if (!conceptTemplatesMap.has(r.concept_id)) {
      conceptTemplatesMap.set(r.concept_id, new Map());
    }
    const levelsMap = conceptTemplatesMap.get(r.concept_id);
    if (!levelsMap.has(difficulty)) {
      levelsMap.set(difficulty, []);
    }
    const list = levelsMap.get(difficulty);
    const index = list.length;

    const fallbackName = `${r.concept_name.trim()} - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Template ${index + 1}`;
    const tName = r.template_name && r.template_name.trim() ? r.template_name.trim() : fallbackName;

    const vars = extractVarsFromFormula(r.formula_latex);
    const templateObj = {
      template_id: tplId,
      concept_id: r.concept_id,
      original_template_id: origTplId,
      exam_name: r.exam_name.trim(),
      subject_name: r.subject_name.trim(),
      chapter_name: r.chapter_name.trim(),
      topic_name: r.topic_name.trim(),
      concept_name: r.concept_name.trim(),
      template_name: tName,
      template_type: difficulty === 'easy' ? 'direct_substitution' : difficulty === 'medium' ? 'formula_rearrangement' : 'logical_trap',
      difficulty_level: difficulty,
      difficulty_number: difficulty_num,
      stem_template: stem,
      option_a: r.option_a || 'Correct Option',
      option_b: r.option_b || 'Computational trap choice',
      option_c: r.option_c || 'Sign error or unit misconversion',
      option_d: r.option_d || 'Irrelevant conceptual distractor',
      correct_answer: r.correct_answer || 'Option A',
      explanation: r.explanation || 'Pedagogical explanation.',
      status: 'reviewed',
      variables: vars,
      formula_name: r.formula_name || null,
      formula_latex: r.formula_latex || null,
      unknown_variable: vars.length > 0 ? vars[0].symbol : null,
      supported_unknowns: vars.map((v) => v.symbol),
      merged_concept_ids: [],
      merged_concept_names: [],
    };

    list.push(templateObj);
    addedOriginalCount++;
  }

  console.log(`  ✅ Loaded ${addedOriginalCount} unique original templates.`);

  // 7. Auto-generate templates to reach EXACTLY 2 per level per concept (totaling 10 templates per concept)
  // And implement multi-concept merging on levels 4/Pro and 5/Legend.
  console.log('\n🔧 Auto-generating stubs to guarantee exactly 2 templates per level (10 per concept)...');
  
  const DIFFICULTY_LEVELS = [
    { level: 'easy', num: 1, type: 'direct_substitution' },
    { level: 'medium', num: 2, type: 'formula_rearrangement' },
    { level: 'hard', num: 3, type: 'logical_trap' },
    { level: 'pro', num: 4, type: 'multi_concept' },
    { level: 'legend', num: 5, type: 'reverse_thinking' },
  ];

  const TECHNICAL_EXAMS = new Set([
    'jee main',
    'jee advanced',
    'neet',
    'neet ug',
    'neet pg',
    'bitsat',
    'gate',
    'srmjeee',
    'mht-cet',
  ]);

  const finalTemplates = [];

  for (const c of finalConcepts) {
    const levelsMap = conceptTemplatesMap.get(c.concept_id) || new Map();
    const chapKey = `${c.exam_name}|${c.subject_name}|${c.chapter_name}`.toLowerCase();
    const siblings = (conceptsByChapter.get(chapKey) || []).filter((s) => s.concept_id !== c.concept_id);
    const isTechnical = TECHNICAL_EXAMS.has(c.exam_name.toLowerCase().trim());

    for (const dl of DIFFICULTY_LEVELS) {
      const existingForLevel = levelsMap.get(dl.level) || [];
      
      // Push existing templates
      existingForLevel.forEach((t) => finalTemplates.push(t));

      // Calculate how many stubs we need for this level (target is at least 2 templates per level)
      const stubsNeeded = Math.max(0, 2 - existingForLevel.length);

      for (let i = 0; i < stubsNeeded; i++) {
        const index = existingForLevel.length + i;
        const tplId = randomUUID();
        const tName = `${c.concept_name} - ${dl.level.charAt(0).toUpperCase() + dl.level.slice(1)} Template ${index + 1}`;

        const hasFormula = !!c.concept_formula;
        const vars = extractVarsFromFormula(c.concept_formula);
        const isJeeMain = c.exam_name.toLowerCase().trim() === 'jee main';

        let stem = '';
        let sol = '';
        let expl = '';
        let mergedIds = [];
        let mergedNames = [];

        // Check if multi-concept (pro / legend)
        if ((dl.level === 'pro' || dl.level === 'legend') && siblings.length > 0) {
          // Determine how many concepts to integrate (prefer 3 for JEE Advanced / GATE)
          let numMerge = 1;
          if (isTechnical && (c.exam_name.toLowerCase().trim() === 'jee advanced' || c.exam_name.toLowerCase().trim() === 'gate')) {
            numMerge = Math.min(siblings.length, 2);
          } else {
            numMerge = Math.min(siblings.length, 1);
          }

          // Pick siblings deterministically using concept_id index to be stable
          const chosenSiblings = [];
          for (let k = 0; k < numMerge; k++) {
            const idx = (c.concept_id.charCodeAt(0) + dl.num + i + k) % siblings.length;
            chosenSiblings.push(siblings[idx]);
          }

          mergedIds = chosenSiblings.map((s) => s.concept_id);
          mergedNames = chosenSiblings.map((s) => s.concept_name);

          const sibNamesStr = mergedNames.join(' and ');

          const isJeeAdvanced = c.exam_name.toLowerCase().trim() === 'jee advanced';

          if (isJeeAdvanced) {
            if (dl.level === 'pro') {
              stem = hasFormula
                ? `An authentic IIT JEE Advanced problem requiring multi-step analytical reasoning and synthesis of at least three concepts from the same chapter: ${c.concept_name} (equation: ${c.concept_formula}) and the related concepts ${sibNamesStr}. Deduce the final operational parameters of the system under realistic engineering boundary conditions, utilizing physical and mathematical insights rather than routine coaching shortcuts.`
                : `Synthesize the physical/mathematical relationships combining at least three concepts from the chapter ${c.chapter_name}: ${c.concept_name} and the related concepts ${sibNamesStr}. Determine which conceptual assertion must hold true under JEE Advanced limiting cases.`;
              sol = `Step 1: Perform physical/conceptual analysis of the system. Step 2: Establish equations for ${c.concept_name} and the integrated concepts ${sibNamesStr}. Step 3: Solve the simultaneous equations while applying boundary approximations and elimination.`;
              expl = `IIT JEE Advanced level 3-concept integration testing deep physical deduction and mathematical maturity.`;
            } else {
              // legend
              stem = hasFormula
                ? `An IIT JEE Advanced reverse-thinking challenge. Given the final measured output state of a composite system governed by ${c.concept_name} (using equation ${c.concept_formula}) and ${sibNamesStr}, work backwards to reconstruct the original physical scenario. Determine the hidden constraints and identify which initial boundary assumptions are valid.`
                : `Working backwards from the composite final state governed by ${c.concept_name} and the integrated concepts ${sibNamesStr}, deduce the initial physical boundary condition and constraints that must have been satisfied.`;
              sol = `Step 1: Start with the final system output state. Step 2: Set up reverse thermodynamic or dynamic equations for ${sibNamesStr}. Step 3: Solve backwards to determine the initial conditions using the laws of ${c.concept_name}.`;
              expl = `Tests reverse thinking and multi-step deduction starting from the final system output under JEE Advanced criteria.`;
            }
          } else if (isJeeMain) {
            if (dl.level === 'pro') {
              stem = hasFormula
                ? `An official JEE Main level problem integrating exactly two concepts from the same chapter: ${c.concept_name} (using formula ${c.concept_formula}) and the related concept ${sibNamesStr} (e.g. Work-Energy + Circular Motion, or Electrostatics + Capacitance). Under standard NTA exam limits, calculate the net composite output parameter.`
                : `Analyze the integrated relationship combining exactly two concepts from the chapter ${c.chapter_name}: ${c.concept_name} and ${sibNamesStr}. Choose the correct statement governing the system's combined state.`;
              sol = `Step 1: Formulate the equation for the first concept (${c.concept_name}). Step 2: Write the governing relation for the second concept (${sibNamesStr}). Step 3: Simultaneously solve the system of equations.`;
              expl = `Combines exactly two concepts from the same chapter to test integrated multi-step reasoning.`;
            } else {
              // legend
              stem = hasFormula
                ? `A complex JEE Main reverse-thinking scenario where the final state output parameter is measured. Working backwards using the combined principles of ${c.concept_name} (formula: ${c.concept_formula}) and ${sibNamesStr}, deduce the initial system design conditions and identify which physical assumptions must hold true.`
                : `Working backwards from the composite final state governed by ${c.concept_name} and ${sibNamesStr}, deduce the initial physical boundary condition that must have been satisfied.`;
              sol = `Step 1: Begin with the final system output state. Step 2: Apply reverse thermodynamic/dynamic equations for ${sibNamesStr}. Step 3: Trace backwards to isolate initial conditions using the laws of ${c.concept_name}.`;
              expl = `Tests reverse thinking and multi-step deduction starting from the final system output.`;
            }
          } else if (isTechnical) {
            if (dl.level === 'pro') {
              stem = hasFormula
                ? `An analytical examination question integrating the physical/mathematical frameworks of ${c.concept_name} (using formula ${c.concept_formula}) and the related concepts ${sibNamesStr} from the chapter ${c.chapter_name}. Calculate the net composite output of the system under realistic engineering conditions.`
                : `Analyze the integrated relation between the concepts ${c.concept_name} and ${sibNamesStr} under standard ${c.exam_name} laboratory parameters. Which of the following observations is conceptually correct?`;
              sol = `Step 1: Apply the primary physical principles for ${c.concept_name}. Step 2: Formulate state equations for ${sibNamesStr}. Step 3: Solve the combined system simultaneously to find the target parameters.`;
              expl = `This is a high-level exam standard multi-concept template integrating ${c.concept_name} with ${sibNamesStr} in the chapter ${c.chapter_name}.`;
            } else {
              // legend
              stem = hasFormula
                ? `Given a measured final system state output parameter, work backwards using the scientific formulas of ${c.concept_name} (formula: ${c.concept_formula}) and ${sibNamesStr} to deduce the initial boundary conditions and thermodynamic constraints.`
                : `A complex legend-level question requiring reverse logic. Given the composite system state of ${c.concept_name} combined with ${sibNamesStr}, deduce the initial conditions that must have been satisfied.`;
              sol = `Step 1: Begin with the final system output state. Step 2: Reverse solve the equations for the sibling concepts (${sibNamesStr}). Step 3: Chain backwards using the principles of ${c.concept_name} to isolate the initial state variables.`;
              expl = `Develops deep conceptual reasoning and backwards deduction for high-standard entrance exams.`;
            }
          } else {
            // Non-technical
            if (dl.level === 'pro') {
              stem = hasFormula
                ? `Evaluate the combined effect of ${c.concept_name} (using formula ${c.concept_formula}) and ${sibNamesStr} under high-standard exam parameters. Find the net output of the system.`
                : `Analyze the integrated relationship between ${c.concept_name} and ${sibNamesStr} in the chapter ${c.chapter_name}. Which of the following is correct under the given constraint?`;
              sol = `Step 1: Set up the equation using the primary concept ${c.concept_name}. Step 2: Formulate the equations for ${sibNamesStr}. Step 3: Solve the integrated system of equations simultaneously to find the correct value.`;
              expl = `This is a high-level exam standard multi-concept template integrating ${c.concept_name} with ${sibNamesStr} in ${c.chapter_name}.`;
            } else {
              // legend
              stem = hasFormula
                ? `Given the final system output parameter, work backwards using the formulas of ${c.concept_name} (formula: ${c.concept_formula}) and ${sibNamesStr} to find the initial variable values under constraint {constraint}.`
                : `A complex legend-level question requiring reverse logic. Given the composite system state of ${c.concept_name} combined with ${sibNamesStr}, deduce the initial conditions.`;
              sol = `Step 1: Start with the final output. Step 2: Work backwards using the principles of ${sibNamesStr} to find the intermediate state. Step 3: Apply the reverse formula for ${c.concept_name} to isolate and compute the initial parameter.`;
              expl = `This legend-level template requires reverse thinking to calculate initial states by chaining the laws of ${c.concept_name} and ${sibNamesStr} in ${c.chapter_name}.`;
            }
          }
        } else {
          // Single concept easy/medium/hard, or fallback if no siblings
          if (isJeeAdvanced) {
            if (dl.level === 'easy') {
              stem = hasFormula
                ? `An analytical setup is configured to investigate ${c.concept_name}. Rather than applying direct formula substitution, analyze the system dynamics/thermodynamics governed by the relation ${c.concept_formula}. Evaluate the boundary principles and deduce the value of the target parameter when the system reaches equilibrium.`
                : `Which of the following conceptual assertions correctly identifies the physical/chemical principles governing the behavior of ${c.concept_name} in ${c.chapter_name} under standard IIT JEE Advanced criteria?`;
              sol = `Perform physical analysis of the system, establish the governing relation, and apply boundary values.`;
              expl = `IIT JEE Advanced level conceptual analysis testing system mechanics before calculating values.`;
            } else if (dl.level === 'medium') {
              stem = hasFormula
                ? `In a high-precision experimental setup (such as a battery pack configuration, satellite stabilization loop, or optical bench setup) involving the physics of ${c.concept_name}, the system is described by ${c.concept_formula}. Rearrange the equation to isolate the target variable, accounting for necessary SI unit conversions, and determine the exact target parameters under standard testing constraints.`
                : `A practical engineering device operates under the principles of ${c.concept_name}. Explain the correct analytical rearrangement of the system parameters required to solve for the design constraints.`;
              sol = `Express the target variable analytically. Apply proper dimensional analysis and unit conversions. Calculate the design value.`;
              expl = `Tests formula rearrangement under realistic experimental contexts and correct unit conversions.`;
            } else if (dl.level === 'hard') {
              stem = hasFormula
                ? `A JEE Advanced level problem on ${c.concept_name} (governed by ${c.concept_formula}) containing a logical trap. Determine the exact value of the target parameter. Note standard pitfalls: incorrect sign convention (e.g. thermodynamic work vs. heat sign), wrong unit conversion, or incorrect formula variant selection.`
                : `Evaluate the behavior of ${c.concept_name} in the chapter ${c.chapter_name} under extreme bounds. Identify the correct physical statement while avoiding common conceptual traps (e.g. sign convention errors or dimensional mismatches).`;
              sol = `Formulate the equations. Identify and apply correct sign conventions and standard units. Evade standard algebraic traps to compute the exact result.`;
              expl = `Designed to trap students who misapply sign conventions or unit conversions under JEE Advanced constraints.`;
            } else if (dl.level === 'pro') {
              stem = `An advanced problem on ${c.concept_name} in the chapter ${c.chapter_name} requiring multiple steps. Calculate the target variable under constraints.`;
              sol = `Formulate the equations of ${c.concept_name} for the system. Solve the multi-step system to find the target variable.`;
              expl = `Pedagogical explanation of the advanced application of ${c.concept_name}.`;
            } else {
              stem = `Based on a measured final output state of the system governed by ${c.concept_name}, deduce the initial thermodynamic/physical constraint that must have been satisfied. Determine which assumption holds true for this reverse process.`;
              sol = `Start from the output state. Work reverse step-by-step using the principles of ${c.concept_name} to resolve initial parameters.`;
              expl = `Pedagogical explanation of reverse solving ${c.concept_name}.`;
            }
          } else if (isJeeMain) {
            if (dl.level === 'easy') {
              stem = hasFormula
                ? `An experimental setup is prepared to study ${c.concept_name}. Rather than applying direct formula substitution, analyze the system dynamics/thermodynamics governed by the relation ${c.concept_formula}. Identify the physical boundary principles first, then compute the target parameters when the system reaches equilibrium.`
                : `Identify the statement that correctly identifies the physical/chemical principles governing the behavior of ${c.concept_name} in ${c.chapter_name} under standard JEE Main testing conditions.`;
              sol = `Step 1: Identify the underlying physical concept. Step 2: Establish the boundary parameters. Step 3: Substitute standard laboratory values into the relation.`;
              expl = `This JEE Main standard template tests deep conceptual understanding of the physical setup before applying numerical variables.`;
            } else if (dl.level === 'medium') {
              stem = hasFormula
                ? `In a high-precision engineering design (such as a battery pack configuration, satellite stabilization loop, or optical bench setup) involving the physics of ${c.concept_name}, the system is described by ${c.concept_formula}. Rearrange the formula to isolate the operational variable, accounting for necessary SI unit conversions, and determine the exact target parameters under standard testing constraints.`
                : `A practical engineering device operates under the principles of ${c.concept_name}. Explain the correct analytical rearrangement of the system parameters required to solve for the design constraints.`;
              sol = `Step 1: Express the target variable analytically. Step 2: Apply proper dimensional analysis and unit conversions. Step 3: Calculate the design value.`;
              expl = `Tests formula rearrangement under realistic engineering contexts and correct unit conversions.`;
            } else if (dl.level === 'hard') {
              stem = hasFormula
                ? `A JEE Main challenge question on ${c.concept_name} (governed by ${c.concept_formula}) containing a logical trap. Determine the exact value of the target parameter. Note standard pitfalls: incorrect sign convention (e.g. thermodynamic work vs. heat sign), wrong unit conversion, or incorrect formula variant selection.`
                : `Evaluate the behavior of ${c.concept_name} in the chapter ${c.chapter_name} under extreme bounds. Identify the correct physical statement while avoiding common conceptual traps (e.g., dimensional mismatch or incorrect boundary approximations).`;
              sol = `Step 1: Formulate the equations. Step 2: Identify and apply correct sign conventions and standard units. Step 3: Evade standard algebraic traps to compute the exact result.`;
              expl = `Designed to trap students who misapply sign conventions or unit conversions.`;
            } else if (dl.level === 'pro') {
              stem = `An advanced problem on ${c.concept_name} in the chapter ${c.chapter_name} requiring multiple steps. Calculate the target variable under constraints.`;
              sol = `Formulate the equations of ${c.concept_name} for the system. Solve the multi-step system to find the target variable.`;
              expl = `Pedagogical explanation of the advanced application of ${c.concept_name}.`;
            } else {
              stem = `Based on a measured final output state of the system governed by ${c.concept_name}, deduce the initial thermodynamic/physical constraint that must have been satisfied. Determine which assumption holds true for this reverse process.`;
              sol = `Start from the output state. Work reverse step-by-step using the principles of ${c.concept_name} to resolve initial parameters.`;
              expl = `Pedagogical explanation of reverse solving ${c.concept_name}.`;
            }
          } else if (isTechnical) {
            if (dl.level === 'easy') {
              stem = hasFormula
                ? `In a scientific study investigating the principles of ${c.concept_name}, an experimental system is established under standard atmospheric controls. Using the fundamental relationship ${c.concept_formula}, evaluate the system properties and calculate the value of the target parameter when the system reaches equilibrium.`
                : `Which of the following conceptual assertions holds true regarding the physical/biological principles of ${c.concept_name} in the chapter ${c.chapter_name}? Analyze the statement from the perspective of standard NCERT/analytical exam criteria.`;
              sol = `Review the boundary conditions of the physical system, establish the governing relation, and apply values directly.`;
              expl = `Concepts of ${c.concept_name} evaluated under standard NCERT/GATE/JEE Main criteria.`;
            } else if (dl.level === 'medium') {
              stem = hasFormula
                ? `For an engineering device (e.g. electrical circuit, battery, or optics bench) governed by the physics of ${c.concept_name}, the operational formula is defined as ${c.concept_formula}. Rearrange the equation to isolate the target variable, and determine its value under realistic laboratory values.`
                : `Isolate the target variable to explain how the thermodynamic state behavior of ${c.concept_name} varies when key environment parameters are adjusted within normal design limits.`;
              sol = `Algebraically manipulate ${c.concept_formula} to isolate the target quantity, then substitute system parameters.`;
              expl = `Formula rearrangement template for ${c.concept_name} using realistic laboratory values.`;
            } else if (dl.level === 'hard') {
              stem = hasFormula
                ? `A challenge problem on ${c.concept_name} (equation: ${c.concept_formula}) containing a logical trap. Determine the unknown target variable under constraints. Note potential pitfalls such as incorrect sign orientation or failure to convert input variables into standard SI base units.`
                : `Evaluate the behavior of the system governed by ${c.concept_name} under extreme constraints. Identify the trap that leads to common misconceptions (e.g. dimensional inconsistency or incorrect boundary approximations).`;
              sol = `Formulate the equations for ${c.concept_name}, identify the trap constraints, and apply appropriate sign conventions or unit conversions.`;
              expl = `Rigorously validates the student's conceptual precision and alertness for common calculation traps.`;
            } else if (dl.level === 'pro') {
              stem = `An advanced problem on ${c.concept_name} in the chapter ${c.chapter_name} requiring multiple steps. Calculate the target variable under constraints.`;
              sol = `Formulate the equations of ${c.concept_name} for the system. Solve the multi-step system to find the target variable.`;
              expl = `Pedagogical explanation of the advanced application of ${c.concept_name}.`;
            } else {
              stem = `Based on a measured final output state of the system governed by ${c.concept_name}, deduce the initial thermodynamic/physical constraint that must have been satisfied. Determine which assumption holds true for this reverse process.`;
              sol = `Start from the output state. Work reverse step-by-step using the principles of ${c.concept_name} to resolve initial parameters.`;
              expl = `Pedagogical explanation of reverse solving ${c.concept_name}.`;
            }
          } else {
            // Non-technical
            if (dl.level === 'easy') {
              stem = hasFormula
                ? `Given the formula ${c.concept_formula} for ${c.concept_name}, calculate {unknown} if all other variables are provided.`
                : `Which of the following statements is a direct application of the concept ${c.concept_name} in ${c.chapter_name}?`;
              sol = `Identify the variables for ${c.concept_name} and substitute them into the formula.`;
              expl = `Pedagogical explanation of ${c.concept_name} for direct substitution.`;
            } else if (dl.level === 'medium') {
              stem = hasFormula
                ? `Under standard conditions, rewrite the formula ${c.concept_formula} to solve for the rearranged unknown parameter, and compute its value.`
                : `Explain how the behavior of ${c.concept_name} changes when the parameter {variable_1} is altered under standard limits.`;
              sol = `Isolate the target variable algebraically from ${c.concept_formula}. Substitute the given parameters and solve.`;
              expl = `Pedagogical explanation of ${c.concept_name} using algebraic rearrangement.`;
            } else if (dl.level === 'hard') {
              stem = `A problem on ${c.concept_name} involving a logical constraint. Given the conditions, determine {unknown}. Beware of the common trap {trap}.`;
              sol = `Apply the formulas of ${c.concept_name}. Apply the conditional limit {trap_limit} to filter out incorrect mathematical paths.`;
              expl = `Pedagogical explanation of ${c.concept_name} focusing on avoiding common traps.`;
            } else if (dl.level === 'pro') {
              stem = `An advanced problem on ${c.concept_name} in the chapter ${c.chapter_name} requiring multiple steps. Calculate the target variable under constraints.`;
              sol = `Formulate the equations of ${c.concept_name} for the system. Solve the multi-step system to find the target variable.`;
              expl = `Pedagogical explanation of the advanced application of ${c.concept_name}.`;
            } else {
              stem = `Work backwards from the final output state of the system governed by ${c.concept_name} to find the initial constraints.`;
              sol = `Start from the output state. Work reverse step-by-step using the principles of ${c.concept_name} to resolve initial parameters.`;
              expl = `Pedagogical explanation of reverse solving ${c.concept_name}.`;
            }
          }
        }

        let optA = `Correct option for ${c.concept_name} (${dl.level}): standard application.`;
        let optB = `Incorrect option: misapplies the formula units.`;
        let optC = `Incorrect option: ignores sign orientation.`;
        let optD = `Incorrect option: unrelated conceptual distractor choice.`;

        if (isTechnical) {
          optA = `Correct option/value calculated using the rigorous principles of ${c.concept_name}.`;
          optB = `Incorrect: resulting from a common sign convention error or wrong approximation.`;
          optC = `Incorrect: resulting from a failure to convert units to standard SI base units.`;
          optD = `Incorrect: resulting from a dimensional mismatch (using the wrong formula variant).`;
        }

        finalTemplates.push({
          template_id: tplId,
          concept_id: c.concept_id,
          original_template_id: tplId,
          exam_name: c.exam_name,
          subject_name: c.subject_name,
          chapter_name: c.chapter_name,
          topic_name: c.topic_name,
          concept_name: c.concept_name,
          template_name: tName,
          template_type: dl.type,
          difficulty_level: dl.level,
          difficulty_number: dl.num,
          stem_template: stem,
          variables: vars,
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_answer: 'Option A',
          explanation: expl,
          status: 'draft',
          formula_name: c.concept_formula ? `${c.concept_name} Formula` : null,
          formula_latex: c.concept_formula || null,
          unknown_variable: vars.length > 0 ? vars[0].symbol : null,
          supported_unknowns: vars.map((v) => v.symbol),
          merged_concept_ids: mergedIds,
          merged_concept_names: mergedNames,
        });
      }
    }
  }

  console.log(`\n📤 Total generated and mapped templates: ${finalTemplates.length}`);
  console.log(`📤 Expected minimum: ${finalConcepts.length * 10} (${finalConcepts.length} concepts × 10 templates)`);

  // Clear existing templates in latest_concept_templates first to prevent old stubs from lingering
  console.log('\n🧹 Clearing old entries from public.latest_concept_templates...');
  const { error: deleteError } = await supabase
    .from('latest_concept_templates')
    .delete()
    .neq('template_id', '00000000-0000-0000-0000-000000000000'); // delete all
  if (deleteError) {
    console.error('❌ Failed to clear old templates:', deleteError.message);
  } else {
    console.log('  ✅ Table cleared.');
  }

  // Upload to public.latest_concept_templates
  await upsertBatch('latest_concept_templates', finalTemplates, 'template_id');

  console.log('\n================================================================');
  console.log('🎉 10x PIPELINE COMPLETED SUCCESSFULLY!');
  console.log('================================================================');
  console.log(`📚 Total Merged Concepts in DB:  ${finalConcepts.length}`);
  console.log(`📋 Total Templates in DB:         ${finalTemplates.length}`);
  console.log('================================================================');
}

main().catch((err) => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
