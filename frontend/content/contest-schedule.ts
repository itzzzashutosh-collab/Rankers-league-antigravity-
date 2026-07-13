import { ScheduleStep } from "../types/contests";

export const globalScheduleGuidelines = "Leagues commence dynamically on the specified starting second. Make sure to log in 15 minutes early to finalize camera verification parameters and browser lockdown permissions.";

export const scheduleByContest: Record<string, ScheduleStep[]> = {
  "upsc-elite": [
    {
      step: "Arena Check-In & Identity Verification",
      time: "09:15 AM",
      description: "Lockdown engine activates. Webcam, browser focus check, and identity verification modules are initialized.",
      status: "completed",
    },
    {
      step: "Paper I (General Studies) Release",
      time: "09:30 AM",
      description: "General Studies question bank unlocked. Timing countdown triggers. 100 high-fidelity UPSC Preliminary questions are loaded.",
      status: "active",
    },
    {
      step: "Mid-Term Review & Integrity Validation",
      time: "10:30 AM",
      description: "Webcam parameters validated. Standing snapshot verification checks completed.",
      status: "upcoming",
    },
    {
      step: "Paper I Completed & Automatic Upload",
      time: "11:30 AM",
      description: "Submission window closes. Answer scripts are archived, and RLS keys locked down.",
      status: "upcoming",
    },
  ],
  "jee-advanced": [
    {
      step: "Identity Verification & Setup Check",
      time: "01:45 PM",
      description: "Browser sandbox mode initializes. Keyboard shortcut inhibitors checked.",
      status: "completed",
    },
    {
      step: "IIT JEE Advanced Apex Arena Launch",
      time: "02:00 PM",
      description: "Official contest workspace unlocked. Numerical response variables and multi-correct choice sections active.",
      status: "active",
    },
    {
      step: "Automated Evaluation & Standing Process",
      time: "05:00 PM",
      description: "Testing concludes. Evaluators and standing generators compute marks and partial-marks allocations.",
      status: "upcoming",
    },
  ],
  "neet-prime": [
    {
      step: "Medical Prime Proctored Portal Access",
      time: "09:45 AM",
      description: "Biometric and identity checks. Zoom / proctor camera feed checked.",
      status: "completed",
    },
    {
      step: "Biology, Physics & Chemistry Cup Commences",
      time: "10:00 AM",
      description: "200 medical objective questions unlocked. Answer panels initialized.",
      status: "active",
    },
    {
      step: "Championship Window Closed",
      time: "01:20 PM",
      description: "All candidate scripts stored. RLS security locked.",
      status: "upcoming",
    },
  ],
};
