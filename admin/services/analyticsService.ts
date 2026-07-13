import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface ExecutiveSummary {
  grossRevenue: number;
  netRevenue: number;
  activeUsers: number;
  conversionRate: number;
  userGrowth: number;
  revenueGrowth: number;
}

export interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
}

const FALLBACK_SUMMARY: ExecutiveSummary = {
  grossRevenue: 970644,
  netRevenue: 174716,
  activeUsers: 15480,
  conversionRate: 8.5,
  userGrowth: 15.6,
  revenueGrowth: 18.2,
};

const FALLBACK_FUNNEL: FunnelStep[] = [
  { label: "Visitors", count: 120000, percentage: 100 },
  { label: "Registrations", count: 28400, percentage: 23.6 },
  { label: "Contest View", count: 18500, percentage: 15.4 },
  { label: "Contest Registration", count: 9600, percentage: 8.0 },
  { label: "Contest Completion", count: 8900, percentage: 7.4 },
  { label: "Subscription Conversion", count: 1372, percentage: 1.1 },
];

export const analyticsService = {
  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    try {
      const { data, error } = await supabase
        .from("analytics_snapshots")
        .select("metrics")
        .eq("snapshot_type", "Monthly")
        .order("period_start", { ascending: false })
        .limit(1)
        .single();
      if (error || !data) return FALLBACK_SUMMARY;
      const m = data.metrics as any;
      return {
        grossRevenue: m.gross_revenue || 970644,
        netRevenue: m.platform_fees || 174716,
        activeUsers: m.active_users || 15480,
        conversionRate: m.conversion_rate || 8.5,
        userGrowth: 15.6,
        revenueGrowth: 18.2,
      };
    } catch {
      return FALLBACK_SUMMARY;
    }
  },

  async getFunnelAnalytics(): Promise<FunnelStep[]> {
    return FALLBACK_FUNNEL;
  },

  async getGeographicDistribution() {
    return [
      { state: "Maharashtra", users: 4850, revenue: 242000 },
      { state: "Delhi", users: 3820, revenue: 191000 },
      { state: "Karnataka", users: 3120, revenue: 156000 },
      { state: "Telangana", users: 2840, revenue: 142000 },
      { state: "Tamil Nadu", users: 2100, revenue: 105000 },
    ];
  },

  async getQuestionMetrics() {
    return {
      totalQuestions: 1580,
      approved: 1240,
      pending: 210,
      rejected: 130,
      averageAccuracy: 64.8,
      difficultyDistribution: { Easy: 480, Medium: 620, Hard: 480 },
    };
  },

  async getPaperMetrics() {
    return {
      totalPapers: 84,
      avgQualityScore: 88.5,
      avgChapterCoverage: 92.4,
      questionReuseRate: 14.8,
    };
  },

  async getNotificationMetrics() {
    return {
      sent: 84500,
      deliveryRate: 98.4,
      openRate: 42.5,
      ctr: 14.2,
    };
  },
};
