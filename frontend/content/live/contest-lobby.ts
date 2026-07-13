export interface InstructionsData {
  duration: string;
  questionPattern: string;
  markingScheme: string;
  negativeMarking: string;
  navigation: string[];
  submission: string[];
}

export const lobbyInstructions: Record<string, InstructionsData> = {
  "upsc-elite-live": {
    duration: "120 Minutes (2 hours) continuous. Countdown starts instantly when entering.",
    questionPattern: "100 Multiple Choice Questions (MCQ) covering UPSC CSE Prelims standards.",
    markingScheme: "Each correct choice awards +2.00 marks. Unanswered questions award 0.00 marks.",
    negativeMarking: "Penalty of 1/3rd (-0.66 marks) applies for every wrong choice.",
    navigation: [
      "You can toggle between questions by clicking numbers on the right-side question palette.",
      "Clear Response allows resetting selected choice parameters.",
      "Mark for Review lets you tag queries to solve later."
    ],
    submission: [
      "The system automatically submits responses when the timer hits zero.",
      "Manual submissions can only be triggered after 60 minutes have elapsed."
    ]
  },
  "jee-advanced-live": {
    duration: "180 Minutes (3 hours) continuous.",
    questionPattern: "54 Questions divided into Physics, Chemistry, and Mathematics sections.",
    markingScheme: "Varies dynamically: +3 or +4 for correct, partial markings apply for multi-corrects.",
    negativeMarking: "Negative marks of -1 or -2 apply to incorrect answers.",
    navigation: [
      "Use section tabs at the top toolbar to switch between Physics, Chemistry, and Math panels.",
      "Numerical keypad input is required for decimal queries."
    ],
    submission: [
      "Auto-submission locks down responses on timer completion."
    ]
  }
};

export const antiCheatPolicy = [
  "No Multiple Screens: Connection of external monitors or TV panels is prohibited.",
  "Webcam & Mic Proctoring: Continuous camera feed verification checks remain active.",
  "No Browser Switches: Navigating away from the locked tab for more than 3 seconds registers a strike.",
  "Lockdown Sandbox: Keyboard shortcuts (Ctrl+C, Ctrl+V, Alt+Tab) are disabled.",
  "System Interferences: Third-party extensions, remote sharing tools, or virtual machines block exam access."
];

export const systemRequirementsChecks = {
  minWidth: 1024,
  minHeight: 700,
  maxZoom: 120,
  recommendedBrowsers: ["Chrome", "Brave", "Safari", "Edge"]
};
