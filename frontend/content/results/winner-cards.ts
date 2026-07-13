export interface WinnerCardType {
  rank: number;
  label: string;
  badgeStyle: string;
}

export const winnerCardsConfig: Record<number, WinnerCardType> = {
  1: {
    rank: 1,
    label: "Rank 1 Topper",
    badgeStyle: "bg-amber-500/10 border-amber-500/25 text-amber-500 font-extrabold"
  },
  2: {
    rank: 2,
    label: "Rank 2 Challenger",
    badgeStyle: "bg-slate-400/10 border-slate-400/25 text-slate-400 font-extrabold"
  },
  3: {
    rank: 3,
    label: "Rank 3 Bronze Placement",
    badgeStyle: "bg-amber-700/10 border-amber-700/25 text-amber-700 font-extrabold"
  }
};
export default winnerCardsConfig;
