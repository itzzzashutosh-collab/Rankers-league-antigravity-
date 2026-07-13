export interface FaqItem {
  question: string;
  answer: string;
}

export const faqContent: FaqItem[] = [
  {
    question: "How are cash prize pools calculated?",
    answer: "Prize pools are dynamically compiled based on active enrollment size and entry values. The platform retains a fixed 10-15% processing fee for server infrastructure and proctor auditing, allocating the remaining 85-90% directly to the rank distribution ledger.",
  },
  {
    question: "When are rewards credited to my account?",
    answer: "Rewards settle inside your Available Balance wallet within exactly 24 hours of contest submission, following result verification and proctor anomaly checks.",
  },
  {
    question: "How do I withdraw my winnings?",
    answer: "Winnings can be transferred to linked Bank Accounts or UPI IDs via the Withdrawal page in your dashboard. Settlements are dispatched using secure NEFT/UPI networks and clear on T+1 banking business days.",
  },
  {
    question: "Can Aura points expire?",
    answer: "No, Aura points represent your cumulative academic achievements history and consistency on the platform. They never expire and cannot be degraded, except for disciplinary actions.",
  },
  {
    question: "Can Aura points be purchased or transferred?",
    answer: "No, Aura is strictly non-transferable and represents verified competitor achievements. It has zero monetary value and cannot be purchased or converted into currency.",
  },
  {
    question: "How are digital certificates verified?",
    answer: "Every issued certificate includes a unique verification number and QR code. Anyone can input this validation key on the public certificate verification page to audit name, rank, contest, and score details.",
  },
  {
    question: "How do badges unlock?",
    answer: "Badges unlock automatically when the system registers you crossing milestone thresholds, streak durations, or scoring cutoffs. They cannot be manually assigned.",
  },
];
