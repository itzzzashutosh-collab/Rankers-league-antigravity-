export type ContestDifficulty = "Elite" | "Apex" | "Prime" | "Challenger";
export type ContestStatus = "upcoming" | "active" | "completed";

export interface ContestCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  count: number;
}

export interface ContestTag {
  id: string;
  label: string;
  category: "subject" | "exam" | "difficulty" | "duration" | "status";
}

export interface SyllabusChapter {
  name: string;
  topics: string[];
  weightage: number; // percentage
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface SyllabusSubject {
  subject: string;
  chapters: SyllabusChapter[];
  difficultyDistribution: { Easy: number; Medium: number; Hard: number }; // percentage
}

export interface RewardTier {
  rank: string;
  prize: string;
  recognition: string;
  achievementBadge?: string;
  pointsReward?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface ScheduleStep {
  step: string;
  time: string;
  description: string;
  status: "completed" | "active" | "upcoming";
}

export interface Contest {
  id: string;
  slug: string;
  title: string;
  exam: string;
  category: string;
  entryFee: number; // in Credits or INR
  prizePool: number;
  participants: number;
  maxParticipants: number;
  difficulty: ContestDifficulty;
  date: string; // "July 12, 2026"
  time: string; // "09:30 AM"
  duration: string; // "2h 00m"
  seatsAvailable: number;
  status: ContestStatus;
  bannerGradient: string;
  language: string; // "English" | "Hindi" etc
  country: string; // "India" | "International"
  isFeatured: boolean;
  isTrending: boolean;
  registrationDeadline: string; // "July 11, 2026 11:59 PM"
}

export interface ContestDetail extends Contest {
  overview: string;
  eligibility: string;
  structure: string[];
  syllabus: SyllabusSubject[];
  rewards: RewardTier[];
  rules: string[];
  timeline: ScheduleStep[];
  faq: FAQItem[];
}
