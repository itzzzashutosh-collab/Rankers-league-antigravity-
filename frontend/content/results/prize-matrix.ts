export interface PresetPrizeMatrix {
  contestId: string;
  totalAllocation: number;
  revenueAllocation: number;
  prizePoolAllocation: number;
}

export const presetPrizeMatrices: PresetPrizeMatrix[] = [
  {
    contestId: "upsc-elite-live",
    totalAllocation: 60000,
    revenueAllocation: 18000,
    prizePoolAllocation: 42000
  },
  {
    contestId: "jee-advanced-live",
    totalAllocation: 250000,
    revenueAllocation: 75000,
    prizePoolAllocation: 175000
  }
];
export default presetPrizeMatrices;
