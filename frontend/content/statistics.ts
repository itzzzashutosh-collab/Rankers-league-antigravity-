export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

export const statisticsContent: StatItem[] = [
  { value: 240000, suffix: "+", label: "Registered Aspirants" },
  { value: 1850, suffix: "+", label: "Championships Conducted" },
  { value: 12, suffix: "M+", label: "Questions Resolved" },
  { value: 85, suffix: "Cr+", prefix: "\u20B9", label: "Rewards Distributed" },
  { value: 28, suffix: "+", label: "Countries" },
  { value: 94.6, suffix: "%", label: "Aspirant Satisfaction" },
];
