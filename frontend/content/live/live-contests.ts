import { LiveContest } from "../../types/live";

export const liveContestsContent: LiveContest[] = [
  {
    id: "upsc-elite-live",
    slug: "upsc-elite-live",
    title: "Civil Services Elite Live Championship",
    exam: "UPSC CSE Prelims",
    date: "", // Will be dynamically computed by Repository offset
    startTime: "",
    duration: "2h 00m",
    entryFee: 499,
    prizePool: 500000,
    languages: ["English", "Hindi"],
    maxParticipants: 5000,
    participants: 4890,
    seatsAvailable: 110,
    status: "live", // Starting in 15 mins (dynamic)
    bannerGradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
    registrationDeadline: "",
    startOffsetMinutes: 15 // Enrollment is open!
  },
  {
    id: "jee-advanced-live",
    slug: "jee-advanced-live",
    title: "IIT JEE Advanced Apex Live Arena",
    exam: "JEE Advanced",
    date: "",
    startTime: "",
    duration: "3h 00m",
    entryFee: 349,
    prizePool: 750000,
    languages: ["English"],
    maxParticipants: 10000,
    participants: 9400,
    seatsAvailable: 600,
    status: "starting_soon", // Starting in 45 mins (dynamic)
    bannerGradient: "from-violet-500/20 via-purple-500/10 to-transparent",
    registrationDeadline: "",
    startOffsetMinutes: 45 // Enrollment disabled (opens in 15 mins)
  }
];
