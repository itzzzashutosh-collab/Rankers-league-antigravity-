export interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  features: string[];
  popular?: boolean;
}

export const pricingContent: CreditPackage[] = [
  {
    id: "pkg-starter",
    name: "Aspirant Starter Pack",
    price: 499,
    credits: 500,
    bonusCredits: 0,
    features: [
      "Access to standard tier championships",
      "Basic accuracy reports",
      "Verified national standing certification",
    ],
  },
  {
    id: "pkg-pro",
    name: "Prestige Elite Pack",
    price: 1499,
    credits: 1500,
    bonusCredits: 200,
    features: [
      "Access to standard, prime, & elite tier championships",
      "Detailed multi-dimensional analytics reports",
      "Verification badges on public leaderboard",
      "Historical percentile improvement tracking",
    ],
    popular: true,
  },
  {
    id: "pkg-apex",
    name: "Apex Champion Pack",
    price: 2999,
    credits: 3000,
    bonusCredits: 600,
    features: [
      "Access to all championship tiers including Apex Finals",
      "All analytics, radar skill maps, and topic drills",
      "Priority verification desk validation",
      "Early reservation access for limited-seat arenas",
    ],
  },
];
