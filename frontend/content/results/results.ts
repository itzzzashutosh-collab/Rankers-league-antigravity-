export interface CompletedContest {
  id: string;
  title: string;
  category: string;
  exam: string;
  date: string;
  participants: number;
  entryFee: number;
  maxScore: number;
  totalQuestions: number;
  winningCutoffScore: number;
  winningCutoffRank: number;
  userRank: number;
  userScore: number;
  resultStatus: "published" | "under_verification" | "final";
  prizeStatus: "prize_won" | "prize_processing" | "prize_credited" | "no_prize";
  prizeClaimed?: boolean;
}

export const completedContests: CompletedContest[] = [
  {
    id: "upsc-elite-live",
    title: "Civil Services General Studies Elite Championship",
    category: "UPSC",
    exam: "UPSC CSE Prelims",
    date: "July 7, 2026",
    participants: 120,
    entryFee: 500,
    maxScore: 300,
    totalQuestions: 150,
    winningCutoffScore: 198,
    winningCutoffRank: 60,
    userRank: 12,
    userScore: 236,
    resultStatus: "published",
    prizeStatus: "prize_won",
    prizeClaimed: false
  },
  {
    id: "jee-advanced-live",
    title: "IIT JEE Math Apex Championship",
    category: "JEE Advanced",
    exam: "JEE Advanced Paper 1",
    date: "July 5, 2026",
    participants: 250,
    entryFee: 1000,
    maxScore: 360,
    totalQuestions: 90,
    winningCutoffScore: 242,
    winningCutoffRank: 125,
    userRank: 182,
    userScore: 190,
    resultStatus: "final",
    prizeStatus: "no_prize"
  },
  {
    id: "neet-prime-live",
    title: "NEET Biology Prime Championship",
    category: "NEET",
    exam: "NEET UG Biology",
    date: "July 6, 2026",
    participants: 400,
    entryFee: 300,
    maxScore: 720,
    totalQuestions: 180,
    winningCutoffScore: 590,
    winningCutoffRank: 200,
    userRank: 1,
    userScore: 720,
    resultStatus: "published",
    prizeStatus: "prize_credited",
    prizeClaimed: true
  }
];
