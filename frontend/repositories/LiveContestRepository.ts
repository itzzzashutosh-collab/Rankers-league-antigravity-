import { LiveContest, LiveRegistration, CompletedContestSummary } from "../types/live";
import { liveContestsContent } from "../content/live/live-contests";
import { upcomingContestsContent } from "../content/live/upcoming-contests";
import { completedContestsContent } from "../content/live/completed-contests";
import { contestAccessContent } from "../content/live/contest-access";

export interface VerificationSession {
  success: boolean;
  registrationToken?: string;
  error?: "invalid_id" | "incorrect_code" | "contest_closed" | "not_started" | "finished" | "too_many_attempts";
}

export interface LiveContestRepository {
  getLiveContests(): Promise<LiveContest[]>;
  getUpcomingContests(): Promise<LiveContest[]>;
  getCompletedContests(): Promise<CompletedContestSummary[]>;
  findBySlug(slug: string): Promise<LiveContest | null>;
  verifyAccess(
    slug: string,
    accessId: string,
    mobileNumber: string,
    securityCode: string
  ): Promise<VerificationSession>;
}

export class MockLiveContestRepository implements LiveContestRepository {
  // Returns all contests that are currently active or starting soon
  async getLiveContests(): Promise<LiveContest[]> {
    // Dynamic offsets can be evaluated here to simulate ticking states
    return liveContestsContent.map(contest => {
      if (contest.startOffsetMinutes !== undefined) {
        // Set dynamic date for testing starting soon vs open enrollment
        const target = new Date();
        target.setMinutes(target.getMinutes() + contest.startOffsetMinutes);
        return {
          ...contest,
          date: target.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          startTime: target.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          registrationDeadline: new Date(target.getTime() - 5 * 60 * 1000).toISOString()
        };
      }
      return contest;
    });
  }

  async getUpcomingContests(): Promise<LiveContest[]> {
    return upcomingContestsContent;
  }

  async getCompletedContests(): Promise<CompletedContestSummary[]> {
    return completedContestsContent;
  }

  async findBySlug(slug: string): Promise<LiveContest | null> {
    const live = (await this.getLiveContests()).find(c => c.slug === slug);
    if (live) return live;
    const upcoming = (await this.getUpcomingContests()).find(c => c.slug === slug);
    if (upcoming) return upcoming;
    return null;
  }

  async verifyAccess(
    slug: string,
    accessId: string,
    mobileNumber: string,
    securityCode: string
  ): Promise<VerificationSession> {
    const contest = await this.findBySlug(slug);
    if (!contest) {
      return { success: false, error: "contest_closed" };
    }

    if (contest.status === "completed") {
      return { success: false, error: "finished" };
    }

    // Verify credential matches
    const registration = contestAccessContent.find(
      r => r.accessId === accessId && r.contestId === contest.id
    );

    if (!registration) {
      return { success: false, error: "invalid_id" };
    }

    if (registration.mobileNumber !== mobileNumber.trim()) {
      return { success: false, error: "invalid_id" };
    }

    if (registration.securityCode !== securityCode.trim()) {
      return { success: false, error: "incorrect_code" };
    }

    // Return successful verification session token
    return {
      success: true,
      registrationToken: registration.registrationToken
    };
  }
}

export const liveContestRepository: LiveContestRepository = new MockLiveContestRepository();
