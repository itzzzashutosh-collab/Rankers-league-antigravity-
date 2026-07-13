import { ContestTag } from "../types/contests";

export const tagsContent: ContestTag[] = [
  { id: "upsc", label: "UPSC CSE", category: "exam" },
  { id: "jee", label: "JEE Advanced", category: "exam" },
  { id: "neet", label: "NEET UG", category: "exam" },
  { id: "gate", label: "GATE CS", category: "exam" },
  { id: "clat", label: "CLAT LLM", category: "exam" },
  
  { id: "polity", label: "Polity", category: "subject" },
  { id: "history", label: "History", category: "subject" },
  { id: "physics", label: "Physics", category: "subject" },
  { id: "chemistry", label: "Chemistry", category: "subject" },
  { id: "biology", label: "Biology", category: "subject" },
  { id: "maths", label: "Mathematics", category: "subject" },
  { id: "finance-tag", label: "Corporate Finance", category: "subject" },

  { id: "elite", label: "Elite", category: "difficulty" },
  { id: "apex", label: "Apex", category: "difficulty" },
  { id: "prime", label: "Prime", category: "difficulty" },
  { id: "challenger", label: "Challenger", category: "difficulty" },

  { id: "duration-1", label: "1h - 2h", category: "duration" },
  { id: "duration-2", label: "2h - 3h", category: "duration" },
  { id: "duration-3", label: "3h+", category: "duration" },

  { id: "upcoming", label: "Upcoming", category: "status" },
  { id: "active", label: "Live Soon", category: "status" },
  { id: "completed", label: "Completed", category: "status" },
];
export const popularSearches = ["UPSC CSE", "JEE Advanced", "NEET Medical", "Free Leagues", "Elite Tier", "High Prize Pool"];
export const recentSearches = ["UPSC Civil Services Prelims", "Physics Section Apex", "Biology Module Prime"];
