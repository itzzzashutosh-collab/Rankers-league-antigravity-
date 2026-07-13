export type LeagueStatus = "upcoming" | "active" | "completed";

export interface LeagueRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  scheduled_start: string;
  scheduled_end: string;
  entry_fee_credits: number;
  max_participants: number;
  current_participants: number;
  status: LeagueStatus;
  rewards_pool_credits: number;
  difficulty_tier: "elite" | "prime" | "apex";
}

export interface StandingRecord {
  id: string;
  league_id: string;
  aspirant_name: string;
  aspirant_tier: string;
  rank_position: number;
  percentile: number;
  total_score: number;
  accuracy_rate: number; // e.g. 98.5
  duration_seconds: number;
  avatar_url?: string;
}

export interface AspirantProfile {
  id: string;
  display_name: string;
  verification_status: "verified" | "pending" | "none";
  global_standing_points: number;
  national_rank: number;
  joined_at: string;
}
