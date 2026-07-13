// Supabase Database Schema Models for Results Portal

export interface SupabaseCompletedContestRow {
  id: string;
  title: string;
  category: string;
  exam: string;
  contest_date: string;
  participants_count: number;
  entry_fee: number;
  max_score: number;
  total_questions: number;
  winning_cutoff_score: number;
  winning_cutoff_rank: number;
  result_status: "published" | "under_verification" | "final";
}

export interface SupabaseCandidateStandingsRow {
  contest_id: string;
  candidate_username: string;
  rank: number;
  score: number;
  aura_points_earned: number;
  prize_allocated: number;
  payout_status: "prize_won" | "prize_processing" | "prize_credited" | "no_prize";
  proctored_violation_count: number;
}
