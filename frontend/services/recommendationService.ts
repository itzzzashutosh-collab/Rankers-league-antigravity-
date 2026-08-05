import { Contest } from "@/types/contests";
import { EXAM_CATEGORY_LABELS, ExamCategory } from "@/types/auth";
import { regionService } from "./regionService";

export interface UserExamPreference {
  examCategory: ExamCategory;
  examName: string;
  region?: string;
}

export const recommendationService = {
  // Dynamically match & rank contests tailored to a candidate's chosen target exam and region
  getRecommendedContests(contests: Contest[], userPref: UserExamPreference): Contest[] {
    if (!contests || contests.length === 0) return [];

    const examCat = userPref.examCategory;
    const examName = userPref.examName || EXAM_CATEGORY_LABELS[examCat] || "JEE Main";
    const targetLower = examName.toLowerCase();
    const activeRegion = userPref.region || regionService.detectUserRegion();

    const matched = contests.filter((c) => {
      // 1. Regional Scope Filtering
      if (activeRegion === "international") {
        if (c.regionScope === "india" && c.currency === "INR") return false;
      }

      const examLower = c.exam.toLowerCase();
      const catLower = c.category.toLowerCase();
      const titleLower = c.title.toLowerCase();

      // Engineering / JEE
      if (examCat === "JEE_MAIN" || examCat === "JEE_ADVANCED") {
        return catLower.includes("engineering") || examLower.includes("jee") || titleLower.includes("jee");
      }
      // Civil Services / UPSC
      if (examCat === "UPSC_CSE") {
        return catLower.includes("civil services") || examLower.includes("upsc") || titleLower.includes("upsc");
      }
      // Medical / NEET
      if (examCat === "NEET_UG" || examCat === "NEET_PG") {
        return catLower.includes("medical") || examLower.includes("neet") || titleLower.includes("neet");
      }
      // Management / CAT / XAT
      if (examCat === "CAT" || examCat === "XAT") {
        return catLower.includes("finance") || catLower.includes("management") || examLower.includes("cat");
      }
      // Law / CLAT
      if (examCat === "CLAT" || examCat === "AILET") {
        return catLower.includes("law") || examLower.includes("clat");
      }
      // International / SAT / GRE / GMAT
      if (examCat === "GMAT" || c.category === "International" || c.currency === "USD") {
        return catLower.includes("international") || examLower.includes("sat") || examLower.includes("gre") || examLower.includes("gmat");
      }

      return (
        examLower.includes(targetLower) ||
        catLower.includes(targetLower) ||
        titleLower.includes(targetLower)
      );
    });

    // Fallback: If no direct match, return featured contests in active region
    if (matched.length === 0) {
      return contests.filter((c) => {
        if (activeRegion === "international") return c.currency === "USD";
        return c.isFeatured;
      });
    }

    return matched;
  }
};

export default recommendationService;
