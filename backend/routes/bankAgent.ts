import { Router, Request, Response } from "express";

const router = Router();

// GET /api/v1/bank-agent/status
router.get("/status", (_req: Request, res: Response) => {
  res.json({ success: true, status: "healthy", agent: "bank-agent" });
});

// GET /api/v1/bank-agent/stats
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const supabase = req.db!;
    const { count: total } = await supabase
      .from("latest_concept_templates")
      .select("*", { count: "exact", head: true });

    const { data: statusRows } = await supabase
      .from("latest_concept_templates")
      .select("status");

    const byStatus: Record<string, number> = {};
    (statusRows || []).forEach((r: any) => {
      byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    });

    const reviewed = byStatus["reviewed"] || 0;
    const totalCount = total || 0;
    const reviewedPct = totalCount > 0 ? Math.round((reviewed / totalCount) * 100) : 0;

    res.json({
      success: true,
      stats: {
        total: totalCount,
        byStatus,
        reviewedPct,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/bank-agent/bulk-approve
router.post("/bulk-approve", async (req: Request, res: Response) => {
  try {
    const supabase = req.db!;
    const { exam, limit = 500 } = req.body;

    let query = supabase
      .from("latest_concept_templates")
      .update({ status: "reviewed", updated_at: new Date().toISOString() })
      .eq("status", "auto_fixed");

    if (exam) {
      query = query.eq("exam_name", exam);
    }

    const { data, error } = await query.limit(limit).select("template_id");

    if (error) throw error;

    res.json({
      success: true,
      approvedCount: (data || []).length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
