import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// GET /api/v1/notifications — fetch inbox notifications
router.get("/", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 30;
    const { data, error } = await req.db!
      .from("user_notifications")
      .select("*")
      .eq("user_id", req.userId!)
      .eq("is_archived", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const unreadCount = (data || []).filter(n => !n.is_read).length;
    res.json({ notifications: data || [], unreadCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});

// POST /api/v1/notifications/read-all — mark all as read
router.post("/read-all", async (req: Request, res: Response) => {
  try {
    const { error } = await req.db!
      .from("user_notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("user_id", req.userId!)
      .eq("is_read", false);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
});

// POST /api/v1/notifications/:id/read — mark single as read
router.post("/:id/read", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await req.db!
      .from("user_notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", req.userId!);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read." });
  }
});

// DELETE /api/v1/notifications/:id — archive (soft delete)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await req.db!
      .from("user_notifications")
      .update({ is_archived: true })
      .eq("id", id)
      .eq("user_id", req.userId!);

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to archive notification." });
  }
});

// GET /api/v1/notifications/preferences
router.get("/preferences", async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.db!
      .from("notification_preferences")
      .select("*")
      .eq("user_id", req.userId!)
      .single();

    if (error || !data) {
      // Return defaults
      return res.json({
        contest_reminders: true,
        result_notifications: true,
        prize_notifications: true,
        achievement_notifications: true,
        marketing_emails: false,
        platform_updates: true,
        system_alerts: true,
        email_enabled: true,
        sms_enabled: false,
        whatsapp_enabled: false,
        push_enabled: false,
      });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch preferences." });
  }
});

// PATCH /api/v1/notifications/preferences
router.patch("/preferences", async (req: Request, res: Response) => {
  try {
    const allowed = [
      "contest_reminders", "result_notifications", "prize_notifications",
      "achievement_notifications", "marketing_emails", "platform_updates",
      "system_alerts", "email_enabled", "sms_enabled", "whatsapp_enabled", "push_enabled"
    ];
    const updates: Record<string, boolean> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = Boolean(req.body[key]);
    }

    const { error } = await req.db!
      .from("notification_preferences")
      .upsert({ user_id: req.userId!, ...updates, updated_at: new Date().toISOString() });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update preferences." });
  }
});

// GET /api/v1/notifications/announcements
router.get("/announcements", async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.db!
      .from("announcements")
      .select("*")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("publish_date", { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch announcements." });
  }
});

export default router;
