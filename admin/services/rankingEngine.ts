export interface CandidateSubmission {
  username: string;
  score: number;
  time_taken_seconds: number;
  hard_questions_correct_count: number;
  regional_zone: string;
  category: string;
}

export interface CandidateRankedResult {
  username: string;
  score: number;
  time_taken_seconds: number;
  overall_rank: number;
  regional_rank: number;
  category_rank: number;
}

export const rankingEngine = {
  calculateRanks(
    submissions: CandidateSubmission[],
    tieBreakRules: string[] = ["Higher Score", "Less Time Taken", "Higher Hard Question Accuracy"]
  ): CandidateRankedResult[] {
    
    // Sort submissions based on configured tie breakers
    const sorted = [...submissions].sort((a, b) => {
      // Rule 1: Score comparison
      if (a.score !== b.score) {
        return b.score - a.score; // Higher score wins
      }

      // Rule 2: Less Time Taken
      if (tieBreakRules.includes("Less Time Taken")) {
        if (a.time_taken_seconds !== b.time_taken_seconds) {
          return a.time_taken_seconds - b.time_taken_seconds; // Less time wins
        }
      }

      // Rule 3: Hard Question Accuracy
      if (tieBreakRules.includes("Higher Hard Question Accuracy")) {
        if (a.hard_questions_correct_count !== b.hard_questions_correct_count) {
          return b.hard_questions_correct_count - a.hard_questions_correct_count; // More hard questions wins
        }
      }

      // Fallback: alphabetical username sorting
      return a.username.localeCompare(b.username);
    });

    // Compute ranks (overall, regional, category)
    const regionalCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};

    return sorted.map((sub, idx) => {
      // Calculate overall rank
      const overall_rank = idx + 1;

      // Calculate regional rank
      const reg = sub.regional_zone;
      regionalCounts[reg] = (regionalCounts[reg] || 0) + 1;
      const regional_rank = regionalCounts[reg];

      // Calculate category rank
      const cat = sub.category;
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      const category_rank = categoryCounts[cat];

      return {
        username: sub.username,
        score: sub.score,
        time_taken_seconds: sub.time_taken_seconds,
        overall_rank,
        regional_rank,
        category_rank
      };
    });
  }
};
