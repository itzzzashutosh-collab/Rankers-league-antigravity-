export interface PrizePoolStep {
  label: string;
  description: string;
}

export interface PrizeDistributionRow {
  rankRange: string;
  reward: string;
  winnerCount: number;
  recognition: string;
}

export const prizeSystemContent = {
  steps: [
    { label: "Entry Fees", description: "Minimal entrance payments from verified contestants." },
    { label: "Total Collection", description: "Aggregated pool of entry contributions." },
    { label: "Platform Operations", description: "Standard infrastructure fees (10-15% maximum retention)." },
    { label: "Prize Pool", description: "Net remaining funds allocated for candidate distributions." },
    { label: "Prize Distribution", description: "Algorithmic disbursements to qualifying ranks." },
  ] as PrizePoolStep[],
  distributionTable: [
    { rankRange: "Rank 1", reward: "Champion Prize (Highest allocation)", winnerCount: 1, recognition: "Gold Certificate + National Cup Badge" },
    { rankRange: "Rank 2–5", reward: "Elite Prize (High allocation)", winnerCount: 4, recognition: "Elite Certificate + Top 10 Finisher Badge" },
    { rankRange: "Rank 6–25", reward: "Performance Prize (Split pool)", winnerCount: 20, recognition: "Merit Certificate + Top 100 Badge" },
    { rankRange: "Rank 26+", reward: "Participation Recognition", winnerCount: 0, recognition: "Participation Certificate" },
  ] as PrizeDistributionRow[],
};
