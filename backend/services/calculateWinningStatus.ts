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
  winningCutoffScore: number,
  winningCutoffRank: number
): WinningStatusResult {
  const matrix = calculatePrizeMatrix(contest.entryFee, contest.filledSeats);
  const isWinner = participantRank <= matrix.winnerCount;
  
  const prizeAmount = isWinner ? (matrix.prizes[participantRank - 1] || 0) : 0;
  const expectedPrize = isWinner ? prizeAmount : (matrix.prizes[matrix.winnerCount - 1] || contest.entryFee);

  const ranksAway = isWinner ? 0 : participantRank - matrix.winnerCount;
  const marksAway = isWinner ? 0 : Math.max(0, winningCutoffScore - participantScore);
  const marksPerQuestion = contest.maxScore / contest.totalQuestions;
  const questionsAway = isWinner ? 0 : Math.ceil(marksAway / marksPerQuestion);

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
