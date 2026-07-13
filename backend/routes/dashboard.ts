import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/v1/dashboard/stats — aggregate dashboard stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const db = req.db!;

    const [profileRes, statsRes, walletRes, streakRes, summaryRes, enrollmentsRes] = await Promise.all([
      db.from("profiles").select("full_name, username, aura_points, national_rank, avatar_url, primary_exam_category").eq("id", userId).single(),
      db.from("user_statistics").select("*").eq("user_id", userId).maybeSingle(),
      db.from("wallet_balances").select("available_balance, contest_entry_balance, pending_rewards, lifetime_earnings").eq("wallet_id", userId).maybeSingle(),
      db.from("streaks").select("current_streak, longest_streak").eq("user_id", userId).maybeSingle(),
      db.from("dashboard_summary").select("*").eq("user_id", userId).maybeSingle(),
      db.from("contest_enrollments").select("*").eq("user_id", userId).order("contest_date", { ascending: false }).limit(10),
    ]);

    res.json({
      profile: profileRes.data || null,
      stats: statsRes.data || null,
      wallet: walletRes.data || null,
      streak: streakRes.data || null,
      summary: summaryRes.data || null,
      enrollments: enrollmentsRes.data || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch dashboard stats." });
  }
});

// GET /api/v1/dashboard/activity — recent activity timeline
router.get("/activity", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const { data, error } = await req.db!
      .from("user_activity")
      .select("*")
      .eq("user_id", req.userId!)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activity timeline." });
  }
});

// GET /api/v1/dashboard/aura-history
router.get("/aura-history", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const { data, error } = await req.db!
      .from("aura_history")
      .select("*")
      .eq("user_id", req.userId!)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch aura history." });
  }
});

// GET /api/v1/dashboard/achievements
router.get("/achievements", async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.db!
      .from("user_achievements")
      .select("*")
      .eq("user_id", req.userId!)
      .order("earned_at", { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch achievements." });
  }
});

// GET /api/v1/dashboard/performance
router.get("/performance", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const db = req.db!;

    const [subjectRes, difficultyRes, consistencyRes, reportsRes] = await Promise.all([
      db.from("subject_statistics").select("*").eq("user_id", userId),
      db.from("difficulty_statistics").select("*").eq("user_id", userId),
      db.from("consistency_statistics").select("*").eq("user_id", userId).order("date", { ascending: false }).limit(120),
      db.from("performance_reports").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    res.json({
      subjects: subjectRes.data || [],
      difficulty: difficultyRes.data || [],
      consistency: consistencyRes.data || [],
      report: reportsRes.data || null,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch performance data." });
  }
});

export default router;
