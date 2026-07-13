export interface Testimonial {
  id: string;
  name: string;
  exam: string;
  achievement: string;
  institution: string;
  review: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
}

export const testimonialsContent: Testimonial[] = [
  {
    id: "t1",
    name: "Aarav Sharma",
    exam: "UPSC CSE",
    achievement: "AIR 12 — Civil Services 2025",
    institution: "St. Stephen\u2019s College, Delhi",
    review:
      "Ranker\u2019s League was the closest experience to the actual UPSC Prelims I have ever encountered. The pressure, the timing, the national ranking — everything pushed me to perform at my absolute best. My percentile scores here directly correlated with my actual exam performance.",
    initials: "AS",
    gradientFrom: "from-amber-500",
    gradientTo: "to-yellow-600",
  },
  {
    id: "t2",
    name: "Meera Nair",
    exam: "NEET UG",
    achievement: "AIR 3 — NEET 2025",
    institution: "AIIMS Delhi",
    review:
      "The competitive atmosphere on this platform is unmatched. Competing against 45,000+ aspirants in real-time gave me the mental resilience I needed. The detailed performance analytics after every championship helped me identify and eliminate weak areas weeks before my actual examination.",
    initials: "MN",
    gradientFrom: "from-rose-500",
    gradientTo: "to-pink-600",
  },
  {
    id: "t3",
    name: "Kabir Verma",
    exam: "JEE Advanced",
    achievement: "AIR 7 — JEE Advanced 2025",
    institution: "IIT Bombay",
    review:
      "What sets Ranker\u2019s League apart is the caliber of competition. When you consistently rank among the top 100 out of 50,000 aspirants on this platform, you know you are ready. The transparent ranking system and verified standings gave me confidence that my preparation was on track.",
    initials: "KV",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-600",
  },
  {
    id: "t4",
    name: "Isha Patel",
    exam: "CAT",
    achievement: "99.98 Percentile — CAT 2025",
    institution: "IIM Ahmedabad",
    review:
      "The management championships on Ranker\u2019s League are exceptionally well-designed. The time pressure and question quality mirror the actual CAT experience perfectly. Competing nationally every week built a rhythm that was invaluable during the actual examination window.",
    initials: "IP",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-green-600",
  },
  {
    id: "t5",
    name: "Rohan Das",
    exam: "GATE CSE",
    achievement: "AIR 15 — GATE 2025",
    institution: "IIT Kanpur",
    review:
      "The analytical depth provided after each championship is extraordinary. The skill distribution charts, topic-wise accuracy breakdowns, and improvement trajectories gave me a data-driven approach to my preparation that traditional methods simply cannot replicate.",
    initials: "RD",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
  },
  {
    id: "t6",
    name: "Ananya Mishra",
    exam: "SSC CGL",
    achievement: "Rank 28 — SSC CGL 2025",
    institution: "Delhi University",
    review:
      "Ranker\u2019s League transformed how I approached competitive examinations. The weekly championships created a discipline and urgency that self-study alone never could. Seeing my national rank improve from 15,000 to 200 over six months was the most motivating experience of my preparation journey.",
    initials: "AM",
    gradientFrom: "from-orange-500",
    gradientTo: "to-red-600",
  },
];
