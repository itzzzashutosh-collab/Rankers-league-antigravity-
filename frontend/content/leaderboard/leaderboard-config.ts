export interface LeaderboardConfig {
  maxOverallRanks: number;
  highlightTopN: number;
  pointsLabel: string;
  badgeLevels: {
    minimumPoints: number;
    label: string;
    style: string;
  }[];
}

export const leaderboardConfig: LeaderboardConfig = {
  maxOverallRanks: 1000,
  highlightTopN: 3,
  pointsLabel: "Aura",
  badgeLevels: [
    { minimumPoints: 12000, label: "Legendary Topper", style: "border-amber-500/25 bg-amber-500/10 text-amber-500" },
    { minimumPoints: 9000, label: "Elite Grandmaster", style: "border-indigo-500/25 bg-indigo-500/10 text-indigo-500" },
    { minimumPoints: 6000, label: "Master Ranker", style: "border-emerald-500/25 bg-emerald-500/10 text-emerald-500" },
    { minimumPoints: 0, label: "Active Competitor", style: "border-border bg-secondary text-muted-foreground" }
  ]
};
