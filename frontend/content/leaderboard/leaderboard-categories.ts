export interface LeaderboardCategory {
  id: string;
  name: string;
  maxScore: number;
}

export const leaderboardCategories: LeaderboardCategory[] = [
  { id: "all", name: "All Competitions", maxScore: 500 },
  { id: "jee-main", name: "JEE Main", maxScore: 300 },
  { id: "jee-advanced", name: "JEE Advanced", maxScore: 360 },
  { id: "neet", name: "NEET", maxScore: 720 },
  { id: "bitsat", name: "BITSAT", maxScore: 390 },
  { id: "cuet", name: "CUET", maxScore: 800 },
  { id: "cat", name: "CAT", maxScore: 198 },
  { id: "upsc", name: "UPSC", maxScore: 300 },
  { id: "gate", name: "GATE", maxScore: 100 },
  { id: "ssc", name: "SSC", maxScore: 200 },
  { id: "banking", name: "Banking", maxScore: 100 },
  { id: "railway", name: "Railway", maxScore: 100 },
  { id: "state-exams", name: "State Exams", maxScore: 200 }
];
