export interface ResultCompetitor {
  rank: number;
  username: string;
  category: string;
  score: number;
  totalCombinedMarks: number;
  prize: number;
  countryFlag: string;
  isCurrentUser?: boolean;
}

export const completedLeaderboards: Record<string, ResultCompetitor[]> = {
  "upsc-elite-live": [
    { rank: 1, username: "aspirant_delhi", category: "UPSC", score: 286, totalCombinedMarks: 4820, prize: 5400, countryFlag: "🇮🇳" },
    { rank: 2, username: "ias_dreamer", category: "UPSC", score: 278, totalCombinedMarks: 4350, prize: 4200, countryFlag: "🇮🇳" },
    { rank: 3, username: "st_stephens_star", category: "UPSC", score: 272, totalCombinedMarks: 3920, prize: 3600, countryFlag: "🇮🇳" },
    { rank: 12, username: "aspirant101", category: "UPSC", score: 236, totalCombinedMarks: 3120, prize: 2400, countryFlag: "🇮🇳", isCurrentUser: true },
    { rank: 60, username: "cutoff_survivor", category: "UPSC", score: 198, totalCombinedMarks: 2480, prize: 500, countryFlag: "🇮🇳" },
    { rank: 61, username: "unlucky_candidate", category: "UPSC", score: 196, totalCombinedMarks: 2420, prize: 0, countryFlag: "🇮🇳" }
  ],
  "jee-advanced-live": [
    { rank: 1, username: "iit_bombay_elite", category: "JEE Advanced", score: 342, totalCombinedMarks: 6940, prize: 11500, countryFlag: "🇮🇳" },
    { rank: 2, username: "math_genius", category: "JEE Advanced", score: 336, totalCombinedMarks: 6280, prize: 9800, countryFlag: "🇮🇳" },
    { rank: 125, username: "cutoff_jee", category: "JEE Advanced", score: 242, totalCombinedMarks: 3840, prize: 1000, countryFlag: "🇮🇳" },
    { rank: 182, username: "aspirant101", category: "JEE Advanced", score: 190, totalCombinedMarks: 2950, prize: 0, countryFlag: "🇮🇳", isCurrentUser: true }
  ],
  "neet-prime-live": [
    { rank: 1, username: "aspirant101", category: "NEET", score: 720, totalCombinedMarks: 8640, prize: 10500, countryFlag: "🇮🇳", isCurrentUser: true },
    { rank: 2, username: "doctor_hopeful", category: "NEET", score: 712, totalCombinedMarks: 7420, prize: 8400, countryFlag: "🇮🇳" },
    { rank: 200, username: "cutoff_medic", category: "NEET", score: 590, totalCombinedMarks: 4120, prize: 300, countryFlag: "🇮🇳" }
  ]
};
export default completedLeaderboards;
