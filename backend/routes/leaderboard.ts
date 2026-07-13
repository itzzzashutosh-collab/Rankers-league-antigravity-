import { Router, Request, Response } from "express";

const router = Router();

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

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch global leaderboard." });
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

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contest leaderboard." });
  }
});

export default router;
