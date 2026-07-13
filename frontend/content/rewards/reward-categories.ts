export interface RewardCategory {
  title: string;
  description: string;
  icon: string;
}

export const rewardCategories: RewardCategory[] = [
  {
    title: "Prize Money",
    description: "Cash rewards awarded to eligible winners. Disbursed directly into the Prize Wallet.",
    icon: "coins",
  },
  {
    title: "Aura Points",
    description: "Competition points earned after every contest. Aura represents long-term consistency.",
    icon: "sparkles",
  },
  {
    title: "Achievement Badges",
    description: "Milestone-based recognition collectible items representing special ranks and streaks.",
    icon: "award",
  },
  {
    title: "Certificates",
    description: "Official participation and achievement digital certificates with secure blockchain-like verification ID.",
    icon: "file-text",
  },
  {
    title: "Leaderboard Recognition",
    description: "Appear on national and global rankings. Highlight your academic excellence to the world.",
    icon: "trophy",
  },
  {
    title: "Special Event Rewards",
    description: "Limited-time rewards, anniversary badges, and exclusive incentives for special invitation contests.",
    icon: "zap",
  },
];
