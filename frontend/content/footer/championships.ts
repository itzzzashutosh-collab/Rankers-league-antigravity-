export interface ChampionshipCategory {
  id: string;
  slug: string;
  title: string;
  exam: string;
  overview: string;
  eligibility: string;
  supportedExams: string[];
  upcomingContests: {
    id: string;
    title: string;
    date: string;
    fee: number;
    prizePool: number;
  }[];
  leaderboardPreview: {
    rank: number;
    name: string;
    score: number;
    percentile: number;
  }[];
  prizes: {
    bracket: string;
    reward: string;
    details: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const championshipsContent: ChampionshipCategory[] = [
  {
    id: "civil-services",
    slug: "civil-services",
    title: "Civil Services Elite League",
    exam: "UPSC CSE Prelims & Mains",
    overview: "A premium, high-fidelity replication of the Union Public Service Commission (UPSC) Civil Services Examination. Calibrated to evaluate critical thinking, logical reasoning, and syllabus depth.",
    eligibility: "Open to graduates or final year students preparing for Civil Services Examinations (Age: 21-32 recommended).",
    supportedExams: ["UPSC CSE Prelims (Paper 1 & CSAT)", "State PSC Prelims Replicas"],
    upcomingContests: [
      { id: "upsc-elite-live", title: "Civil Services General Studies Elite Championship", date: "July 12, 2026", fee: 499, prizePool: 500000 }
    ],
    leaderboardPreview: [
      { rank: 1, name: "Siddharth Verma", score: 268, percentile: 99.99 },
      { rank: 2, name: "Meera Deshmukh", score: 261, percentile: 99.95 },
      { rank: 3, name: "Aditya Hegde", score: 257, percentile: 99.92 }
    ],
    prizes: [
      { bracket: "Rank 1", reward: "₹1,00,000 Winnings + Gold Merit Certificate", details: "Direct payout to bank or UPI" },
      { bracket: "Rank 2 - 10", reward: "₹25,000 Winnings + Silver Merit Certificate", details: "Direct payout to bank or UPI" },
      { bracket: "Top 10%", reward: "Aura Tier Boost + E-Certificates", details: "Credited instantly to user dashboard" }
    ],
    faqs: [
      { q: "Is CSAT included in the Civil Services Elite League?", a: "Yes, we host both GS Paper 1 and CSAT replica tests simultaneously." },
      { q: "How are the questions calibrated?", a: "Questions are formulated by senior UPSC curriculum advisers to replicate exact complexity parameters." }
    ]
  },
  {
    id: "engineering",
    slug: "engineering",
    title: "Engineering Apex Championship",
    exam: "IIT JEE Advanced & Main",
    overview: "Engineering entrance replicas evaluating numerical solving, concept interlinking, and speed scaling. Calibrated for JEE Advanced multi-option and integer response grids.",
    eligibility: "Class 11, Class 12, and Drop-out students preparing for IIT JEE (Under 21 recommended).",
    supportedExams: ["JEE Advanced (Paper 1 & 2)", "JEE Main Replicas", "BITSAT Replicas"],
    upcomingContests: [
      { id: "jee-advanced-live", title: "IIT JEE Math Apex Championship", date: "July 15, 2026", fee: 349, prizePool: 750000 }
    ],
    leaderboardPreview: [
      { rank: 1, name: "Rahul K. Sharma", score: 342, percentile: 100.00 },
      { rank: 2, name: "Pranav Goel", score: 338, percentile: 99.98 },
      { rank: 3, name: "Isha Singhal", score: 335, percentile: 99.97 }
    ],
    prizes: [
      { bracket: "Rank 1", reward: "₹1,50,000 Winnings + Apex Scholar Award", details: "Direct payout to bank or UPI" },
      { bracket: "Top 5%", reward: "₹5,000 Contest Entry Credits", details: "Usable for joining upcoming paid leagues" }
    ],
    faqs: [
      { q: "What is the marking scheme for engineering tests?", a: "It mirrors the actual JEE Advanced dynamic pattern, including partial marking and negative scoring." }
    ]
  },
  {
    id: "medical",
    slug: "medical",
    title: "Medical Prime Cup",
    exam: "NEET UG",
    overview: "Medical entrance championships focusing on biological recall speed, chemistry reactions, and physics conceptual accuracy.",
    eligibility: "Class 11, 12, and dropper students preparing for MBBS/BDS entrance exams.",
    supportedExams: ["NEET UG Biology & Physics-Chemistry Replicas"],
    upcomingContests: [
      { id: "neet-prime-live", title: "NEET Biology Prime Championship", date: "July 18, 2026", fee: 299, prizePool: 600000 }
    ],
    leaderboardPreview: [
      { rank: 1, name: "Dr. Anjali Sen", score: 715, percentile: 99.99 },
      { rank: 2, name: "Kabir Mehta", score: 710, percentile: 99.96 },
      { rank: 3, name: "Riya Kapoor", score: 708, percentile: 99.94 }
    ],
    prizes: [
      { bracket: "Rank 1", reward: "₹1,20,000 Cash Reward + Top Medic Medal", details: "Direct payout to bank or UPI" },
      { bracket: "Top 50", reward: "₹10,000 Winnings", details: "Direct payout to bank or UPI" }
    ],
    faqs: [
      { q: "Is the NEET simulator fully compliant with the new syllabus?", a: "Yes, our academic advisors continuously update the database to match current NMC syllabi." }
    ]
  },
  {
    id: "management",
    slug: "management",
    title: "Management League Arena",
    exam: "CAT, XAT & GMAT Replicas",
    overview: "Evaluates Quantitative Aptitude, Data Interpretation, Logical Reasoning, and Verbal Ability under high pressure.",
    eligibility: "Final-year college students, working professionals, and MBA aspirants.",
    supportedExams: ["CAT Replica Mock Series", "GMAT Focus Edition Replicas", "XAT Replicas"],
    upcomingContests: [
      { id: "cat-mgmt-live", title: "Management League Aptitude Challenge", date: "July 25, 2026", fee: 399, prizePool: 400000 }
    ],
    leaderboardPreview: [
      { rank: 1, name: "Abhishek Rao", score: 182, percentile: 99.98 },
      { rank: 2, name: "Sanjana Roy", score: 178, percentile: 99.95 }
    ],
    prizes: [
      { bracket: "Rank 1", reward: "₹75,000 Cash Prize + Management Medal", details: "Direct payout to bank or UPI" }
    ],
    faqs: [
      { q: "How is the percentile calculated?", a: "It utilizes the exact multi-slot CAT normalization formula." }
    ]
  },
  {
    id: "commerce",
    slug: "commerce",
    title: "Commerce Excellence League",
    exam: "CA Foundation, CS & CMA",
    overview: "Financial accounting, mercantile law, auditing, and corporate finance replica championships.",
    eligibility: "Commerce students, CA aspirants, or graduation scholars.",
    supportedExams: ["CA Foundation Exam Replicas", "CS EET Replicas", "CMA Foundation Replicas"],
    upcomingContests: [],
    leaderboardPreview: [],
    prizes: [
      { bracket: "Top 1%", reward: "₹25,000 Cash Winnings", details: "Direct payout to bank or UPI" }
    ],
    faqs: [
      { q: "Are subjective accounts evaluated?", a: "Currently, we only grade high-caliber objective MCQ parameters." }
    ]
  },
  {
    id: "law",
    slug: "law",
    title: "Law Jurisprudence Challenge",
    exam: "CLAT PG & UG",
    overview: "Constitutional law, legal reasoning, logical deductions, and comprehension tests.",
    eligibility: "Five-year/three-year law candidates and LLM aspirants.",
    supportedExams: ["CLAT UG Replicas", "CLAT PG Replicas", "AILET Replicas"],
    upcomingContests: [],
    leaderboardPreview: [],
    prizes: [
      { bracket: "Top 5", reward: "₹30,000 Cash + Supreme Advocate Certificate", details: "Direct payout to bank or UPI" }
    ],
    faqs: [
      { q: "How does the negative marking compare?", a: "It mirrors CLAT's 0.25 negative marking penalty per incorrect choice." }
    ]
  },
  {
    id: "defence",
    slug: "defence",
    title: "Defence Forces Academy Championship",
    exam: "NDA, CDS & AFCAT",
    overview: "General ability, advanced mathematics, physics, and general studies replica exams.",
    eligibility: "Aspirants preparing for NDA, CDS, AFCAT officer entry championships.",
    supportedExams: ["NDA Written Test Replicas", "CDS General Ability & Elementary Math Replicas"],
    upcomingContests: [],
    leaderboardPreview: [],
    prizes: [
      { bracket: "Rank 1", reward: "₹50,000 Cash Prize + Officer Merit Badge", details: "Direct payout to bank or UPI" }
    ],
    faqs: [
      { q: "Are SSB stages evaluated?", a: "We only replicate the written screening stages of defense entrances." }
    ]
  },
  {
    id: "school",
    slug: "school",
    title: "School Talent & Olympiad Championship",
    exam: "NTSE & Science/Math Olympiads",
    overview: "Mental ability tests (MAT), scholastic aptitude tests (SAT), and NSO/IMO level replicas.",
    eligibility: "Students currently enrolled in Classes 8 to 12.",
    supportedExams: ["NTSE Stage 1 & 2 Replicas", "International Mathematics/Science Olympiad Replicas"],
    upcomingContests: [],
    leaderboardPreview: [],
    prizes: [
      { bracket: "Rank 1-5", reward: "₹20,000 Scholarship Grant", details: "Credited for educational resources" }
    ],
    faqs: [
      { q: "Can secondary class students register?", a: "Yes, there are age-specific brackets (Junior and Senior categories)." }
    ]
  },
  {
    id: "international",
    slug: "international",
    title: "International Scholastic Arena",
    exam: "SAT & Graduate Aptitude Replicas",
    overview: "Quantitative reasoning, reading comprehension, and logical analytical writing replicas matching global standards.",
    eligibility: "High school and undergraduate scholars aiming for international colleges.",
    supportedExams: ["Digital SAT Replicas", "GRE General Test Replicas", "GMAT Focus Replicas"],
    upcomingContests: [],
    leaderboardPreview: [],
    prizes: [
      { bracket: "Top 5%", reward: "Global Scholar Certificate + Premium Mentorship Voucher", details: "Sent via certified email" }
    ],
    faqs: [
      { q: "Is the SAT calculator allowed?", a: "Yes, our interface embeds a digital scientific calculator mimicking DESMOS." }
    ]
  }
];
