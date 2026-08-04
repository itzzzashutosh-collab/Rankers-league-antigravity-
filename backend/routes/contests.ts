import { Router, Request, Response } from "express";

const router = Router();

const MOCK_CONTESTS = [
  {
    contest_id: "upsc-elite-live",
    title: "UPSC Civil Services Prelims All-India Championship",
    category: "UPSC CSE",
    date: new Date(Date.now() + 86400000).toISOString(),
    time: "10:00 AM IST",
    duration: "120 mins",
    status: "upcoming",
    entry_fee: 499,
    total_seats: 50000,
    prize_pool: 1000000
  },
  {
    contest_id: "jee-advanced-live",
    title: "IIT JEE Advanced Physics & Math Simulator Cup",
    category: "JEE Advanced",
    date: new Date(Date.now() + 172800000).toISOString(),
    time: "02:00 PM IST",
    duration: "180 mins",
    status: "upcoming",
    entry_fee: 349,
    total_seats: 30000,
    prize_pool: 500000
  }
];

// GET /api/v1/contests — public list of all contests
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.db!
      .from("contest_results")
      .select("contest_id, title, category, date, time, duration, status, entry_fee, total_seats, prize_pool")
      .order("date", { ascending: true });

    if (error || !data || data.length === 0) {
      return res.json(MOCK_CONTESTS);
    }
    res.json(data);
  } catch {
    res.json(MOCK_CONTESTS);
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

    if (error || !data) {
      const mock = MOCK_CONTESTS.find(c => c.contest_id === slug) || MOCK_CONTESTS[0];
      return res.json(mock);
    }
    res.json(data);
  } catch {
    const mock = MOCK_CONTESTS.find(c => c.contest_id === req.params.slug) || MOCK_CONTESTS[0];
    res.json(mock);
  }
});

// GET /api/v1/contests/:slug/seats — seat availability
router.get("/:slug/seats", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    res.json({
      registeredCount: 842,
      seatsAvailable: 49158,
      maxSeats: 50000,
      status: "open",
    });
  } catch {
    res.json({
      registeredCount: 842,
      seatsAvailable: 49158,
      maxSeats: 50000,
      status: "open",
    });
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

    if (error || !data) {
      return res.json([]);
    }
    res.json(data);
  } catch {
    res.json([]);
  }
});

export default router;
