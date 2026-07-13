export interface ResultCompetitor {
  rank: number;
  username: string;
  category: string;
  score: number;
  auraPoints: number;
  prize: number;
  countryFlag: string;
  isCurrentUser?: boolean;
}

export const completedLeaderboards: Record<string, ResultCompetitor[]> = {
  "upsc-elite-live": [
    { rank: 1, username: "aspirant_delhi", category: "UPSC", score: 286, auraPoints: 12480, prize: 5400, countryFlag: "🇮🇳" },
    { rank: 2, username: "ias_dreamer", category: "UPSC", score: 278, auraPoints: 11920, prize: 4200, countryFlag: "🇮🇳" },
    { rank: 3, username: "st_stephens_star", category: "UPSC", score: 272, auraPoints: 11050, prize: 3600, countryFlag: "🇮🇳" },
    { rank: 12, username: "aspirant101", category: "UPSC", score: 236, auraPoints: 10920, prize: 2400, countryFlag: "🇮🇳", isCurrentUser: true },
    { rank: 60, username: "cutoff_survivor", category: "UPSC", score: 198, auraPoints: 8900, prize: 500, countryFlag: "🇮🇳" },
    { rank: 61, username: "unlucky_candidate", category: "UPSC", score: 196, auraPoints: 8800, prize: 0, countryFlag: "🇮🇳" }
  ],
  "jee-advanced-live": [
    { rank: 1, username: "iit_bombay_elite", category: "JEE Advanced", score: 342, auraPoints: 12940, prize: 11500, countryFlag: "🇮🇳" },
    { rank: 2, username: "math_genius", category: "JEE Advanced", score: 336, auraPoints: 11840, prize: 9800, countryFlag: "🇮🇳" },
    { rank: 125, username: "cutoff_jee", category: "JEE Advanced", score: 242, auraPoints: 8400, prize: 1000, countryFlag: "🇮🇳" },
    { rank: 182, username: "aspirant101", category: "JEE Advanced", score: 190, auraPoints: 7200, prize: 0, countryFlag: "🇮🇳", isCurrentUser: true }
  ],
  "neet-prime-live": [
    { rank: 1, username: "aspirant101", category: "NEET", score: 720, auraPoints: 13120, prize: 10500, countryFlag: "🇮🇳", isCurrentUser: true },
    { rank: 2, username: "doctor_hopeful", category: "NEET", score: 712, auraPoints: 12050, prize: 8400, countryFlag: "🇮🇳" },
    { rank: 200, username: "cutoff_medic", category: "NEET", score: 590, auraPoints: 7400, prize: 300, countryFlag: "🇮🇳" }
  ]
};
export default completedLeaderboards;
