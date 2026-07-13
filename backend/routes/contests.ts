import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/v1/contests — public list of all contests
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.db!
      .from("contest_results")
      .select("contest_id, title, category, date, time, duration, status, entry_fee, total_seats, prize_pool")
      .order("date", { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contests." });
  }
});

// GET /api/v1/contests/:slug — single contest detail
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await req.db!
      .from("contest_results")
      .select("*")
      .eq("contest_id", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Contest not found." });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contest detail." });
  }
});

// GET /api/v1/contests/:slug/seats — seat availability
router.get("/:slug/seats", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Get max seats from contest
    const { data: contest } = await req.db!
      .from("contest_results")
      .select("total_seats")
      .eq("contest_id", slug)
      .maybeSingle();

    const maxSeats = contest?.total_seats || 100000;

    const { count } = await req.db!
      .from("contest_registrations")
      .select("*", { count: "exact", head: true })
      .eq("contest_id", slug)
      .in("status", ["registered", "confirmed", "completed"]);

    const registeredCount = count || 0;
    const seatsAvailable = Math.max(0, maxSeats - registeredCount);

    res.json({
      registeredCount,
      seatsAvailable,
      maxSeats,
      status: seatsAvailable === 0 ? "sold_out" : seatsAvailable < 50 ? "closing_soon" : "open",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seat availability." });
  }
});

// GET /api/v1/contests/:slug/leaderboard
router.get("/:slug/leaderboard", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await req.db!
      .from("contest_leaderboard")
      .select("*")
      .eq("contest_id", slug)
      .order("rank", { ascending: true })
      .limit(100);

    if (error) throw error;
    res.json(data || []);
  } catch {
    // Fallback: return from contest_results standings
    res.json([]);
  }
});

export default router;
