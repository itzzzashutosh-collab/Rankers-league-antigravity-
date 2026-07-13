export interface AuraTierRule {
  tier: string;
  minPoints: number;
  color: string;
  badge: string;
}

export const auraContent = {
  description: "Aura is a non-transferable competitive metric indicating consistency, accuracy, and engagement. It represents your prestige rank on the platform and cannot be purchased or traded.",
  earningRules: [
    "Completing Mock Tests: Base Aura points awarded upon successful submission.",
    "Section Accuracy: Bonuses applied for zero error subject outputs.",
    "Consecutive Days Streaks: Daily multipliers increase points earned.",
    "Achievements Unlocked: Significant milestone bonuses credited instantly.",
  ],
  tiers: [
    { tier: "Explorer", minPoints: 0, color: "text-zinc-400 border-zinc-500/20 bg-zinc-500/5", badge: " Explorer" },
    { tier: "Challenger", minPoints: 500, color: "text-sky-400 border-sky-500/20 bg-sky-500/5", badge: " Challenger" },
    { tier: "Achiever", minPoints: 1000, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", badge: " Achiever" },
    { tier: "Elite", minPoints: 2000, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5", badge: " Elite" },
    { tier: "Master", minPoints: 4000, color: "text-purple-400 border-purple-500/20 bg-purple-500/5", badge: " Master" },
    { tier: "Champion", minPoints: 7000, color: "text-pink-400 border-pink-500/20 bg-pink-500/5", badge: " Champion" },
    { tier: "Legend", minPoints: 12000, color: "text-amber-400 border-amber-500/20 bg-amber-500/5", badge: " Legend" },
    { tier: "Grandmaster", minPoints: 20000, color: "text-rose-400 border-rose-500/20 bg-rose-500/5", badge: " Grandmaster" },
  ] as AuraTierRule[],
};
