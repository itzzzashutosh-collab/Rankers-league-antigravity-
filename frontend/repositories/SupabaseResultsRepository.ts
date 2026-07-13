import { CompletedContest } from "../content/results/results";
import { ResultCompetitor } from "../content/results/leaderboard";
import { SupabaseCompletedContestRow, SupabaseCandidateStandingsRow } from "../types/supabase-results";

// Mock Supabase client query methods for future Supabase client swapping
export class SupabaseResultsRepository {
  // RPC interface mapping: get_contest_leaderboard
  async fetchContestLeaderboard(contestId: string): Promise<ResultCompetitor[]> {
    // Future database query:
    // const { data, error } = await supabaseClient.rpc('get_contest_leaderboard', { target_contest_id: contestId });
    return [];
  }

  // Row mapper adapter
  adaptContestRow(row: SupabaseCompletedContestRow, standing: SupabaseCandidateStandingsRow): CompletedContest {
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      exam: row.exam,
      date: row.contest_date,
      participants: row.participants_count,
      entryFee: row.entry_fee,
      maxScore: row.max_score,
      totalQuestions: row.total_questions,
      winningCutoffScore: row.winning_cutoff_score,
      winningCutoffRank: row.winning_cutoff_rank,
      userRank: standing.rank,
      userScore: standing.score,
      resultStatus: row.result_status,
      prizeStatus: standing.payout_status
    };
  }
}

export const supabaseResultsRepository = new SupabaseResultsRepository();
