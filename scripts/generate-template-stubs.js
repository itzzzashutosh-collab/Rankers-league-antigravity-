#!/usr/bin/env node
/**
 * generate-template-stubs.js
 * Phase 1 — Auto-generate Level 1 (Easy) stub templates for all concepts
 * that currently have ZERO templates in the system.
 *
 * Strategy:
 * - For every concept with 0 templates, generate 5 stub templates
 *   (one per difficulty level: easy, medium, hard, pro, legend)
 * - Each stub is parameterized and marked status='stub'
 * - Stubs are designed to be reviewed and enriched by the admin team
 *
 * Run: node scripts/generate-template-stubs.js
 */

import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BATCH_SIZE = 200;

// ─── Stub Template Generators per Difficulty ─────────────────────────────────
function buildStubs(concept) {
  const { concept_id, exam_name, subject_name, chapter_name, topic_name, concept_name, concept_description, concept_formula } = concept;

  const base = {
    concept_id,
    exam_name,
    subject_name,
    chapter_name,
    topic_name,
    concept_name,
    formula_latex: concept_formula || null,
    status: 'stub',
    supported_variations: ['variable_replacement', 'wording_variation', 'unit_change'],
    context_tags: [exam_name.toLowerCase(), subject_name.toLowerCase()],
  };

  const hasFormula = !!concept_formula;

  return [
    // Level 1 — Easy: Direct application
    {
      ...base,
      template_id: randomUUID(),
      template_type: 'direct_substitution',
      difficulty_level: 'easy',
      difficulty_number: 1,
      stem_template: hasFormula
        ? `Given the formula ${concept_formula}, find {unknown} when {known_variables} are provided.`
        : `Which of the following correctly describes ${concept_name} as studied in ${chapter_name}?`,
      solution_approach: `Direct application of ${concept_name}. Identify known values and substitute into the formula.`,
      cognitive_level: 'knowledge',
      skills_tested: ['recall', 'direct_substitution'],
      common_mistakes: ['Unit conversion errors', 'Substituting wrong variable'],
      estimated_frequency: 'appears_every_year',
    },

    // Level 2 — Medium: Formula rearrangement
    {
      ...base,
      template_id: randomUUID(),
      template_type: 'formula_rearrangement',
      difficulty_level: 'medium',
      difficulty_number: 2,
      stem_template: hasFormula
        ? `The relationship for ${concept_name} is given by ${concept_formula}. If {variable_1} is {value_1}, find {unknown}.`
        : `In the context of ${chapter_name}, if ${concept_name} is applied under conditions {condition_1} and {condition_2}, what is the result?`,
      solution_approach: `Rearrange the formula to isolate the unknown variable. Apply unit consistency checks.`,
      cognitive_level: 'comprehension',
      skills_tested: ['formula_rearrangement', 'algebraic_manipulation'],
      common_mistakes: ['Incorrect rearrangement', 'Sign errors', 'Ignoring implicit assumptions'],
      estimated_frequency: 'appears_every_year',
    },

    // Level 3 — Hard: Logical trap
    {
      ...base,
      template_id: randomUUID(),
      template_type: 'logical_trap',
      difficulty_level: 'hard',
      difficulty_number: 3,
      stem_template: `A problem involving ${concept_name} where the following condition holds: {condition}. Under this constraint, determine {unknown}. Note: {trap_condition} may mislead a student who does not read carefully.`,
      solution_approach: `Identify the hidden condition. Avoid the trap of ${concept_name}. Apply the correct form of the formula.`,
      cognitive_level: 'analysis',
      skills_tested: ['critical_thinking', 'trap_avoidance', 'conditional_reasoning'],
      logical_traps: [`Misapplication of ${concept_name} when conditions deviate from standard`],
      conditional_traps: ['Special case where standard formula does not directly apply'],
      estimated_frequency: 'alternate_years',
    },

    // Level 4 — Pro: Multi-concept
    {
      ...base,
      template_id: randomUUID(),
      template_type: 'multi_concept',
      difficulty_level: 'pro',
      difficulty_number: 4,
      stem_template: `A complex scenario integrating ${concept_name} with {related_concept}. Given {data_set}, derive {unknown} and justify using both concepts.`,
      solution_approach: `Combine ${concept_name} with a related concept. Set up simultaneous equations if required. Verify with constraint checks.`,
      cognitive_level: 'synthesis',
      skills_tested: ['multi_concept_integration', 'analytical_reasoning', 'constraint_solving'],
      prerequisites: [`Understanding of ${concept_name}`, `Basic knowledge of ${chapter_name}`],
      estimated_frequency: 'alternate_years',
    },

    // Level 5 — Legend: Reverse thinking
    {
      ...base,
      template_id: randomUUID(),
      template_type: 'reverse_thinking',
      difficulty_level: 'legend',
      difficulty_number: 5,
      stem_template: `Given the final result {final_value} for a system governed by ${concept_name}, work backwards to determine the initial conditions {unknowns}, given constraints {constraint_1} and {constraint_2}.`,
      solution_approach: `Reverse-engineer the problem. Work from the result backward using ${concept_name}. Apply multiple formulas in sequence.`,
      cognitive_level: 'evaluation',
      skills_tested: ['reverse_reasoning', 'chain_logic', 'multi_formula', 'constraint_analysis'],
      logical_traps: [`Multiple valid paths exist — choose the most efficient`, `Avoid circular assumptions`],
      estimated_frequency: 'rare',
    },
  ];
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔧 Rankers League — Template Stub Generator');
  console.log('='.repeat(55));

  // 1. Get all concepts from DB with pagination
  console.log('📥 Fetching all concepts from rl_concepts (paginated)...');
  let allConcepts = [];
  let conceptStart = 0;
  const PAGE_SIZE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('rl_concepts')
      .select('concept_id, exam_name, subject_name, chapter_name, topic_name, concept_name, concept_description, concept_formula')
      .range(conceptStart, conceptStart + PAGE_SIZE - 1);

    if (error) {
      console.error('❌ Failed to fetch concepts:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    allConcepts = allConcepts.concat(data);
    conceptStart += PAGE_SIZE;
  }
  console.log(`  ✅ Loaded ${allConcepts.length} concepts`);

  // 2. Get concept_ids that already have at least 1 template with pagination
  console.log('📥 Fetching existing template concept_ids (paginated)...');
  let existingTemplates = [];
  let templateStart = 0;
  while (true) {
    const { data, error } = await supabase
      .from('rl_concept_templates')
      .select('concept_id')
      .range(templateStart, templateStart + PAGE_SIZE - 1);

    if (error) {
      console.error('❌ Failed to fetch existing templates:', error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;
    existingTemplates = existingTemplates.concat(data);
    templateStart += PAGE_SIZE;
  }

  const coveredIds = new Set(existingTemplates.map((t) => t.concept_id));
  console.log(`  ✅ ${coveredIds.size} concepts already have templates`);

  // 3. Filter uncovered concepts
  const uncovered = allConcepts.filter((c) => !coveredIds.has(c.concept_id));
  console.log(`  📌 ${uncovered.length} concepts have ZERO templates → generating stubs...`);

  if (uncovered.length === 0) {
    console.log('✅ All concepts already have templates! Nothing to stub.');
    return;
  }

  // 4. Generate stubs
  const allStubs = uncovered.flatMap((concept) => buildStubs(concept));
  console.log(`  📦 Generated ${allStubs.length} stub templates (${uncovered.length} × 5 difficulty levels)`);

  // 5. Upsert in batches
  let inserted = 0;
  for (let i = 0; i < allStubs.length; i += BATCH_SIZE) {
    const batch = allStubs.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('rl_concept_templates').upsert(batch, {
      onConflict: 'template_id',
      ignoreDuplicates: true,
    });
    if (error) {
      console.error(`  ❌ Batch ${i / BATCH_SIZE + 1} error:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`  ✓ Inserted ${inserted} / ${allStubs.length} stubs\r`);
    }
  }

  console.log(`\n✅ Done! ${inserted} stub templates created.`);
  console.log('\n📌 Next step: node scripts/validate-templates.js');
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
