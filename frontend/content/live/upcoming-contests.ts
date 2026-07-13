import { LiveContest } from "../../types/live";

export const upcomingContestsContent: LiveContest[] = [
  {
    id: "neet-prime-live",
    slug: "neet-prime-live",
    title: "NEET Medical Prime Live Championship",
    exam: "NEET UG",
    date: "July 12, 2026",
    startTime: "10:00 AM",
    duration: "3h 20m",
    entryFee: 299,
    prizePool: 600000,
    languages: ["English"],
    maxParticipants: 8000,
    participants: 4100,
    seatsAvailable: 3900,
    status: "upcoming",
    bannerGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    registrationDeadline: "July 11, 2026 11:59 PM"
  },
  {
    id: "finance-live",
    slug: "finance-live",
    title: "Quantitative Finance Live League",
    exam: "Financial Risk Manager (FRM)",
    date: "July 15, 2026",
    startTime: "04:00 PM",
    duration: "1h 30m",
    entryFee: 0,
    prizePool: 250000,
    languages: ["English"],
    maxParticipants: 5000,
    participants: 1200,
    seatsAvailable: 3800,
    status: "upcoming",
    bannerGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    registrationDeadline: "July 14, 2026 11:59 PM"
  },
  {
    id: "law-live",
    slug: "law-live",
    title: "Constitutional Law Jurisprudence Championship",
    exam: "CLAT PG",
    date: "July 18, 2026",
    startTime: "11:00 AM",
    duration: "2h 00m",
    entryFee: 199,
    prizePool: 300000,
    languages: ["English"],
    maxParticipants: 4000,
    participants: 1100,
    seatsAvailable: 2900,
    status: "upcoming",
    bannerGradient: "from-blue-500/20 via-sky-500/10 to-transparent",
    registrationDeadline: "July 17, 2026 11:59 PM"
  }
];
