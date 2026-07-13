export interface PrizeStatusConfig {
  status: "prize_won" | "prize_processing" | "prize_credited" | "no_prize";
  label: string;
  badgeStyle: string;
  timelineStep: number;
}

export const prizeStatuses: Record<string, PrizeStatusConfig> = {
  prize_won: {
    status: "prize_won",
    label: "Reward Unlocked",
    badgeStyle: "bg-indigo-500/10 border-indigo-500/25 text-indigo-500",
    timelineStep: 1
  },
  prize_processing: {
    status: "prize_processing",
    label: "Processing payout",
    badgeStyle: "bg-amber-500/10 border-amber-500/25 text-amber-500",
    timelineStep: 2
  },
  prize_credited: {
    status: "prize_credited",
    label: "Payout Credited",
    badgeStyle: "bg-emerald-500/10 border-emerald-500/25 text-emerald-500",
    timelineStep: 3
  },
  no_prize: {
    status: "no_prize",
    label: "No prize earned",
    badgeStyle: "bg-secondary text-muted-foreground border-border",
    timelineStep: 0
  }
};
export default prizeStatuses;
