import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgsdovlumtjwvcwzjnnn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnc2Rvdmx1bXRqd3Zjd3pqbm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTU0ODMsImV4cCI6MjA5ODk3MTQ4M30.OVEd9g1sqM8hRj4n_Q8jZ-4uGJ5T5kkW-GX7cVjjKrI";
const supabase = createClient(supabaseUrl, supabaseKey);

export interface BankStats {
  total: number;
  byStatus: Record<string, number>;
  byExam: Record<string, number>;
  byDifficulty: Record<string, number>;
  reviewedPct: number;
}

export interface TemplateRow {
  template_id: string;
  exam_name: string;
  subject_name: string;
  chapter_name: string;
  concept_name: string;
  template_type: string;
  difficulty_level: string;
  status: string;
  stem_template: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  formula_latex: string;
}

export const bankAgentService = {
  async getStats(): Promise<BankStats> {
    // Fetch status distribution
    const { data: statusData } = await supabase
      .from('latest_concept_templates')
      .select('status')
      .limit(1000);

    const { data: examData } = await supabase
      .from('latest_concept_templates')
      .select('exam_name, difficulty_level, status')
      .limit(5000);

    const byStatus: Record<string, number> = {};
    const byExam: Record<string, number> = {};
    const byDifficulty: Record<string, number> = {};
    let total = 0;

    (examData || []).forEach((row: any) => {
      total++;
      byStatus[row.status] = (byStatus[row.status] || 0) + 1;
      byExam[row.exam_name] = (byExam[row.exam_name] || 0) + 1;
      byDifficulty[row.difficulty_level] = (byDifficulty[row.difficulty_level] || 0) + 1;
    });

    const reviewed = byStatus['reviewed'] || 0;
    const reviewedPct = total > 0 ? Math.round((reviewed / total) * 100) : 0;

    return { total, byStatus, byExam, byDifficulty, reviewedPct };
  },

  async getReviewQueue(limit = 20): Promise<TemplateRow[]> {
    const { data } = await supabase
      .from('latest_concept_templates')
      .select('template_id,exam_name,subject_name,chapter_name,concept_name,template_type,difficulty_level,status,stem_template,option_a,option_b,option_c,option_d,formula_latex')
      .eq('status', 'auto_fixed')
      .limit(limit);
    return (data || []) as TemplateRow[];
  },

  async approveTemplate(templateId: string): Promise<void> {
    await supabase
      .from('latest_concept_templates')
      .update({ status: 'reviewed', updated_at: new Date().toISOString() })
      .eq('template_id', templateId);
  },

  async rejectTemplate(templateId: string): Promise<void> {
    await supabase
      .from('latest_concept_templates')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('template_id', templateId);
  },

  async bulkApprove(exam: string, limit: number): Promise<number> {
    const { data } = await supabase
      .from('latest_concept_templates')
      .select('template_id')
      .eq('exam_name', exam)
      .eq('status', 'auto_fixed')
      .limit(limit);
    const ids = (data || []).map((r: any) => r.template_id);
    if (ids.length === 0) return 0;
    await supabase
      .from('latest_concept_templates')
      .update({ status: 'reviewed', updated_at: new Date().toISOString() })
      .in('template_id', ids);
    return ids.length;
  },

  async searchTemplates(query: string, exam?: string): Promise<TemplateRow[]> {
    let q = supabase
      .from('latest_concept_templates')
      .select('template_id,exam_name,chapter_name,concept_name,template_type,difficulty_level,status,stem_template,option_a,formula_latex')
      .ilike('concept_name', `%${query}%`)
      .limit(30);
    if (exam) q = q.eq('exam_name', exam);
    const { data } = await q;
    return (data || []) as TemplateRow[];
  },

  async getExamList(): Promise<string[]> {
    const { data } = await supabase
      .from('latest_exams')
      .select('exam_name')
      .order('exam_name');
    return (data || []).map((r: any) => r.exam_name);
  },

  async getChapterList(exam: string): Promise<string[]> {
    const { data } = await supabase
      .from('latest_chapters')
      .select('chapter_name')
      .eq('exam_name', exam)
      .order('chapter_name');
    return (data || []).map((r: any) => r.chapter_name);
  },
};
