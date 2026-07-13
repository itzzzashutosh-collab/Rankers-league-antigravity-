import { RewardTier } from "../types/contests";

export const globalRewardsTransparencyNote = "All cash rewards, credit distributions, and certificate issuances are processed through verified standing calculations and audits. Any user flagged for integrity violations will have their rewards frozen pending a manual audit review.";

export const rewardsByContest: Record<string, RewardTier[]> = {
  "upsc-elite": [
    {
      rank: "Rank 1",
      prize: "₹1,50,000 Cash Reward",
      recognition: "National Champion Gold Trophy",
      achievementBadge: "UPSC Supreme Master",
      pointsReward: 10000,
    },
    {
      rank: "Rank 2 - 3",
      prize: "₹75,000 Cash Reward",
      recognition: "National Elite Silver Medal",
      achievementBadge: "UPSC Grandmaster",
      pointsReward: 5000,
    },
    {
      rank: "Rank 4 - 10",
      prize: "₹25,000 Cash Reward",
      recognition: "National Distinguished Bronze Medal",
      achievementBadge: "UPSC Master",
      pointsReward: 2500,
    },
    {
      rank: "Top 1% Percentile",
      prize: "₹5,000 Cash Reward",
      recognition: "Verified Standing Certificate of Excellence",
      achievementBadge: "1st Percentile Club",
      pointsReward: 1000,
    },
    {
      rank: "Top 5% Percentile",
      prize: "₹1,000 Credits Package",
      recognition: "Verified Academic Standing Certificate",
      achievementBadge: "5th Percentile Club",
      pointsReward: 500,
    },
  ],
  "jee-advanced": [
    {
      rank: "Rank 1",
      prize: "₹2,000,00 Cash Reward",
      recognition: "IIT JEE Apex Champion Trophy",
      achievementBadge: "Apex Scholar Gold",
      pointsReward: 15000,
    },
    {
      rank: "Rank 2 - 5",
      prize: "₹1,00,000 Cash Reward",
      recognition: "Apex Scholar Silver Medal",
      achievementBadge: "Apex Scholar Silver",
      pointsReward: 7500,
    },
    {
      rank: "Rank 6 - 20",
      prize: "₹30,000 Cash Reward",
      recognition: "Apex Scholar Bronze Medal",
      achievementBadge: "Apex Scholar Bronze",
      pointsReward: 3000,
    },
    {
      rank: "Top 1% Percentile",
      prize: "₹5,000 Cash Reward",
      recognition: "Verified Apex Standing Certificate",
      achievementBadge: "Apex 1% Club",
      pointsReward: 1500,
    },
  ],
  "neet-prime": [
    {
      rank: "Rank 1",
      prize: "₹1,50,000 Cash Reward",
      recognition: "NEET Prime Cup Gold Trophy",
      achievementBadge: "Med Supreme Gold",
      pointsReward: 12000,
    },
    {
      rank: "Rank 2 - 3",
      prize: "₹75,000 Cash Reward",
      recognition: "Med Prime Silver Medal",
      achievementBadge: "Med Supreme Silver",
      pointsReward: 6000,
    },
    {
      rank: "Rank 4 - 10",
      prize: "₹20,000 Cash Reward",
      recognition: "Med Prime Bronze Medal",
      achievementBadge: "Med Supreme Bronze",
      pointsReward: 2500,
    },
  ],
};
