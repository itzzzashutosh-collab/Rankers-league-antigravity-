export interface FAQItem {
  question: string;
  answer: string;
}

export const leaderboardFAQ: FAQItem[] = [
  {
    question: "How are Competition Points (Aura Points) computed?",
    answer: "Aura Points are computed based on three key metrics: raw contest marks, normalized percentile rankings against other competitors, and integrity check ratings (bonuses for zero proctor warnings during lockdown sessions)."
  },
  {
    question: "How often is the public National Leaderboard updated?",
    answer: "Leaderboards update instantly upon final submission check-ins. Daily scheduled updates synchronize across the global registries at 00:00 IST to account for late window submissions."
  },
  {
    question: "What is the Trend Indicator?",
    answer: "The Trend Indicator shows rank changes compared to the previous week's standing. 'Moved Up' indicates climb, 'Moved Down' indicates drop, and 'No Change' means candidate's position is stable."
  },
  {
    question: "What does the verified check symbol beside participant profiles mean?",
    answer: "The verified check indicates that the candidate's session data passed all automatic proctored integrity algorithms (no copy-paste locks triggered, webcam blur ratings within thresholds, and no tab switches)."
  }
];
