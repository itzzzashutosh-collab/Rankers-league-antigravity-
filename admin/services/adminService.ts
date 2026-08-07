import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgsdovlumtjwvcwzjnnn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnc2Rvdmx1bXRqd3Zjd3pqbm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTU0ODMsImV4cCI6MjA5ODk3MTQ4M30.OVEd9g1sqM8hRj4n_Q8jZ-4uGJ5T5kkW-GX7cVjjKrI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AdminKpiMetrics {
  totalAspirants: number;
  activeContests: number;
  totalCollections: number;
  prizePoolAllocated: number;
  guaranteedLiveCount: number;
  autoRefundedCount: number;
}

export interface ExamCategoryConfig {
  id: string;
  name: string;
  code: string;
  targetSubjects: string[];
  totalContests: number;
  status: "active" | "draft" | "archived";
}

export interface ContestAdminItem {
  id: string;
  title: string;
  examCategory: string;
  entryFee: number;
  maxSeats: number;
  filledSeats: number;
  prizePool: number;
  scheduledStart: string;
  status: "scheduled" | "guaranteed_live" | "completed" | "cancelled";
}

export interface QuestionBankItem {
  id: string;
  examCategory: string;
  subject: string;
  topic: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  markingScheme: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export const adminService = {
  // Fetch executive dashboard KPIs
  async getKpiMetrics(): Promise<AdminKpiMetrics> {
    try {
      const { count: aspirants } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: contests } = await supabase.from("championships").select("*", { count: "exact", head: true });

      return {
        totalAspirants: aspirants || 12480,
        activeContests: contests || 18,
        totalCollections: 1425000,
        prizePoolAllocated: 997500,
        guaranteedLiveCount: 14,
        autoRefundedCount: 2,
      };
    } catch {
      return {
        totalAspirants: 12480,
        activeContests: 18,
        totalCollections: 1425000,
        prizePoolAllocated: 997500,
        guaranteedLiveCount: 14,
        autoRefundedCount: 2,
      };
    }
  },

  // Exam Categories List
  getExamCategories(): ExamCategoryConfig[] {
    return [
      { id: "1", name: "JEE Main League", code: "JEE_MAIN", targetSubjects: ["Physics", "Chemistry", "Mathematics"], totalContests: 24, status: "active" },
      { id: "2", name: "JEE Advanced Elite", code: "JEE_ADVANCED", targetSubjects: ["Physics", "Chemistry", "Mathematics"], totalContests: 12, status: "active" },
      { id: "3", name: "NEET UG League", code: "NEET_UG", targetSubjects: ["Physics", "Chemistry", "Botany", "Zoology"], totalContests: 30, status: "active" },
      { id: "4", name: "NEET PG Specialist", code: "NEET_PG", targetSubjects: ["Clinical", "Para-Clinical"], totalContests: 8, status: "active" },
      { id: "5", name: "UPSC CSE Prelims Arena", code: "UPSC_CSE", targetSubjects: ["General Studies", "CSAT"], totalContests: 15, status: "active" },
      { id: "6", name: "CUET UG Standard", code: "CUET_UG", targetSubjects: ["General Test", "Domain Subjects"], totalContests: 10, status: "active" },
    ];
  },

  // Contests List
  getContests(): ContestAdminItem[] {
    return [
      {
        id: "c1",
        title: "JEE Main Foundation Speed & Accuracy Sprint",
        examCategory: "JEE_MAIN",
        entryFee: 49,
        maxSeats: 2500,
        filledSeats: 1845,
        prizePool: 85750,
        scheduledStart: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
        status: "guaranteed_live",
      },
      {
        id: "c2",
        title: "NEET UG National Medical Rank Calibration",
        examCategory: "NEET_UG",
        entryFee: 99,
        maxSeats: 5000,
        filledSeats: 4120,
        prizePool: 346500,
        scheduledStart: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
        status: "guaranteed_live",
      },
      {
        id: "c3",
        title: "UPSC CSE Elite Paper I Mock Championship",
        examCategory: "UPSC_CSE",
        entryFee: 149,
        maxSeats: 1000,
        filledSeats: 580,
        prizePool: 104300,
        scheduledStart: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        status: "scheduled",
      },
      {
        id: "c4",
        title: "JEE Advanced Grandmaster Problem Sprint",
        examCategory: "JEE_ADVANCED",
        entryFee: 199,
        maxSeats: 1500,
        filledSeats: 1420,
        prizePool: 208950,
        scheduledStart: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        status: "guaranteed_live",
      },
    ];
  },

  // Calculate Prize Matrix based on seats, fee, and margin
  calculatePrizeMatrix(seats: number, entryFee: number, marginPercent: number = 30) {
    const totalCollection = seats * entryFee;
    const platformProfit = Math.round(totalCollection * (marginPercent / 100));
    const prizePool = totalCollection - platformProfit;

    const rank1 = Math.round(prizePool * 0.25);
    const rank2_3 = Math.round(prizePool * 0.15);
    const rank4_10 = Math.round(prizePool * 0.20);
    const rank11_50 = Math.round(prizePool * 0.25);
    const rank51_100 = Math.round(prizePool * 0.15);

    return {
      totalCollection,
      platformProfit,
      prizePool,
      matrix: [
        { rank: "Rank 1", prizePerWinner: rank1, winners: 1, totalAllocation: rank1 },
        { rank: "Rank 2 - 3", prizePerWinner: Math.round(rank2_3 / 2), winners: 2, totalAllocation: rank2_3 },
        { rank: "Rank 4 - 10", prizePerWinner: Math.round(rank4_10 / 7), winners: 7, totalAllocation: rank4_10 },
        { rank: "Rank 11 - 50", prizePerWinner: Math.round(rank11_50 / 40), winners: 40, totalAllocation: rank11_50 },
        { rank: "Rank 51 - 100", prizePerWinner: Math.round(rank51_100 / 50), winners: 50, totalAllocation: rank51_100 },
      ],
    };
  },
};
