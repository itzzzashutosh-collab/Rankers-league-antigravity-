import { FAQItem } from "../types/contests";

export const globalFAQContent: FAQItem[] = [
  {
    question: "What is a Championship on Ranker's League?",
    answer: "A Championship is a scheduled, high-fidelity competitive arena replicating the exact rules, syllabus boundaries, and difficulty thresholds of national competitive examinations. Participants compete simultaneously under active proctoring lockdown protocols to establish verified percentiles.",
    category: "General",
  },
  {
    question: "How is Row-Level Security (RLS) and data privacy maintained?",
    answer: "Every query from our frontend and API server layers goes through strict security parameter verification against Supabase. RLS policies are enabled by default across all standing tables, ensuring user data can only be modified by authentic verified sessions while public records remain transparently auditable.",
    category: "Security",
  },
  {
    question: "What are the rules regarding lockdown mode?",
    answer: "To ensure absolute academic integrity and trust, our competition interface enforces full browser lockdown. Switching tabs, opening dev tools, or losing screen focus for more than 3 seconds triggers an automatic verification flag, and repeated violations lead to immediate disqualified standing status.",
    category: "Integrity",
  },
  {
    question: "How are the rewards distributed?",
    answer: "Rewards are automatically calculated and processed via our backend standing adapter within 24 hours of contest completion. Top ranks receive direct prize pools, gold/silver certificates, and verified standing credentials visible on their public profiles.",
    category: "Rewards",
  },
];

export const contestSpecificFAQs: Record<string, FAQItem[]> = {
  "upsc-elite": [
    {
      question: "Is there negative marking in the Civil Services Elite League?",
      answer: "Yes, exactly like the actual UPSC CSE Prelims. A penalty of 1/3rd of the marks assigned to that question is deducted for every incorrect response.",
      category: "Syllabus & Rules",
    },
    {
      question: "Are calculator modules permitted?",
      answer: "Calculators are strictly prohibited. External aids of any kind will result in instant disqualification.",
      category: "Guidelines",
    },
  ],
  "jee-advanced": [
    {
      question: "How does partial marking work in the IIT JEE Advanced Apex Championship?",
      answer: "We support precise partial marking rules for multi-correct choice questions. If a question has options A, B, and C correct, selecting only A and B awards partial positive marks, provided no incorrect options are marked.",
      category: "Syllabus & Rules",
    },
    {
      question: "Is there a virtual calculator provided?",
      answer: "Yes, a standardized virtual calculator matching the IIT JEE Advanced interface will be available inside the lock-in exam terminal.",
      category: "Guidelines",
    },
  ],
};
