import { calculateWinningStatus } from "./calculateWinningStatus";

export interface QuestionGapResult {
  message: string;
  correctAnswersNeeded: number;
  marksNeeded: number;
  ranksNeeded: number;
}

interface ContestParams {
  entryFee: number;
  filledSeats: number;
  totalQuestions: number;
  maxScore: number;
}

export function calculateQuestionGap(
  contest: ContestParams,
  participantRank: number,
  participantScore: number,
  winningCutoffScore: number,
  winningCutoffRank: number
): QuestionGapResult {
  const status = calculateWinningStatus(
    contest,
    participantRank,
    participantScore,
    winningCutoffScore,
    winningCutoffRank
  );

  if (status.isWinner) {
    return {
      message: "You are in the Winning Zone!",
      correctAnswersNeeded: 0,
      marksNeeded: 0,
      ranksNeeded: 0
    };
  }

  const seed = participantRank % 3;
  let message = "";
  
  if (seed === 0) {
    message = `Correct just ${status.questionsAway} more questions to recover your entry fee.`;
  } else if (seed === 1) {
    message = `Improve by approximately ${status.marksAway} marks to enter the Winning Zone.`;
  } else {
    message = `Only ${status.ranksAway} ranks away from the reward cutoff.`;
  }

  return {
    message,
    correctAnswersNeeded: status.questionsAway,
    marksNeeded: status.marksAway,
    ranksNeeded: status.ranksAway
  };
}
export default calculateQuestionGap;
