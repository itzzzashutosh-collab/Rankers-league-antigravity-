export interface PressContent {
  intro: string;
  brandAssets: {
    name: string;
    description: string;
    downloadUrl: string;
  }[];
  guidelines: string[];
  companyFacts: {
    label: string;
    value: string;
  }[];
  mediaResources: {
    title: string;
    type: string;
    url: string;
  }[];
  pressContact: {
    name: string;
    role: string;
    email: string;
  };
}

export const pressContent: PressContent = {
  intro: "Thank you for your interest in Ranker's League. Here you will find official brand guides, high-resolution logos, and core platform details.",
  brandAssets: [
    { name: "Full Logo Kit (Dark & Light)", description: "High-resolution SVGs and transparent PNGs of our primary identity.", downloadUrl: "#" },
    { name: "Brand Symbol", description: "Minimalist shield emblem for icon use.", downloadUrl: "#" }
  ],
  guidelines: [
    "Do not alter the primary logo coordinates or color channels.",
    "Maintain the exact font coordinates and proportions.",
    "Use our curated hex palette: Primary (#D4AF37), Card (#0B0F19), Background (#020617)."
  ],
  companyFacts: [
    { label: "Founded", value: "2024" },
    { label: "Simultaneous Aspirants Evaluated", value: "100,000+" },
    { label: "Supported Entrance Replicas", value: "9 Categories" },
    { label: "Headquarters", value: "Bengaluru, India" }
  ],
  mediaResources: [
    { title: "Ranker's League Launches UPSC Simulator", type: "Press Release", url: "#" },
    { title: "Platform Integrity Report Q2 2026", type: "PDF Report", url: "#" }
  ],
  pressContact: {
    name: "Vikram Malhotra",
    role: "Head of Communications",
    email: "media@rankersleague.com"
  }
};
