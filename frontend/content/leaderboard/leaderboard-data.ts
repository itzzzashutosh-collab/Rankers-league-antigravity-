export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatarUrl?: string;
  initials: string;
  category: string; // e.g. "upsc", "jee-advanced", "neet", "cat"
  auraPoints: number;
  score: number;
  maxScore: number;
  country: string; // "india" | "international" | "global"
  countryFlag: string; // Flag emoji
  institution: string;
  achievementBadge: string;
  trend: "up" | "down" | "stable";
  timeframe: "weekly" | "monthly" | "overall";
}

export const leaderboardData: LeaderboardEntry[] = [
  // 1. UPSC Toppers
  {
    rank: 1,
    name: "Ananya Deshmukh",
    initials: "AD",
    category: "upsc",
    auraPoints: 12480,
    score: 286,
    maxScore: 300,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "St. Stephen's College",
    achievementBadge: "All India Rank 1",
    trend: "up",
    timeframe: "overall"
  },
  {
    rank: 2,
    name: "Rohan Singhal",
    initials: "RS",
    category: "upsc",
    auraPoints: 11920,
    score: 278,
    maxScore: 300,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIT Kanpur",
    achievementBadge: "National Elite",
    trend: "stable",
    timeframe: "overall"
  },
  {
    rank: 3,
    name: "Sanya Sen",
    initials: "SS",
    category: "upsc",
    auraPoints: 11050,
    score: 272,
    maxScore: 300,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "JNU Delhi",
    achievementBadge: "Civil Services Elite",
    trend: "down",
    timeframe: "overall"
  },
  {
    rank: 4,
    name: "Aditya Hegde",
    initials: "AH",
    category: "upsc",
    auraPoints: 9480,
    score: 260,
    maxScore: 300,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "RV College of Engineering",
    achievementBadge: "Rising Aspirant",
    trend: "up",
    timeframe: "overall"
  },

  // 2. JEE Advanced Toppers
  {
    rank: 1,
    name: "Priyansh Mehta",
    initials: "PM",
    category: "jee-advanced",
    auraPoints: 12940,
    score: 342,
    maxScore: 360,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIT Bombay",
    achievementBadge: "Engineering Legend",
    trend: "up",
    timeframe: "overall"
  },
  {
    rank: 2,
    name: "Aravind K.",
    initials: "AK",
    category: "jee-advanced",
    auraPoints: 11840,
    score: 336,
    maxScore: 360,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIT Madras",
    achievementBadge: "Math Prodigy",
    trend: "stable",
    timeframe: "overall"
  },
  {
    rank: 3,
    name: "David Vance",
    initials: "DV",
    category: "jee-advanced",
    auraPoints: 10920,
    score: 320,
    maxScore: 360,
    country: "international",
    countryFlag: "🇺🇸",
    institution: "Stanford Prep",
    achievementBadge: "Overseas Genius",
    trend: "up",
    timeframe: "overall"
  },

  // 3. NEET Toppers
  {
    rank: 1,
    name: "Meera Nair",
    initials: "MN",
    category: "neet",
    auraPoints: 13120,
    score: 720,
    maxScore: 720,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "AIIMS Delhi",
    achievementBadge: "Perfect Score 720",
    trend: "stable",
    timeframe: "overall"
  },
  {
    rank: 2,
    name: "Isha Patel",
    initials: "IP",
    category: "neet",
    auraPoints: 12050,
    score: 712,
    maxScore: 720,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "MAMC Delhi",
    achievementBadge: "Medical Champion",
    trend: "up",
    timeframe: "overall"
  },
  {
    rank: 3,
    name: "Sarah Lin",
    initials: "SL",
    category: "neet",
    auraPoints: 10480,
    score: 700,
    maxScore: 720,
    country: "international",
    countryFlag: "🇸🇬",
    institution: "Singapore National School",
    achievementBadge: "Global Medic Elite",
    trend: "down",
    timeframe: "overall"
  },

  // 4. CAT Toppers
  {
    rank: 1,
    name: "Kabir Verma",
    initials: "KV",
    category: "cat",
    auraPoints: 12210,
    score: 188,
    maxScore: 198,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIM Ahmedabad",
    achievementBadge: "99.99 Percentile",
    trend: "up",
    timeframe: "overall"
  },
  {
    rank: 2,
    name: "Siddharth Rao",
    initials: "SR",
    category: "cat",
    auraPoints: 11420,
    score: 176,
    maxScore: 198,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "FMS Delhi",
    achievementBadge: "Management Prodigy",
    trend: "stable",
    timeframe: "overall"
  },

  // 5. BITSAT Toppers
  {
    rank: 1,
    name: "Rohan Das",
    initials: "RD",
    category: "bitsat",
    auraPoints: 11980,
    score: 382,
    maxScore: 390,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "BITS Pilani",
    achievementBadge: "BITSAT Topper",
    trend: "up",
    timeframe: "overall"
  },
  {
    rank: 2,
    name: "Priya Singh",
    initials: "PS",
    category: "bitsat",
    auraPoints: 10950,
    score: 365,
    maxScore: 390,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "BITS Goa",
    achievementBadge: "Elite Scholar",
    trend: "down",
    timeframe: "overall"
  },

  // Weekly and Monthly variations
  {
    rank: 1,
    name: "Kabir Verma",
    initials: "KV",
    category: "cat",
    auraPoints: 3480,
    score: 188,
    maxScore: 198,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIM Ahmedabad",
    achievementBadge: "Weekly Topper",
    trend: "up",
    timeframe: "weekly"
  },
  {
    rank: 2,
    name: "Ananya Deshmukh",
    initials: "AD",
    category: "upsc",
    auraPoints: 3200,
    score: 286,
    maxScore: 300,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "St. Stephen's College",
    achievementBadge: "Weekly Climber",
    trend: "up",
    timeframe: "weekly"
  },
  {
    rank: 3,
    name: "Meera Nair",
    initials: "MN",
    category: "neet",
    auraPoints: 3100,
    score: 720,
    maxScore: 720,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "AIIMS Delhi",
    achievementBadge: "Weekly Shield",
    trend: "stable",
    timeframe: "weekly"
  },
  {
    rank: 1,
    name: "Priyansh Mehta",
    initials: "PM",
    category: "jee-advanced",
    auraPoints: 9800,
    score: 342,
    maxScore: 360,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIT Bombay",
    achievementBadge: "Monthly Champion",
    trend: "up",
    timeframe: "monthly"
  },
  {
    rank: 2,
    name: "Meera Nair",
    initials: "MN",
    category: "neet",
    auraPoints: 9520,
    score: 720,
    maxScore: 720,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "AIIMS Delhi",
    achievementBadge: "Monthly Star",
    trend: "stable",
    timeframe: "monthly"
  },
  {
    rank: 3,
    name: "Rohan Singhal",
    initials: "RS",
    category: "upsc",
    auraPoints: 8900,
    score: 278,
    maxScore: 300,
    country: "india",
    countryFlag: "🇮🇳",
    institution: "IIT Kanpur",
    achievementBadge: "Monthly Challenger",
    trend: "up",
    timeframe: "monthly"
  }
];
