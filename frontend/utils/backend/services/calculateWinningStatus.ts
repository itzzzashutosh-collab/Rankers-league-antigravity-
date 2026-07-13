import { calculatePrizeMatrix } from "./calculatePrizeMatrix";

export interface WinningStatusResult {
  prizeAmount: number;
  isWinner: boolean;
  winningStatus: "won" | "lost";
  ranksAway: number;
  marksAway: number;
  questionsAway: number;
  expectedPrize: number;
  winningZoneStatus: "prize_won" | "safe_zone" | "no_prize";
}

interface ContestParams {
  entryFee: number;
  filledSeats: number;
  totalQuestions: number;
  maxScore: number;
}

export function calculateWinningStatus(
  contest: ContestParams,
  participantRank: number,
  participantScore: number,
  winningCutoffScore: number, // Score of the last winner (Rank W)
  winningCutoffRank: number   // Rank W
): WinningStatusResult {
  const matrix = calculatePrizeMatrix(contest.entryFee, contest.filledSeats);
  const isWinner = participantRank <= matrix.winnerCount;
  
  const prizeAmount = isWinner ? (matrix.prizes[participantRank - 1] || 0) : 0;
  const expectedPrize = isWinner ? prizeAmount : (matrix.prizes[matrix.winnerCount - 1] || contest.entryFee);

  const ranksAway = isWinner ? 0 : participantRank - matrix.winnerCount;
  
  // Marks and questions away
  const marksAway = isWinner ? 0 : Math.max(0, winningCutoffScore - participantScore);
  const marksPerQuestion = contest.maxScore / contest.totalQuestions;
  const questionsAway = isWinner ? 0 : Math.ceil(marksAway / marksPerQuestion);

  // Winning Zone:
  // - prize_won: Rank is in top slots (earning more than entry fee)
  // - safe_zone: Rank is in bottom slots (earning exactly entry fee or close)
  // - no_prize: no prize
  let winningZoneStatus: "prize_won" | "safe_zone" | "no_prize" = "no_prize";
  if (isWinner) {
    winningZoneStatus = prizeAmount > contest.entryFee ? "prize_won" : "safe_zone";
  }

  return {
    prizeAmount,
    isWinner,
    winningStatus: isWinner ? "won" : "lost",
    ranksAway,
    marksAway,
    questionsAway,
    expectedPrize,
    winningZoneStatus
  };
}
