export interface Mentor {
  id: string;
  name: string;
  title: string;
  subject: string;
  bio: string;
  specialization: string[];
  students: string;
  rating: number;
  reviews: number;
  experience: string;
  exams: string[];
  color: string;
  accent: string;
  emoji: string;
  whatsappNumber: string;
  tagline: string;
  achievements: string[];
}

export const mentors: Mentor[] = [
  {
    id: "ashu-sir",
    name: "Ashu Sir",
    title: "Mathematics Strategist",
    subject: "Mathematics & Quantitative Aptitude",
    bio: "Known for making complex calculus and algebra feel like child's play. Ashu Sir's structured problem-solving frameworks have helped hundreds of students crack JEE and competitive exams with flying colors.",
    specialization: ["Calculus & Limits", "Algebra & Matrices", "Problem-Solving Strategy", "Speed Mathematics"],
    students: "12,000+",
    rating: 4.9,
    reviews: 2840,
    experience: "8+ Years",
    exams: ["JEE Mains", "JEE Advanced", "CUET", "NDA Math"],
    color: "from-blue-600 to-indigo-700",
    accent: "blue",
    emoji: "📐",
    whatsappNumber: "919999999999",
    tagline: "\"Math is a language. I'll make you fluent.\"",
    achievements: [
      "Top-rated JEE Mathematics mentor",
      "500+ students in IITs",
      "Author of 3 Math Strategy guides",
    ],
  },
  {
    id: "priya-maam",
    name: "Priya Ma'am",
    title: "Biology & Science Expert",
    subject: "Biology, Botany & Zoology",
    bio: "Priya Ma'am transforms complex biological systems into visual memory maps. Her holistic NCERT mastery approach and diagram-based teaching have made Biology the top-scoring subject for thousands of NEET aspirants.",
    specialization: ["NCERT Deep Dive", "Diagram Mastery", "Human Physiology", "Genetics & Evolution"],
    students: "9,500+",
    rating: 4.8,
    reviews: 1920,
    experience: "6+ Years",
    exams: ["NEET UG", "AIIMS", "JIPMER", "Class 12 Board"],
    color: "from-emerald-500 to-teal-600",
    accent: "emerald",
    emoji: "🧬",
    whatsappNumber: "919999999999",
    tagline: "\"Every diagram tells a story. Let's read it together.\"",
    achievements: [
      "NEET Biology specialist — 700+ students scored 160+/180",
      "Exclusive diagram workbook series",
      "National Biology Olympiad mentor",
    ],
  },
  {
    id: "rahul-sir",
    name: "Rahul Sir",
    title: "Physics & Mechanics Guru",
    subject: "Physics — Mechanics to Modern",
    bio: "Rahul Sir builds physical intuition from scratch. No formula memorisation — just pure conceptual understanding. His real-world analogies for Newton's laws, electromagnetism, and optics have revolutionised how students see Physics.",
    specialization: ["Mechanics & Kinematics", "Electrostatics & Magnetism", "Wave Optics", "Modern Physics"],
    students: "10,800+",
    rating: 4.9,
    reviews: 2310,
    experience: "7+ Years",
    exams: ["JEE Mains", "JEE Advanced", "NEET Physics", "CUET Science"],
    color: "from-orange-500 to-amber-600",
    accent: "orange",
    emoji: "⚡",
    whatsappNumber: "919999999999",
    tagline: "\"Physics isn't hard. It's just misunderstood.\"",
    achievements: [
      "JEE Advanced Physics — perfect 120/120 by 14 students",
      "Viral YouTube series: 'Physics in 3 Minutes'",
      "IIT Roorkee alumnus",
    ],
  },
  {
    id: "neha-maam",
    name: "Neha Ma'am",
    title: "Chemistry & GS Strategist",
    subject: "Chemistry, General Studies & Current Affairs",
    bio: "Neha Ma'am bridges the gap between Chemistry and UPSC General Science with mastery-level coaching. Her revision techniques, mnemonic systems, and high-yield topic identification have helped students ace both board exams and competitive examinations.",
    specialization: ["Organic Chemistry Reactions", "Periodic Table Mastery", "UPSC GS Science", "Current Affairs Integration"],
    students: "7,200+",
    rating: 4.8,
    reviews: 1450,
    experience: "5+ Years",
    exams: ["NEET Chemistry", "JEE Chemistry", "UPSC Prelims GS", "SSC CGL Science"],
    color: "from-violet-500 to-purple-700",
    accent: "violet",
    emoji: "🔬",
    whatsappNumber: "919999999999",
    tagline: "\"Chemistry is everywhere. Let me show you where.\"",
    achievements: [
      "100+ UPSC qualifiers in GS Science",
      "NEET Chemistry top scorer — avg 165+/180",
      "NCERT Chemistry revision masterclass: 2M+ views",
    ],
  },
];

export const mentorTestimonials = [
  { name: "Aryan Gupta", exam: "JEE Mains 2024", score: "99.4 Percentile", text: "Ashu Sir's structured approach changed everything for me.", mentor: "Ashu Sir" },
  { name: "Kavya Sharma", exam: "NEET UG 2024", score: "710/720", text: "Priya Ma'am's diagram method made Bio my strongest subject.", mentor: "Priya Ma'am" },
  { name: "Rohan Verma", exam: "JEE Advanced 2024", score: "AIR 847", text: "Rahul Sir's conceptual Physics gave me the intuition I needed.", mentor: "Rahul Sir" },
  { name: "Sneha Patel", exam: "UPSC Prelims 2024", score: "GS Score: 118", text: "Neha Ma'am's current affairs integration is unmatched.", mentor: "Neha Ma'am" },
  { name: "Dev Mishra", exam: "CUET 2024", score: "98 Percentile", text: "Ashu Sir's speed math tricks saved me 20 minutes per paper.", mentor: "Ashu Sir" },
  { name: "Priya Rao", exam: "NEET UG 2024", score: "698/720", text: "From 560 to 698 in 3 months — all thanks to Priya Ma'am.", mentor: "Priya Ma'am" },
];

export const mentorshipSteps = [
  {
    step: "01",
    title: "Choose Your Mentor",
    description: "Pick a mentor aligned with your target exam and learning style. Each mentor specialises in specific subjects.",
    icon: "🎯",
  },
  {
    step: "02",
    title: "Connect on WhatsApp",
    description: "Drop a WhatsApp message and get a personalised response. Book your first doubt session or strategy call.",
    icon: "💬",
  },
  {
    step: "03",
    title: "Compete & Grow",
    description: "Join Ranker's League contests, get your results analysed by your mentor, and watch your rank climb.",
    icon: "🚀",
  },
];
