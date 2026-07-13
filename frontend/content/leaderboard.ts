export interface LeaderboardEntry {
  rank: number;
  name: string;
  institution: string;
  score: number;
  accuracy: number;
  country: string;
  achievement: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

export const leaderboardContent: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Aarav Sharma",
    institution: "IIT Delhi",
    score: 296,
    accuracy: 98.7,
    country: "India",
    achievement: "National Topper",
    initials: "AS",
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-600",
  },
  {
    rank: 2,
    name: "Meera Nair",
    institution: "AIIMS Delhi",
    score: 712,
    accuracy: 99.1,
    country: "India",
    achievement: "Medical Champion",
    initials: "MN",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-600",
  },
  {
    rank: 3,
    name: "Kabir Verma",
    institution: "IIT Bombay",
    score: 290,
    accuracy: 97.0,
    country: "India",
    achievement: "Engineering Elite",
    initials: "KV",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-600",
  },
  {
    rank: 4,
    name: "Isha Patel",
    institution: "NLSIU Bangalore",
    score: 184.5,
    accuracy: 95.0,
    country: "India",
    achievement: "Civil Services Star",
    initials: "IP",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-600",
  },
  {
    rank: 5,
    name: "Rohan Das",
    institution: "IIT Kanpur",
    score: 288,
    accuracy: 96.5,
    country: "India",
    achievement: "Consistent Performer",
    initials: "RD",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
  },
  {
    rank: 6,
    name: "Ananya Mishra",
    institution: "MAMC Delhi",
    score: 698,
    accuracy: 96.8,
    country: "India",
    achievement: "Rising Star",
    initials: "AM",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
  },
  {
    rank: 7,
    name: "Siddharth Rao",
    institution: "IIT Madras",
    score: 285,
    accuracy: 95.2,
    country: "India",
    achievement: "Season Finalist",
    initials: "SR",
    gradientFrom: "from-teal-500",
    gradientTo: "to-emerald-600",
  },
  {
    rank: 8,
    name: "Priya Singh",
    institution: "IIM Ahmedabad",
    score: 265,
    accuracy: 94.8,
    country: "India",
    achievement: "Management Prodigy",
    initials: "PS",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-violet-600",
  },
];
