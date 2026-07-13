export interface TimelineStep {
  title: string;
  duration: string;
  description: string;
}

export const timelineContent: TimelineStep[] = [
  {
    title: "Contest Ends",
    duration: "Instant",
    description: "Simulator timer runs out. Candidate workspaces are frozen and locks submitted answers.",
  },
  {
    title: "Results Published",
    duration: "T + 2 Hours",
    description: "Algorithmic grading computes scores, errors, speed logs, and publishes national rank position listings.",
  },
  {
    title: "Verification Audit",
    duration: "T + 12 Hours",
    description: "Proctor logs, browser focus departures, and anomaly triggers are reviewed by the validation engine.",
  },
  {
    title: "Prize Processing",
    duration: "T + 18 Hours",
    description: "Prizes allocations are processed, and verified certificates are compiled with unique verification hashes.",
  },
  {
    title: "Wallet Credit",
    duration: "T + 24 Hours",
    description: "Cash prizes are settled directly in Available Balance inside user Financial Center wallets.",
  },
  {
    title: "Withdrawal Available",
    duration: "Immediate after credit",
    description: "Contestants can instantly payout winnings to linked Bank Account or UPI IDs via NEFT.",
  },
];
