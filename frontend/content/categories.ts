export interface CategoryItem {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string; // lucide icon name
  contestCount: number;
  color: string; // tailwind color class
}

export const categoriesContent: CategoryItem[] = [
  {
    id: "jee-main",
    name: "JEE Main",
    shortName: "JEE Main",
    description: "National-level engineering entrance championship for IITs, NITs, and CFTIs.",
    icon: "Atom",
    contestCount: 24,
    color: "text-blue-500",
  },
  {
    id: "jee-advanced",
    name: "JEE Advanced",
    shortName: "JEE Adv",
    description: "Elite-tier engineering championship for IIT admission calibration.",
    icon: "Zap",
    contestCount: 18,
    color: "text-violet-500",
  },
  {
    id: "neet",
    name: "NEET",
    shortName: "NEET",
    description: "National medical entrance championship for MBBS and BDS aspirants.",
    icon: "Heart",
    contestCount: 22,
    color: "text-rose-500",
  },
  {
    id: "bitsat",
    name: "BITSAT",
    shortName: "BITSAT",
    description: "BITS Pilani admission championship with adaptive difficulty scaling.",
    icon: "Binary",
    contestCount: 12,
    color: "text-cyan-500",
  },
  {
    id: "cuet",
    name: "CUET",
    shortName: "CUET",
    description: "Central university entrance championship across arts, science, and commerce.",
    icon: "GraduationCap",
    contestCount: 16,
    color: "text-amber-500",
  },
  {
    id: "gate",
    name: "GATE",
    shortName: "GATE",
    description: "Graduate aptitude championship for postgraduate engineering and research.",
    icon: "Cog",
    contestCount: 14,
    color: "text-emerald-500",
  },
  {
    id: "cat",
    name: "CAT",
    shortName: "CAT",
    description: "Management aptitude championship for IIM and premier B-school aspirants.",
    icon: "TrendingUp",
    contestCount: 20,
    color: "text-orange-500",
  },
  {
    id: "upsc",
    name: "UPSC Civil Services",
    shortName: "UPSC",
    description: "India\u2019s most prestigious civil services championship — Prelims and Mains.",
    icon: "Shield",
    contestCount: 30,
    color: "text-yellow-600",
  },
  {
    id: "ssc",
    name: "SSC",
    shortName: "SSC",
    description: "Staff Selection Commission championship for central government positions.",
    icon: "FileText",
    contestCount: 18,
    color: "text-teal-500",
  },
  {
    id: "banking",
    name: "Banking",
    shortName: "Banking",
    description: "IBPS, SBI, and RBI championship for banking sector recruitment.",
    icon: "Landmark",
    contestCount: 22,
    color: "text-indigo-500",
  },
  {
    id: "railway",
    name: "Railway",
    shortName: "Railway",
    description: "RRB championship series for Indian Railways recruitment examinations.",
    icon: "Train",
    contestCount: 10,
    color: "text-red-500",
  },
  {
    id: "state-level",
    name: "State Level",
    shortName: "State",
    description: "State PSC and regional-level competitive examination championships.",
    icon: "MapPin",
    contestCount: 35,
    color: "text-lime-600",
  },
  {
    id: "custom",
    name: "Custom Competitions",
    shortName: "Custom",
    description: "Institution-sponsored and community-created competitive events.",
    icon: "Sparkles",
    contestCount: 48,
    color: "text-pink-500",
  },
];
