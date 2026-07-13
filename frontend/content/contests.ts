import { ContestDetail } from "../types/contests";
import { eligibilityByContest, structureByContest, syllabusByContest } from "./contest-details";
import { rulesByContest, generalContestRules } from "./contest-rules";
import { rewardsByContest } from "./contest-rewards";
import { scheduleByContest } from "./contest-schedule";
import { globalFAQContent, contestSpecificFAQs } from "./contest-faq";

export const contestsContent: ContestDetail[] = [
  {
    id: "upsc-elite",
    slug: "upsc-elite",
    title: "Civil Services Elite League",
    exam: "UPSC CSE Prelims",
    category: "Civil Services",
    entryFee: 499,
    prizePool: 500000,
    participants: 38492,
    maxParticipants: 50000,
    difficulty: "Elite",
    date: "July 12, 2026",
    time: "09:30 AM",
    duration: "2h 00m",
    seatsAvailable: 11508,
    status: "upcoming",
    bannerGradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    language: "English",
    country: "India",
    isFeatured: true,
    isTrending: true,
    registrationDeadline: "July 11, 2026 11:59 PM",
    overview: "A high-fidelity replication of the UPSC Civil Services Preliminary examination. This championship features paper sets calibrated to replicate actual UPSC complexity parameters to help candidates verify their national standing percentile.",
    eligibility: eligibilityByContest["upsc-elite"],
    structure: structureByContest["upsc-elite"],
    syllabus: syllabusByContest["upsc-elite"],
    rewards: rewardsByContest["upsc-elite"],
    rules: [
      ...generalContestRules[1].points, // lockdown rules
      ...rulesByContest["upsc-elite"][0].points
    ],
    timeline: scheduleByContest["upsc-elite"],
    faq: [
      ...globalFAQContent,
      ...contestSpecificFAQs["upsc-elite"]
    ]
  },
  {
    id: "jee-advanced",
    slug: "jee-advanced",
    title: "IIT JEE Advanced Apex Championship",
    exam: "JEE Advanced",
    category: "Engineering",
    entryFee: 349,
    prizePool: 750000,
    participants: 52100,
    maxParticipants: 80000,
    difficulty: "Apex",
    date: "July 15, 2026",
    time: "02:00 PM",
    duration: "3h 00m",
    seatsAvailable: 27900,
    status: "upcoming",
    bannerGradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    language: "English & Hindi",
    country: "India",
    isFeatured: true,
    isTrending: true,
    registrationDeadline: "July 14, 2026 11:59 PM",
    overview: "Engineering entrance championship built to evaluate analytical capacity under strict time frames. Questions are drafted by experienced IIT educators to simulate authentic JEE Advanced constraints.",
    eligibility: eligibilityByContest["jee-advanced"],
    structure: structureByContest["jee-advanced"],
    syllabus: syllabusByContest["jee-advanced"],
    rewards: rewardsByContest["jee-advanced"],
    rules: [
      ...generalContestRules[1].points,
      ...rulesByContest["jee-advanced"][0].points
    ],
    timeline: scheduleByContest["jee-advanced"],
    faq: [
      ...globalFAQContent,
      ...contestSpecificFAQs["jee-advanced"]
    ]
  },
  {
    id: "neet-prime",
    slug: "neet-prime",
    title: "NEET Medical Prime Cup",
    exam: "NEET UG",
    category: "Medical Sciences",
    entryFee: 299,
    prizePool: 600000,
    participants: 45900,
    maxParticipants: 60000,
    difficulty: "Prime",
    date: "July 18, 2026",
    time: "10:00 AM",
    duration: "3h 20m",
    seatsAvailable: 14100,
    status: "upcoming",
    bannerGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    language: "English",
    country: "India",
    isFeatured: true,
    isTrending: false,
    registrationDeadline: "July 17, 2026 11:59 PM",
    overview: "Medical sciences entrance replica evaluating speed, recall depth, and precision parameters across Biology, Chemistry, and Physics subjects.",
    eligibility: eligibilityByContest["neet-prime"],
    structure: structureByContest["neet-prime"],
    syllabus: [], // Will fall back to default empty state or display beautifully
    rewards: rewardsByContest["neet-prime"],
    rules: [
      ...generalContestRules[1].points
    ],
    timeline: scheduleByContest["neet-prime"],
    faq: globalFAQContent
  },
  {
    id: "finance-league",
    slug: "finance-league",
    title: "Quantitative Finance League Arena",
    exam: "Financial Risk Manager (FRM)",
    category: "Finance & Accounting",
    entryFee: 250,
    prizePool: 250000,
    participants: 8400,
    maxParticipants: 10000,
    difficulty: "Challenger",
    date: "July 20, 2026",
    time: "04:00 PM",
    duration: "1h 30m",
    seatsAvailable: 1600,
    status: "upcoming",
    bannerGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    language: "English",
    country: "International",
    isFeatured: false,
    isTrending: true,
    registrationDeadline: "July 19, 2026 11:59 PM",
    overview: "A specialized risk assessment league evaluating portfolio management, options pricing, and actuarial probability theory under high pressure.",
    eligibility: "Finance students, MBA graduates, and CFA/FRM candidates.",
    structure: [
      "50 Quantitative Multiple Choice Questions.",
      "No negative marking.",
      "Proctored zoom feed not required, sandbox lockdown active.",
    ],
    syllabus: [],
    rewards: [
      { rank: "Rank 1", prize: "₹50,000 Credits Package", recognition: "Gold Portfolio manager badge" },
      { rank: "Top 5%", prize: "₹5,000 Credits Package", recognition: "Verified Risk specialist standing" }
    ],
    rules: [
      ...generalContestRules[1].points
    ],
    timeline: [
      { step: "Lockdown validation", time: "03:45 PM", description: "Verification check", status: "completed" },
      { step: "Quantitative Finance release", time: "04:00 PM", description: "Exam commencing", status: "active" }
    ],
    faq: globalFAQContent
  },
  {
    id: "law-jurisprudence",
    slug: "law-jurisprudence",
    title: "Constitutional Law Jurisprudence Challenge",
    exam: "CLAT PG",
    category: "Law",
    entryFee: 199,
    prizePool: 300000,
    participants: 4100,
    maxParticipants: 5000,
    difficulty: "Prime",
    date: "July 05, 2026", // Completed contest
    time: "11:00 AM",
    duration: "2h 00m",
    seatsAvailable: 0,
    status: "completed",
    bannerGradient: "from-blue-500/20 via-sky-500/10 to-transparent",
    language: "English",
    country: "India",
    isFeatured: false,
    isTrending: false,
    registrationDeadline: "July 04, 2026 11:59 PM",
    overview: "Comprehensive law league focusing on constitutional jurisprudence, legal reasoning, case analysis, and judicial interpretations.",
    eligibility: "LLB / LLM students or candidates preparing for CLAT PG.",
    structure: [
      "120 questions split into objective law queries.",
      "Negative marking of 0.25 penalty per wrong option.",
    ],
    syllabus: [],
    rewards: [
      { rank: "Rank 1", prize: "₹50,000 Cash Reward", recognition: "Supreme Advocate Gold Certificate" }
    ],
    rules: [
      ...generalContestRules[1].points
    ],
    timeline: [
      { step: "Championship Completed", time: "01:00 PM", description: "Evaluated successfully and standings posted.", status: "completed" }
    ],
    faq: globalFAQContent
  }
];
