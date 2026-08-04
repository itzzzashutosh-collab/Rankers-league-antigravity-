import { Router, Request, Response } from "express";

const router = Router();

// GET /api/v1/contest-agent/status
router.get("/status", (_req: Request, res: Response) => {
  res.json({ success: true, status: "healthy", agent: "contest-agent" });
});

// GET /api/v1/contest-agent/overview
router.get("/overview", async (req: Request, res: Response) => {
  try {
    const supabase = req.db!;

    const { data: contests, error } = await supabase
      .from("contests")
      .select("id, title, exam_name, status, entry_fee, total_seats, participants_count, start_time")
      .order("start_time", { ascending: true })
      .limit(50);

    if (error) throw error;

    const active = (contests || []).filter((c: any) => c.status === "live");
    const upcoming = (contests || []).filter((c: any) => c.status === "scheduled");

    res.json({
      success: true,
      active,
      upcoming,
      totalCount: (contests || []).length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/contest-agent/populate-paper
router.post("/populate-paper", async (req: Request, res: Response) => {
  try {
    const supabase = req.db!;
    const { exam, questionCount = 30 } = req.body;

    const { data: questions, error } = await supabase
      .from("latest_concept_templates")
      .select("template_id, concept_name, difficulty_level, stem_template, option_a, option_b, option_c, option_d")
      .eq("exam_name", exam)
      .limit(questionCount);

    if (error) throw error;

    res.json({
      success: true,
      exam,
      questionCount: (questions || []).length,
      questions,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
