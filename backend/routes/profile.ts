import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/v1/profile/me — own full profile with stats
router.get("/me", async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const db = req.db!;

    const [profileRes, statsRes, walletRes, achievementsRes] = await Promise.all([
      db.from("profiles").select("*").eq("id", userId).single(),
      db.from("user_statistics").select("*").eq("user_id", userId).maybeSingle(),
      db.from("wallet_balances").select("available_balance, lifetime_earnings").eq("wallet_id", userId).maybeSingle(),
      db.from("user_achievements").select("title, icon, rarity").eq("user_id", userId).order("earned_at", { ascending: false }).limit(5),
    ]);

    if (profileRes.error || !profileRes.data) {
      return res.status(404).json({ error: "Profile not found." });
    }

    res.json({
      ...profileRes.data,
      stats: statsRes.data || null,
      wallet: walletRes.data || null,
      recentAchievements: achievementsRes.data || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile." });
  }
});

// GET /api/v1/profile/:username — public profile
router.get("/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const db = req.db!;

    const { data: profile, error } = await db
      .from("profiles")
      .select("id, full_name, username, aura_points, national_rank, primary_exam_category, avatar_url, profile_status, created_at")
      .eq("username", username)
      .maybeSingle();

    if (error || !profile) {
      return res.status(404).json({ error: "User not found." });
    }

    const [statsRes, achievementsRes, certsRes] = await Promise.all([
      db.from("user_statistics").select("total_contests_joined, total_contests_completed, best_rank, accuracy_percentage").eq("user_id", profile.id).maybeSingle(),
      db.from("user_achievements").select("title, icon, rarity, earned_at").eq("user_id", profile.id).order("earned_at", { ascending: false }).limit(6),
      db.from("user_certificates").select("id, contest_name, certificate_type, certificate_number, created_at").eq("user_id", profile.id).order("created_at", { ascending: false }).limit(6),
    ]);

    res.json({
      ...profile,
      stats: statsRes.data || null,
      achievements: achievementsRes.data || [],
      certificates: certsRes.data || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch public profile." });
  }
});

export default router;
