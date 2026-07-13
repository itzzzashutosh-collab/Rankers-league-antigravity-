import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/** GET /api/concept-bank/coverage
 * Returns template coverage statistics per exam/subject/chapter
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam');

    let query = supabase
      .from('rl_template_coverage')
      .select('*')
      .order('exam_name')
      .order('coverage_percent', { ascending: false });

    if (exam) query = query.eq('exam_name', exam);

    const { data, error } = await query;
    if (error) throw error;

    // Compute top-level exam summaries
    const examSummary: Record<string, {
      exam_name: string;
      total_concepts: number;
      concepts_with_templates: number;
      total_templates: number;
      coverage_percent: number;
      by_difficulty: Record<string, number>;
    }> = {};

    for (const row of (data || [])) {
      if (!examSummary[row.exam_name]) {
        examSummary[row.exam_name] = {
          exam_name: row.exam_name,
          total_concepts: 0,
          concepts_with_templates: 0,
          total_templates: 0,
          coverage_percent: 0,
          by_difficulty: { easy: 0, medium: 0, hard: 0, pro: 0, legend: 0 },
        };
      }
      const s = examSummary[row.exam_name];
      s.total_concepts += row.total_concepts || 0;
      s.concepts_with_templates += row.concepts_with_templates || 0;
      s.total_templates += row.total_templates || 0;
      s.by_difficulty.easy += row.easy_count || 0;
      s.by_difficulty.medium += row.medium_count || 0;
      s.by_difficulty.hard += row.hard_count || 0;
      s.by_difficulty.pro += row.pro_count || 0;
      s.by_difficulty.legend += row.legend_count || 0;
    }

    // Compute coverage percents
    for (const s of Object.values(examSummary)) {
      s.coverage_percent = s.total_concepts > 0
        ? Math.round((s.concepts_with_templates / s.total_concepts) * 100 * 100) / 100
        : 0;
    }

    return NextResponse.json({
      success: true,
      exam_summary: Object.values(examSummary).sort((a, b) => b.total_concepts - a.total_concepts),
      chapter_detail: data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
