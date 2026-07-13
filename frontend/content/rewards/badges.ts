export interface BadgeDefinition {
  title: string;
  description: string;
  requirement: string;
  icon: string;
}

export const badgesContent: BadgeDefinition[] = [
  {
    title: "First Competition",
    description: "Earned upon completing your first official simulator league.",
    requirement: "Complete 1 contest",
    icon: "🚀",
  },
  {
    title: "Top 100",
    description: "Awarded for placing in the national top 100 results.",
    requirement: "Rank <= 100 in 1 contest",
    icon: "🏅",
  },
  {
    title: "Consistency Master",
    description: "Awarded for keeping a 30-day consecutive daily activity streak.",
    requirement: "Streak >= 30 days",
    icon: "🔥",
  },
  {
    title: "Aura Legend",
    description: "Awarded upon crossing the threshold of 12,000 cumulative Aura points.",
    requirement: "Aura >= 12,000 pts",
    icon: "💎",
  },
];
