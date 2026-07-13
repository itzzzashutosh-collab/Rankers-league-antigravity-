import { createClient } from "../utils/supabase/client";

export interface PlatformStat {
  key: string;
  value: number;
  label: string;
  category: string;
}

export interface PlatformTimelineEvent {
  id: number;
  time_label: string;
  action: string;
  entity: string;
  actor: string;
  type: "success" | "warning" | "info";
}

export interface SystemAlert {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "danger";
  is_active: boolean;
}

export interface WidgetLayout {
  widget_id: string;
  col_span: number;
  row_order: number;
  is_visible: boolean;
  is_pinned: boolean;
}

const supabase = createClient();

export const operationsService = {
  // 1. Fetch live snapshot statistics
  async getPlatformStats(): Promise<PlatformStat[]> {
    try {
      const { data, error } = await supabase
        .from("platform_statistics")
        .select("*");
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("Failed to fetch stats from Supabase, using local defaults:", err);
      return [
        { key: "active_users", value: 42800, label: "Total Active Candidates", category: "engagement" },
        { key: "users_online", value: 1580, label: "Users Online", category: "telemetry" },
        { key: "admins_online", value: 3, label: "Admins Online", category: "telemetry" },
        { key: "live_contests", value: 2, label: "Live Contests", category: "operations" },
        { key: "upcoming_contests", value: 6, label: "Upcoming Contests", category: "operations" },
        { key: "running_evaluations", value: 1, label: "Running Evaluations", category: "operations" },
        { key: "pending_payouts", value: 14, label: "Pending Withdrawals", category: "finance" },
        { key: "open_tickets", value: 9, label: "Open Support Requests", category: "support" }
      ];
    }
  },

  // 2. Fetch realtime timeline events
  async getTimelineEvents(): Promise<PlatformTimelineEvent[]> {
    try {
      const { data, error } = await supabase
        .from("platform_events")
        .select("*")
        .order("id", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      return [
        { id: 1, time_label: "Just now", action: "Contest Registration", entity: "UPSC Elite Arena (GS-01)", actor: "ashutosh_dropout", type: "success" },
        { id: 2, time_label: "3m ago", action: "Withdrawal Request", entity: "₹4,500 Bank Payout Request", actor: "subham_pandey", type: "info" },
        { id: 3, time_label: "12m ago", action: "Question Imported", entity: "NEET Biology Module 14", actor: "academic_advisor_s", type: "success" },
        { id: 4, time_label: "28m ago", action: "Platform Login", entity: "New IP Session Authorized", actor: "admin_moderator_02", type: "info" },
        { id: 5, time_label: "44m ago", action: "Database Auto-Backup", entity: "Daily Schema Checksum Validated", actor: "System cron", type: "success" },
        { id: 6, time_label: "1h ago", action: "Failed Payout P2P", entity: "UPI Routing Timeout Error", actor: "ashutosh_dropout", type: "warning" }
      ];
    }
  },

  // 3. Fetch active system announcements
  async getSystemAlerts(): Promise<SystemAlert[]> {
    try {
      const { data, error } = await supabase
        .from("system_alerts")
        .select("*")
        .eq("is_active", true);
      if (error) throw error;
      return data || [];
    } catch (err) {
      return [
        { id: 1, title: "Scheduled Infrastructure Optimization", message: "All database clusters will undergo brief diagnostic scaling on July 12 between 03:00 - 03:30 AM IST.", type: "warning", is_active: true },
        { id: 2, title: "Supabase Auth Patch v4.2", message: "Security updates successfully deployed. Admin sessions validation will enforce strict JWT authorization.", type: "info", is_active: true }
      ];
    }
  },

  // 4. Load admin layouts config
  async getAdminLayout(adminId: string): Promise<WidgetLayout[]> {
    try {
      const { data, error } = await supabase
        .from("workspace_layouts")
        .select("widget_id, col_span, row_order, is_visible, is_pinned")
        .eq("admin_id", adminId);
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("No layout saved");
      return data;
    } catch (err) {
      // Default dashboard widget positions
      return [
        { widget_id: "status_ribbon", col_span: 12, row_order: 0, is_visible: true, is_pinned: true },
        { widget_id: "snapshot_ribbon", col_span: 12, row_order: 1, is_visible: true, is_pinned: true },
        { widget_id: "contest_monitor", col_span: 8, row_order: 2, is_visible: true, is_pinned: false },
        { widget_id: "action_center", col_span: 4, row_order: 3, is_visible: true, is_pinned: false },
        { widget_id: "registration_feed", col_span: 4, row_order: 4, is_visible: true, is_pinned: false },
        { widget_id: "platform_timeline", col_span: 4, row_order: 5, is_visible: true, is_pinned: false },
        { widget_id: "admin_activity", col_span: 4, row_order: 6, is_visible: true, is_pinned: false }
      ];
    }
  },

  // 5. Save layouts to database
  async saveAdminLayout(adminId: string, layouts: WidgetLayout[]): Promise<boolean> {
    try {
      // Clear existing and rewrite
      await supabase.from("workspace_layouts").delete().eq("admin_id", adminId);

      const rows = layouts.map(l => ({
        admin_id: adminId,
        widget_id: l.widget_id,
        col_span: l.col_span,
        row_order: l.row_order,
        is_visible: l.is_visible,
        is_pinned: l.is_pinned
      }));

      const { error } = await supabase.from("workspace_layouts").insert(rows);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Failed to persist layout state in Supabase:", err);
      return false;
    }
  }
};
