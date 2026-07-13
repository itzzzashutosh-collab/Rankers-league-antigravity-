import { SyllabusSubject } from "../types/contests";

export const eligibilityByContest: Record<string, string> = {
  "upsc-elite": "Open to all candidates preparing for the UPSC Civil Services Examination. No age restriction, but recommended for serious aspirants who have completed basic graduation modules. The calibration matches actual Civil Services Prelims complexity parameters.",
  "jee-advanced": "Open to engineering aspirants preparing for JEE Advanced. Ideally suited for students in Grade 12 or drop years targeting Top 500 IIT ranks. Analytical complexity requires deep calculus and logical deduction capacity.",
  "neet-prime": "Open to medical aspirants preparing for NEET-UG. suited for Grade 12 or dropper candidates looking to verify their Speed-Accuracy coefficient across Biology, Chemistry, and Physics.",
};

export const structureByContest: Record<string, string[]> = {
  "upsc-elite": [
    "General Studies Paper I: 100 Objective Questions | 200 Marks | 2-hour duration.",
    "Negative marking applies: -0.66 marks for every wrong response.",
    "Questions span Current Affairs, Indian History, Geography, Polity, Economics, and Environmental Science.",
    "Proctored lockdown protocol requires active webcam connection throughout.",
  ],
  "jee-advanced": [
    "Combined PC&M Paper: Physics, Chemistry, and Mathematics sections.",
    "Total Questions: 54 (18 questions per subject) | 180 Marks | 3-hour duration.",
    "Marking scheme features single correct options, multiple correct options (with partial marking), and numerical values.",
    "Sandboxed virtual calculator provided.",
  ],
  "neet-prime": [
    "Single Paper: Physics (50 questions), Chemistry (50 questions), Botany (50 questions), and Zoology (50 questions).",
    "Total of 200 questions out of which 180 must be answered.",
    "Standard marking: +4 for correct option, -1 for incorrect option.",
    "Duration: 3 hours and 20 minutes.",
  ],
};

export const syllabusByContest: Record<string, SyllabusSubject[]> = {
  "upsc-elite": [
    {
      subject: "Indian Polity & Governance",
      chapters: [
        { name: "Constitutional Framework", topics: ["Fundamental Rights", "Directive Principles", "Amendments"], weightage: 35, difficulty: "Hard" },
        { name: "System of Government", topics: ["Parliamentary System", "Federal Structure", "Centre-State Relations"], weightage: 30, difficulty: "Medium" },
        { name: "Judiciary & Panchayati Raj", topics: ["Supreme Court", "High Courts", "73rd and 74th Amendments"], weightage: 35, difficulty: "Medium" },
      ],
      difficultyDistribution: { Easy: 20, Medium: 50, Hard: 30 },
    },
    {
      subject: "Indian History & National Movement",
      chapters: [
        { name: "Modern History", topics: ["1857 Revolt", "Indian National Congress", "Gandhian Era"], weightage: 50, difficulty: "Hard" },
        { name: "Ancient & Medieval India", topics: ["Indus Valley", "Mauryas & Guptas", "Mughal Empire"], weightage: 30, difficulty: "Medium" },
        { name: "Art & Culture", topics: ["Temple Architecture", "Classical Dances", "Literature"], weightage: 20, difficulty: "Hard" },
      ],
      difficultyDistribution: { Easy: 10, Medium: 40, Hard: 50 },
    },
    {
      subject: "Geography & Ecology",
      chapters: [
        { name: "Physical Geography", topics: ["Geomorphology", "Climatology", "Oceanography"], weightage: 40, difficulty: "Medium" },
        { name: "Ecology & Climate Change", topics: ["Biodiversity", "International Conventions", "Pollution Control"], weightage: 60, difficulty: "Hard" },
      ],
      difficultyDistribution: { Easy: 30, Medium: 30, Hard: 40 },
    },
  ],
  "jee-advanced": [
    {
      subject: "Physics",
      chapters: [
        { name: "Mechanics", topics: ["Rotational Dynamics", "Gravitation", "Fluid Mechanics"], weightage: 40, difficulty: "Hard" },
        { name: "Electromagnetism", topics: ["Electrostatics", "Electromagnetic Induction", "AC Circuits"], weightage: 40, difficulty: "Hard" },
        { name: "Modern Physics", topics: ["Photoelectric Effect", "Radioactivity", "Bohr Model"], weightage: 20, difficulty: "Medium" },
      ],
      difficultyDistribution: { Easy: 10, Medium: 30, Hard: 60 },
    },
    {
      subject: "Mathematics",
      chapters: [
        { name: "Calculus", topics: ["Limits & Continuity", "Definite Integration", "Differential Equations"], weightage: 45, difficulty: "Hard" },
        { name: "Algebra & Probability", topics: ["Matrices & Determinants", "Probability Distributions", "Complex Numbers"], weightage: 35, difficulty: "Hard" },
        { name: "Coordinate Geometry", topics: ["Conic Sections", "Straight Lines", "Hyperbola"], weightage: 20, difficulty: "Medium" },
      ],
      difficultyDistribution: { Easy: 15, Medium: 25, Hard: 60 },
    },
  ],
};
export const overviewOverview = "This is a premium, proctored competition. Participants must abide by all integrity rules.";
