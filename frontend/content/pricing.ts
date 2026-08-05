export interface SubscriptionTier {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  badge?: string;
  popular?: boolean;
  features: {
    label: string;
    included: boolean;
    highlight?: boolean;
  }[];
  contestAccess: string;
  cta: string;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Begin your competitive journey",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "emerald",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    icon: "🌱",
    cta: "Get Started Free",
    contestAccess: "Foundation Level",
    features: [
      { label: "3 contests per month", included: true },
      { label: "Foundation level contests only", included: true },
      { label: "Basic performance report", included: true },
      { label: "National rank visibility", included: true },
      { label: "Community leaderboard access", included: true },
      { label: "Advanced analytics dashboard", included: false },
      { label: "Mentor doubt sessions", included: false },
      { label: "Priority contest registration", included: false },
      { label: "AI-powered study insights", included: false },
    ],
  },
  {
    id: "scholar",
    name: "Scholar",
    tagline: "For the consistent aspirant",
    monthlyPrice: 199,
    yearlyPrice: 139,
    color: "blue",
    gradientFrom: "#3b82f6",
    gradientTo: "#2563eb",
    icon: "🚀",
    cta: "Upgrade to Scholar",
    contestAccess: "Foundation + Scholar Level",
    features: [
      { label: "15 contests per month", included: true },
      { label: "Foundation + Scholar contests", included: true },
      { label: "Detailed performance analytics", included: true },
      { label: "National + State rank visibility", included: true },
      { label: "Full leaderboard + percentile rank", included: true },
      { label: "Advanced analytics dashboard", included: true, highlight: true },
      { label: "1 Mentor doubt session/month", included: true },
      { label: "Priority contest registration", included: false },
      { label: "AI-powered study insights", included: false },
    ],
  },
  {
    id: "champion",
    name: "Champion",
    tagline: "For warriors who compete to win",
    monthlyPrice: 399,
    yearlyPrice: 279,
    color: "amber",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
    icon: "🏆",
    badge: "Most Popular",
    popular: true,
    cta: "Become a Champion",
    contestAccess: "All Levels including Grand Prix",
    features: [
      { label: "Unlimited contests", included: true, highlight: true },
      { label: "All contest tiers + Grand Prix", included: true, highlight: true },
      { label: "Real-time performance radar map", included: true },
      { label: "National rank + district rank", included: true },
      { label: "Verified rank certificate (PDF)", included: true, highlight: true },
      { label: "Full analytics + topic drill-down", included: true, highlight: true },
      { label: "4 Mentor doubt sessions/month", included: true, highlight: true },
      { label: "Priority early-bird registration", included: true },
      { label: "AI-powered study insights", included: false },
    ],
  },
  {
    id: "legend",
    name: "Legend",
    tagline: "Elite rank hunters. No limits.",
    monthlyPrice: 699,
    yearlyPrice: 489,
    color: "violet",
    gradientFrom: "#8b5cf6",
    gradientTo: "#6d28d9",
    icon: "👑",
    cta: "Claim Legend Status",
    contestAccess: "All Levels + Legend Exclusive Finals",
    features: [
      { label: "Unlimited contests + Legend Finals", included: true, highlight: true },
      { label: "All contest tiers including Legend-only", included: true, highlight: true },
      { label: "AI-powered personalized study plan", included: true, highlight: true },
      { label: "All-India + International rank board", included: true, highlight: true },
      { label: "Digital + Physical rank trophy shipment", included: true, highlight: true },
      { label: "Full analytics + predictive scoring", included: true, highlight: true },
      { label: "Unlimited mentor doubt sessions", included: true, highlight: true },
      { label: "1-on-1 strategy call with top mentor", included: true, highlight: true },
      { label: "Early access to all new features", included: true, highlight: true },
    ],
  },
];

export const pricingFAQ = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect from the next billing cycle.",
  },
  {
    q: "What happens to my ongoing contests if I downgrade?",
    a: "Any contests you've already registered for will be honoured even after downgrading. Future registrations will follow the new plan's access.",
  },
  {
    q: "Is there a student discount?",
    a: "Our Starter plan is completely free. For bulk school/coaching institute purchases, reach out to us directly.",
  },
  {
    q: "How does the yearly billing work?",
    a: "Yearly billing saves you ~30%. You pay once for the year upfront and get all the benefits without monthly renewals.",
  },
  {
    q: "Are my rank certificates valid for college applications?",
    a: "Champion and Legend tier certificates carry our official digital signature and are designed for academic and scholarship use.",
  },
];
