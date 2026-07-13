export interface ContestRulesData {
  title: string;
  description: string;
  points: string[];
}

export const generalContestRules: ContestRulesData[] = [
  {
    title: "System Parameters & Integrity",
    description: "Every participant must meet these standard system requirements to participate in active leagues.",
    points: [
      "Operating System must be Windows, macOS, or Linux (mobile and tablets are not supported for Elite/Apex leagues).",
      "Latest version of Google Chrome, Brave, or Safari is required.",
      "Active webcam and microphone access is mandatory for proctoring verification.",
    ],
  },
  {
    title: "Active Lockdown Protocol",
    description: "The championship environment enforces a strict lockdown window to ensure absolute fairness.",
    points: [
      "Any tab switch, window minimization, or secondary screen activity will trigger a warning.",
      "Receiving more than 2 warning flags results in automatic disqualification with a status of 'Failed'.",
      "Keyboard shortcuts like Ctrl+C, Ctrl+V, Alt+Tab, and right-click menus are disabled.",
    ],
  },
  {
    title: "Timings & Submission Rules",
    description: "Strict adherence to schedule parameters is expected from all participants.",
    points: [
      "Join the arena at least 15 minutes before the scheduled start time for verification setup.",
      "No late entries are permitted after the countdown timer hits 00:00:00.",
      "Automated submission is triggered exactly at the scheduled end time. Leftover questions will not be evaluated.",
    ],
  },
];

export const rulesByContest: Record<string, ContestRulesData[]> = {
  "upsc-elite": [
    {
      title: "UPSC Standard Rules",
      description: "Additional instructions calibrated to UPSC standards.",
      points: [
        "Negative marking is applied: 1/3rd (0.66 marks for Paper I) penalty per incorrect choice.",
        "Both Paper I (GS) and Paper II (CSAT) must be completed to qualify for the verified leaderboard standings.",
        "Minimum qualifying mark for CSAT is 33% (66.67 marks).",
      ],
    },
  ],
  "jee-advanced": [
    {
      title: "JEE Advanced Specific Rules",
      description: "Calibrated marking instructions for JEE Apex competitions.",
      points: [
        "Single-correct, Multiple-correct, and Numerical value questions are present in random distributions.",
        "Negative marking applies to single-correct questions (-1 mark).",
        "Partial marking (+1 or +2) is awarded for multiple-correct questions based on the correctness ratio.",
      ],
    },
  ],
};
