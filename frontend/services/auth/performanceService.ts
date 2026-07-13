import { createClient } from "@/utils/supabase/server";

export interface PerformanceHeatmap {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  topic: string;
  contest_name: string;
  score: number;
  accuracy: number;
  correct_answers: number;
  incorrect_answers: number;
  skipped: number;
  average_time_seconds: number;
  contest_date: string;
  rank: number | null;
  aura_earned: number;
  difficulty: "easy" | "medium" | "hard" | "very_hard";
  created_at: string;
}

export interface PerformanceReport {
  id: string;
  user_id: string;
  overall_summary: string;
  strongest_subject: string;
  weakest_subject: string;
  strongest_chapter: string;
  weakest_chapter: string;
  strongest_topic: string;
  weakest_topic: string;
  most_improved_subject: string;
  needs_immediate_attention: string;
  average_accuracy: number;
  average_contest_rank: number;
  average_aura: number;
  contest_consistency: {
    weekly_average?: number;
    monthly_completions?: number;
    [key: string]: any;
  };
  smart_insights: string[];
  improvement_opportunities: {
    description: string;
    impact: string;
  }[];
  created_at: string;
}

export interface SubjectStatistic {
  id: string;
  user_id: string;
  subject: string;
  total_contests: number;
  average_score: number;
  accuracy_rate: number;
  rank_average: number;
  updated_at: string;
}

export interface ChapterStatistic {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  total_questions: number;
  correct_questions: number;
  accuracy_rate: number;
  updated_at: string;
}

export interface TopicStatistic {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  topic: string;
  total_questions: number;
  correct_questions: number;
  accuracy_rate: number;
  updated_at: string;
}

export interface DifficultyStatistic {
  id: string;
  user_id: string;
  difficulty_level: string;
  total_questions: number;
  correct_questions: number;
  accuracy_rate: number;
  updated_at: string;
}

export interface TimeStatistic {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  average_solve_time_seconds: number;
  pace: "fast" | "normal" | "slow" | "very_slow";
  updated_at: string;
}

export interface AccuracyStatistic {
  id: string;
  user_id: string;
  subject: string;
  accuracy_rate: number;
  accuracy_rate_trend: { date: string; accuracy: number }[];
  updated_at: string;
}

export interface ConsistencyStatistic {
  id: string;
  user_id: string;
  date: string;
  contests_completed: number;
  updated_at: string;
}

export interface DashboardSummary {
  user_id: string;
  total_aura: number;
  global_rank: number | null;
  current_streak: number;
  next_tier_progress: number;
  updated_at: string;
}

export const performanceService = {
  // Get all performance dashboard data for a user
  async getPerformanceDashboardData(userId: string) {
    const supabase = await createClient();

    const [
      { data: report },
      { data: heatmaps },
      { data: subjects },
      { data: chapters },
      { data: topics },
      { data: difficulties },
      { data: times },
      { data: accuracies },
      { data: consistency },
      { data: summary }
    ] = await Promise.all([
      supabase.from("performance_reports").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("performance_heatmaps").select("*").eq("user_id", userId).order("contest_date", { ascending: false }),
      supabase.from("subject_statistics").select("*").eq("user_id", userId),
      supabase.from("chapter_statistics").select("*").eq("user_id", userId),
      supabase.from("topic_statistics").select("*").eq("user_id", userId),
      supabase.from("difficulty_statistics").select("*").eq("user_id", userId),
      supabase.from("time_statistics").select("*").eq("user_id", userId),
      supabase.from("accuracy_statistics").select("*").eq("user_id", userId),
      supabase.from("consistency_statistics").select("*").eq("user_id", userId),
      supabase.from("dashboard_summary").select("*").eq("user_id", userId).maybeSingle()
    ]);

    return {
      report: (report as PerformanceReport) || null,
      heatmaps: (heatmaps as PerformanceHeatmap[]) || [],
      subjects: (subjects as SubjectStatistic[]) || [],
      chapters: (chapters as ChapterStatistic[]) || [],
      topics: (topics as TopicStatistic[]) || [],
      difficulties: (difficulties as DifficultyStatistic[]) || [],
      times: (times as TimeStatistic[]) || [],
      accuracies: (accuracies as AccuracyStatistic[]) || [],
      consistency: (consistency as ConsistencyStatistic[]) || [],
      summary: (summary as DashboardSummary) || null
    };
  }
};
