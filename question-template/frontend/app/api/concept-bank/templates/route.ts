import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** GET /api/concept-bank/templates
 * Query params: exam, subject, chapter, topic, difficulty, type, status, search, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam');
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');
    const topic = searchParams.get('topic');
    const conceptId = searchParams.get('concept_id');
    const difficulty = searchParams.get('difficulty');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('latest_concept_templates')
      .select(`
        template_id, concept_id, exam_name, subject_name, chapter_name,
        topic_name, concept_name, template_name, template_type,
        difficulty_level, difficulty_number, stem_template,
        formula_latex, variables, option_a, option_b, option_c, option_d,
        correct_answer, explanation, status, created_at
      `, { count: 'exact' })
      .order('difficulty_number', { ascending: true })
      .range(offset, offset + limit - 1);

    if (exam) query = query.eq('exam_name', exam);
    if (subject) query = query.eq('subject_name', subject);
    if (chapter) query = query.eq('chapter_name', chapter);
    if (topic) query = query.eq('topic_name', topic);
    if (conceptId) query = query.eq('concept_id', conceptId);
    if (difficulty) query = query.eq('difficulty_level', difficulty);
    if (type) query = query.eq('template_type', type);
    if (status) query = query.eq('status', status);
    if (search) query = query.or(`concept_name.ilike.%${search}%,stem_template.ilike.%${search}%`);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data, count, offset, limit });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
