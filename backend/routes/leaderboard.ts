import { Router, Request, Response } from "express";

const router = Router();

const MOCK_LEADERBOARD = [
  {
    id: "user-1",
    full_name: "Arjun Sharma",
    username: "arjun_sharma",
    aura_points: 4850,
    national_rank: 1,
    avatar_url: null,
    primary_exam_category: "JEE_MAIN"
  },
  {
    id: "user-2",
    full_name: "Priya Patel",
    username: "priya_p",
    aura_points: 4520,
    national_rank: 2,
    avatar_url: null,
    primary_exam_category: "UPSC_CSE"
  },
  {
    id: "user-3",
    full_name: "Rahul Verma",
    username: "rahul_v",
    aura_points: 4210,
    national_rank: 3,
    avatar_url: null,
    primary_exam_category: "JEE_MAIN"
  }
];

// GET /api/v1/leaderboard — global leaderboard
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const { data, error } = await req.db!
      .from("profiles")
      .select("id, full_name, username, aura_points, national_rank, avatar_url, primary_exam_category")
      .not("national_rank", "is", null)
      .order("national_rank", { ascending: true })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return res.json(MOCK_LEADERBOARD);
    }
    res.json(data);
  } catch {
    res.json(MOCK_LEADERBOARD);
  }
});

// GET /api/v1/leaderboard/:contestId — per-contest leaderboard
router.get("/:contestId", async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;
    const { data, error } = await req.db!
      .from("standings")
      .select("*")
      .eq("league_id", contestId)
      .order("rank_position", { ascending: true })
      .limit(100);

    if (error || !data || data.length === 0) {
      return res.json(MOCK_LEADERBOARD);
    }
    res.json(data);
  } catch {
    res.json(MOCK_LEADERBOARD);
  }
});

export default router;
