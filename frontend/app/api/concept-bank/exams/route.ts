import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role for read access to concept template bank
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/concept-bank/exams
 * Returns all exams with optional filters
 * Query params: category, nationality, search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const nationality = searchParams.get('nationality');
    const search = searchParams.get('search');

    let query = supabase
      .from('rl_exams')
      .select('exam_id, exam_name, full_form, description, nationality, exam_mode, exam_category, official_website')
      .order('exam_name');

    if (category) query = query.eq('exam_category', category);
    if (nationality) query = query.eq('nationality', nationality);
    if (search) query = query.ilike('exam_name', `%${search}%`);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
