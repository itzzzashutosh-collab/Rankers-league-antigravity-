export interface CareerPosition {
  id: string;
  title: string;
  department: "Engineering" | "Academics" | "Security" | "Operations";
  location: string;
  type: "Full-time" | "Contract" | "Remote";
  experience: string;
  overview: string;
  requirements: string[];
}

export interface CareersContent {
  culture: string;
  benefits: {
    title: string;
    description: string;
  }[];
  process: {
    step: string;
    title: string;
    description: string;
  }[];
  positions: CareerPosition[];
}

export const careersContent: CareersContent = {
  culture: "We are a small, elite team of developers, researchers, and curriculum specialists. We prize high ownership, clean code, scientific curiosity, and speed of execution.",
  benefits: [
    { title: "Remote-First Flexibility", description: "Work from anywhere in the world, with optional hubs for collaboration." },
    { title: "Comprehensive Health coverage", description: "Premium health insurance coverages for you and your dependents." },
    { title: "Equipment Budget", description: "Generous budget to set up your ideal workspace and hardware requirements." }
  ],
  process: [
    { step: "Step 1", title: "Resume Review", description: "We evaluate your alignment with the role based on real achievements." },
    { step: "Step 2", title: "Technical/Academic Trial", description: "A realistic work sample challenge where you show your caliber." },
    { step: "Step 3", title: "Culture Alignment", description: "Conversations with the leadership to align on vision and expectations." }
  ],
  positions: [
    {
      id: "sr-rust-backend",
      title: "Senior Backend Engineer (Rust / Node.js)",
      department: "Engineering",
      location: "Bengaluru, India / Remote",
      type: "Full-time",
      experience: "5+ Years",
      overview: "Join our core team to scale our high-throughput exam simulation servers and real-time ledger verification engines.",
      requirements: [
        "Proven experience building low-latency REST/gRPC microservices in Rust or Go.",
        "Deep familiarity with PostgreSQL transaction blocks and connection scaling.",
        "Strong understanding of cryptography and web security protocols."
      ]
    },
    {
      id: "curriculum-lead-upsc",
      title: "Curriculum Advisor (UPSC General Studies)",
      department: "Academics",
      location: "New Delhi, India / Remote",
      type: "Contract",
      experience: "8+ Years",
      overview: "Design and calibrate General Studies replica test sets matching actual UPSC Prelims and Mains complexity.",
      requirements: [
        "In-depth command of current national affairs, history, polity, and economic schemas.",
        "Past experience advising or designing questions for reputable national institutions.",
        "Ability to construct analytical questions that evaluate deduction skills."
      ]
    }
  ]
};
