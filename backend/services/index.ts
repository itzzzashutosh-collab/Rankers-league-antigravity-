import { ServiceResult } from "../types/index.js";

export interface CompetitionRegistrationService {
  registerParticipant(
    leagueId: string,
    aspirantId: string
  ): Promise<ServiceResult<{ registrationReference: string }>>;
}

export * from "./calculatePrizeMatrix";
export * from "./calculateWinningStatus";
export * from "./calculateQuestionGap";

