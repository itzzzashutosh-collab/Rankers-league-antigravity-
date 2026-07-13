export type ChallengeStatus = "upcoming" | "active" | "completed";
export type CaliberTier = "elite" | "prime" | "apex";
export type VerificationStatus = "verified" | "pending" | "none";

export interface AspirantProfileContract {
  id: string;
  displayName: string;
  verificationStatus: VerificationStatus;
  globalStandingPoints: number;
  nationalRank?: number;
  joinedAt: string;
}

export interface ChampionshipLeagueContract {
  id: string;
  title: string;
  category: string;
  description?: string;
  scheduledStart: string;
  scheduledEnd: string;
  entryFeeCredits: number;
  maxParticipants: number;
  currentParticipants: number;
  status: ChallengeStatus;
  rewardsPoolCredits: number;
  difficultyTier: CaliberTier;
}

export interface StandingRecordContract {
  id: string;
  leagueId: string;
  aspirantName: string;
  aspirantTier: string;
  rankPosition: number;
  percentile: number;
  totalScore: number;
  accuracyRate: number;
  durationSeconds: number;
}
