export interface AboutContent {
  title: string;
  subtitle: string;
  story: string;
  mission: string;
  vision: string;
  values: {
    title: string;
    description: string;
  }[];
  whyUs: {
    title: string;
    description: string;
  }[];
  technology: {
    coreStack: string;
    proctorEngine: string;
    databaseSecurity: string;
  };
  security: string[];
  roadmap: {
    phase: string;
    timeline: string;
    milestones: string[];
  }[];
}

export const aboutContent: AboutContent = {
  title: "About Ranker's League",
  subtitle: "Defining the global standard of high-fidelity pre-examination evaluation.",
  story: "Ranker's League was established in 2024 by academic educators and systems engineers who recognized a critical gap: standard mock exams lacked the security, complexity calibration, and competitive pressure of actual exams. We built a real-time proctor simulator to evaluate real competitive caliber.",
  mission: "To construct a meritocratic, completely transparent environment where candidates from any background can test their boundaries and verify their true percentile standing.",
  vision: "To become the official, secure national standard of preparation validation before aspirants sit for actual high-stake examinations.",
  values: [
    { title: "Rigorous Authenticity", description: "Our question banks and exams match the absolute blueprint of actual target examinations." },
    { title: "Absolute Security", description: "Every submission undergoes software-lockdown inspections to guarantee honest leaderboards." },
    { title: "Merit Recognition", description: "Providing direct financial sponsorships, prestige ranks, and certificates to top performers." }
  ],
  whyUs: [
    { title: "Real-Time Calibration", description: "We do not use generic questions. Questions are crafted dynamically to evaluate logical interlinking." },
    { title: "National Benchmarking", description: "Benchmarked against thousands of simultaneous aspirants to simulate realistic percentile curves." }
  ],
  technology: {
    coreStack: "Built on Next.js 15 App Router, TypeScript, and TailwindCSS for ultra-low latency server rendering.",
    proctorEngine: "Employs client-side sandbox lockdown trackers that evaluate tab switches, window resizing, and clipboard state updates during active sessions.",
    databaseSecurity: "Utilizes Supabase Postgres database with strict Row-Level Security (RLS) rules and pgSQL audit log triggers."
  },
  security: [
    "SHA-256 validation hashes for every exam submit record.",
    "Decentralized secure ledger transaction logging.",
    "Hardware and browser-signature identity verification."
  ],
  roadmap: [
    {
      phase: "Phase 1: Foundation",
      timeline: "Q1 - Q2 2025",
      milestones: ["Launch core engine", "JEE and NEET replica templates", "Kyc ledger integrations"]
    },
    {
      phase: "Phase 2: Scale",
      timeline: "Q3 - Q4 2025",
      milestones: ["Civil Services Elite replica rollout", "Deploy instant notification centers", "Onboard 100K+ aspirants"]
    },
    {
      phase: "Phase 3: Public APIs",
      timeline: "Q1 - Q2 2026",
      milestones: ["Open verification endpoints for institutions", "Implement automated prize settlements", "Introduce mobile simulators"]
    }
  ]
};
