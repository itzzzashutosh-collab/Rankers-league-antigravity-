import { Contest, ContestDetail, ContestDifficulty, ContestStatus } from "../types/contests";
import { contestsContent } from "../content/contests";

// This interface allows seamless transition between local content and real Supabase client queries.
export interface ContestRepository {
  findAll(): Promise<Contest[]>;
  findBySlug(slug: string): Promise<ContestDetail | null>;
  findFeatured(): Promise<Contest[]>;
  search(query: string): Promise<Contest[]>;
}

// Database schema representation for database mapper
export interface DBChampionshipRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  scheduled_start: string; // ISO string
  scheduled_end: string; // ISO string
  entry_fee_credits: number;
  max_participants: number;
  current_participants: number;
  status: "upcoming" | "active" | "completed";
  rewards_pool_credits: number;
  difficulty_tier: "elite" | "prime" | "apex";
}

// Adapter to map database models to frontend UI types
export class ContestAdapter {
  static toFrontendContest(db: DBChampionshipRecord): Contest {
    const seatsAvailable = db.max_participants - db.current_participants;
    
    // Map difficulty tier enum to UI string
    let difficulty: ContestDifficulty = "Prime";
    if (db.difficulty_tier === "elite") difficulty = "Elite";
    else if (db.difficulty_tier === "apex") difficulty = "Apex";

    // Format display dates/times
    const startDate = new Date(db.scheduled_start);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${months[startDate.getMonth()]} ${startDate.getDate()}, ${startDate.getFullYear()}`;
    
    let hours = startDate.getHours();
    const minutes = String(startDate.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedTime = `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;

    // Calculate duration in text
    const endDate = new Date(db.scheduled_end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs / (1000 * 60)) % 60);
    const durationStr = `${diffHrs}h ${String(diffMins).padStart(2, "0")}m`;

    // Registration deadline is typically 1 hour before scheduled start
    const deadlineDate = new Date(startDate.getTime() - 60 * 60 * 1000);
    const formattedDeadline = `${months[deadlineDate.getMonth()]} ${deadlineDate.getDate()}, ${deadlineDate.getFullYear()} ${String(deadlineDate.getHours() % 12 || 12).padStart(2, "0")}:${String(deadlineDate.getMinutes()).padStart(2, "0")} ${deadlineDate.getHours() >= 12 ? "PM" : "AM"}`;

    return {
      id: db.id,
      slug: db.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      title: db.title,
      exam: db.category === "Civil Services" ? "UPSC CSE Prelims" : db.category === "Engineering" ? "JEE Advanced" : "NEET UG",
      category: db.category,
      entryFee: db.entry_fee_credits,
      prizePool: db.rewards_pool_credits,
      participants: db.current_participants,
      maxParticipants: db.max_participants,
      difficulty,
      date: formattedDate,
      time: formattedTime,
      duration: durationStr,
      seatsAvailable,
      status: db.status,
      bannerGradient: db.category === "Civil Services" 
        ? "from-amber-500/20 via-yellow-500/10 to-transparent" 
        : db.category === "Engineering" 
        ? "from-violet-500/20 via-purple-500/10 to-transparent" 
        : "from-rose-500/20 via-pink-500/10 to-transparent",
      language: "English",
      country: "India",
      isFeatured: db.rewards_pool_credits >= 500000,
      isTrending: db.current_participants >= db.max_participants * 0.7,
      registrationDeadline: formattedDeadline,
    };
  }
}

// Local mock repository implementation loaded with rich client content files.
export class MockContestRepository implements ContestRepository {
  async findAll(): Promise<Contest[]> {
    return contestsContent;
  }

  async findBySlug(slug: string): Promise<ContestDetail | null> {
    const contest = contestsContent.find((c) => c.slug === slug);
    if (!contest) return null;
    
    // In our static content layer, contestsContent is typed as ContestDetail[] which matches this
    return contest as ContestDetail;
  }

  async findFeatured(): Promise<Contest[]> {
    return contestsContent.filter((c) => c.isFeatured);
  }

  async search(query: string): Promise<Contest[]> {
    const q = query.toLowerCase();
    return contestsContent.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.exam.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }
}

// Global Repository Instance
export const contestRepository: ContestRepository = new MockContestRepository();
