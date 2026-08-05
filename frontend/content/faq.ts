export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "General" | "Competitions" | "Rankings" | "Payments" | "Technical";
}

export const faqContent: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is Ranker\u2019s League?",
    answer:
      "Ranker\u2019s League is India\u2019s premier competitive examination contest platform. We host scheduled national-level competitions that replicate the exact pattern, difficulty, and timing of prestigious examinations like UPSC, JEE, NEET, CAT, GATE, SSC, and more. Aspirants compete simultaneously under standardized conditions and receive verified national rankings.",
    category: "General",
  },
  {
    id: "faq-2",
    question: "How are contests different from regular assessments?",
    answer:
      "Contests on Ranker\u2019s League are live, scheduled events where thousands of aspirants compete simultaneously — just like the real examination. Every participant starts and ends at the same time, faces the same questions, and receives a verified national ranking based on their performance. This is not self-paced; it is competitive.",
    category: "Competitions",
  },
  {
    id: "faq-3",
    question: "How is the national ranking calculated?",
    answer:
      "Rankings are calculated using a proprietary algorithm that considers raw score, accuracy rate, time efficiency, and difficulty-adjusted weightage. Every standing position undergoes automated response-pattern validation to ensure the integrity of results. Rankings are published within minutes of contest completion.",
    category: "Rankings",
  },
  {
    id: "faq-4",
    question: "What examinations are currently supported?",
    answer:
      "We currently host contests for JEE Main, JEE Advanced, NEET, BITSAT, CUET, GATE, CAT, UPSC Civil Services, SSC CGL, Banking (IBPS/SBI), Railway (RRB), State-level PSC examinations, and custom institution-sponsored competitions. New categories are added every quarter.",
    category: "Competitions",
  },
  {
    id: "faq-5",
    question: "What is the entry fee structure?",
    answer:
      "Entry fees vary by contest tier and prize pool. Standard contests start at \u20B9149 Credits, while Elite and Apex tier contests range from \u20B9299 to \u20B9499 Credits. Credits can be purchased in bundles with volume discounts. Free contests are also hosted periodically for community engagement.",
    category: "Payments",
  },
  {
    id: "faq-6",
    question: "How are prize pools distributed?",
    answer:
      "Prize pools are distributed to the top percentile performers in each contest. Typically, the top 1% receive premium rewards, top 5% receive standard rewards, and top 10% receive recognition credits. Exact distribution ratios are published on each contest\u2019s detail page before registration opens.",
    category: "Payments",
  },
  {
    id: "faq-7",
    question: "Is there anti-cheating protection?",
    answer:
      "Yes. Ranker\u2019s League employs multi-layered integrity verification including IP-based session monitoring, browser lockdown protocols, response-pattern anomaly detection, and time-sequence analysis. Any flagged submission undergoes manual review before standings are certified.",
    category: "Technical",
  },
  {
    id: "faq-8",
    question: "Can I view my performance analytics after a contest?",
    answer:
      "Absolutely. After every contest, you receive a comprehensive performance report including topic-wise accuracy, time distribution per section, national percentile, comparative analysis against top performers, improvement trajectory across seasons, and skill distribution radar charts.",
    category: "Rankings",
  },
  {
    id: "faq-9",
    question: "How do I register for a contest?",
    answer:
      "Browse the \u2018Contests\u2019 section, select your desired contest, review the details (date, time, duration, fee, prize pool), and click \u2018Register.\u2019 Ensure you have sufficient credits in your account. Registration closes 30 minutes before the scheduled start time.",
    category: "General",
  },
  {
    id: "faq-10",
    question: "What devices and browsers are supported?",
    answer:
      "Ranker\u2019s League is fully optimized for Chrome, Firefox, Safari, and Edge on desktop and laptop devices. Mobile responsive views are available for standings and analytics. Contest participation is recommended on desktop or laptop for the best experience and browser lockdown compatibility.",
    category: "Technical",
  },
];
