export interface CertificateDetail {
  title: string;
  description: string;
  icon: string;
}

export const certificatesContent: CertificateDetail[] = [
  {
    title: "Participation Certificate",
    description: "Granted to all candidates who attempt and submit an official mock league exam, verifying their academic endeavor.",
    icon: "file-text",
  },
  {
    title: "Winner Certificate",
    description: "Awarded to the top Rank #1 champions in national exams as recognition of extraordinary excellence.",
    icon: "award",
  },
  {
    title: "Top Performer Certificate",
    description: "Awarded to candidates placing in the top 5% of participants, highlighting competitive mastery.",
    icon: "star",
  },
  {
    title: "National Rank Certificate",
    description: "Verifiable credentials citing candidate exact national percentile and rank coordinates.",
    icon: "shield-check",
  },
];
