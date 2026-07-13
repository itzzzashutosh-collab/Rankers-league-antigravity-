export type LiveContestStatus = "live" | "starting_soon" | "upcoming" | "completed";

export interface LiveContest {
  id: string;
  slug: string;
  title: string;
  exam: string;
  date: string;
  startTime: string; // e.g. "02:00 PM"
  duration: string;  // e.g. "3h 00m"
  entryFee: number;
  prizePool: number;
  languages: string[];
  maxParticipants: number;
  participants: number;
  seatsAvailable: number;
  status: LiveContestStatus;
  bannerGradient: string;
  registrationDeadline: string;
  startOffsetMinutes?: number; // Helper for dynamic timezone offsets in testing
}

export interface LiveRegistration {
  contestId: string;
  accessId: string;
  mobileNumber: string;
  securityCode: string;
  registrationToken: string;
  expiresAt: string; // ISO string
}

export interface CompletedContestSummary {
  id: string;
  title: string;
  winnerName: string;
  topScore: number;
  accuracy: number;
  participants: number;
  completedTime: string;
}

export interface SystemCompatibilityResult {
  browserOk: boolean;
  browserName: string;
  internetOk: boolean;
  latencyMs: number;
  resolutionOk: boolean;
  resolutionText: string;
  zoomOk: boolean;
  zoomLevel: number;
  fullscreenAvailable: boolean;
  jsEnabled: boolean;
}
