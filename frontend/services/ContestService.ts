import { Contest, ContestDetail, ContestCategory, ContestTag } from "../types/contests";
import { contestRepository } from "../repositories/ContestRepository";
import { categoriesContent } from "../content/contest-categories";
import { tagsContent } from "../content/contest-tags";

export class ContestService {
  static async getAllContests(): Promise<Contest[]> {
    return contestRepository.findAll();
  }

  static async getContestBySlug(slug: string): Promise<ContestDetail | null> {
    return contestRepository.findBySlug(slug);
  }

  static async getFeaturedContests(): Promise<Contest[]> {
    return contestRepository.findFeatured();
  }

  static async getCategories(): Promise<ContestCategory[]> {
    return categoriesContent;
  }

  static async getTags(): Promise<ContestTag[]> {
    return tagsContent;
  }

  // Orchestrated filter, search, and sort logic inside the service
  static async queryContests(filters: {
    category?: string;
    searchTerm?: string;
    difficulty?: string;
    entryFeeType?: "free" | "paid" | "all";
    status?: string;
    sortBy?: string;
  }): Promise<Contest[]> {
    let list = await contestRepository.findAll();

    // 1. Search filter
    if (filters.searchTerm) {
      const query = filters.searchTerm.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          c.exam.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      );
    }

    // 2. Category filter
    if (filters.category && filters.category !== "All") {
      list = list.filter((c) => c.category.toLowerCase() === filters.category!.toLowerCase());
    }

    // 3. Difficulty filter
    if (filters.difficulty && filters.difficulty !== "All") {
      list = list.filter((c) => c.difficulty.toLowerCase() === filters.difficulty!.toLowerCase());
    }

    // 4. Entry Fee filter
    if (filters.entryFeeType && filters.entryFeeType !== "all") {
      if (filters.entryFeeType === "free") {
        list = list.filter((c) => c.entryFee === 0);
      } else {
        list = list.filter((c) => c.entryFee > 0);
      }
    }

    // 5. Status filter
    if (filters.status && filters.status !== "All") {
      list = list.filter((c) => c.status.toLowerCase() === filters.status!.toLowerCase());
    }

    // 6. Sorting
    if (filters.sortBy) {
      list = [...list].sort((a, b) => {
        switch (filters.sortBy) {
          case "newest":
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case "prize-desc":
            return b.prizePool - a.prizePool;
          case "fee-asc":
            return a.entryFee - b.entryFee;
          case "fee-desc":
            return b.entryFee - a.entryFee;
          case "closing-soon":
            return new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime();
          case "participants-desc":
            return b.participants - a.participants;
          default:
            return 0;
        }
      });
    }

    return list;
  }
}
