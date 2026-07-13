export interface FeaturedContest {
  id: string;
  title: string;
  exam: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  difficulty: "Elite" | "Apex" | "Prime" | "Challenger";
  date: string;
  time: string;
  duration: string;
  seatsAvailable: number;
  bannerGradient: string;
  status: "Registration Open" | "Filling Fast" | "Almost Full" | "Completed";
}

export const featuredContestsContent: FeaturedContest[] = [
  {
    id: "upsc-elite-s7",
    title: "Civil Services Elite League",
    exam: "UPSC CSE Prelims",
    entryFee: 499,
    prizePool: 500000,
    participants: 38492,
    maxParticipants: 50000,
    difficulty: "Elite",
    date: "July 12, 2026",
    time: "09:30 AM",
    duration: "2h 00m",
    seatsAvailable: 11508,
    bannerGradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    status: "Registration Open",
  },
  {
    id: "jee-apex-s7",
    title: "IIT JEE Apex Championship",
    exam: "JEE Advanced",
    entryFee: 349,
    prizePool: 750000,
    participants: 52100,
    maxParticipants: 80000,
    difficulty: "Apex",
    date: "July 15, 2026",
    time: "02:00 PM",
    duration: "3h 00m",
    seatsAvailable: 27900,
    bannerGradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    status: "Registration Open",
  },
  {
    id: "neet-prime-s7",
    title: "NEET Medical Prime Cup",
    exam: "NEET UG",
    entryFee: 299,
    prizePool: 600000,
    participants: 45900,
    maxParticipants: 60000,
    difficulty: "Prime",
    date: "July 18, 2026",
    time: "10:00 AM",
    duration: "3h 20m",
    seatsAvailable: 14100,
    bannerGradient: "from-rose-500/20 via-pink-500/10 to-transparent",
    status: "Filling Fast",
  },
  {
    id: "cat-challenger-s7",
    title: "CAT Management Prestige Cup",
    exam: "CAT MBA",
    entryFee: 199,
    prizePool: 400000,
    participants: 21300,
    maxParticipants: 40000,
    difficulty: "Challenger",
    date: "July 22, 2026",
    time: "03:00 PM",
    duration: "2h 00m",
    seatsAvailable: 18700,
    bannerGradient: "from-orange-500/20 via-amber-500/10 to-transparent",
    status: "Registration Open",
  },
  {
    id: "gate-elite-s7",
    title: "GATE Engineering Elite Series",
    exam: "GATE CSE",
    entryFee: 249,
    prizePool: 350000,
    participants: 18700,
    maxParticipants: 30000,
    difficulty: "Elite",
    date: "July 25, 2026",
    time: "11:00 AM",
    duration: "3h 00m",
    seatsAvailable: 11300,
    bannerGradient: "from-emerald-500/20 via-green-500/10 to-transparent",
    status: "Registration Open",
  },
  {
    id: "ssc-prime-s7",
    title: "SSC National Prime Challenge",
    exam: "SSC CGL",
    entryFee: 149,
    prizePool: 250000,
    participants: 32500,
    maxParticipants: 50000,
    difficulty: "Prime",
    date: "July 28, 2026",
    time: "09:00 AM",
    duration: "1h 00m",
    seatsAvailable: 17500,
    bannerGradient: "from-teal-500/20 via-cyan-500/10 to-transparent",
    status: "Registration Open",
  },
];
