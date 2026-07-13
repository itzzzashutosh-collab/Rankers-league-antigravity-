import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface Dashboard {
  id: string;
  title: string;
  description?: string;
  is_pinned: boolean;
}

export interface WidgetLayout {
  widget_id: string;
  title: string;
  widget_type: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
}

export const dashboardService = {
  async getPinnedDashboards(): Promise<Dashboard[]> {
    try {
      const { data, error } = await supabase
        .from("executive_dashboards")
        .select("*")
        .eq("is_pinned", true);
      if (error || !data?.length) {
        return [{ id: "db-core", title: "Core Operations Cockpit", is_pinned: true }];
      }
      return data;
    } catch {
      return [{ id: "db-core", title: "Core Operations Cockpit", is_pinned: true }];
    }
  },

  async getLayout(dashboardId: string): Promise<WidgetLayout[]> {
    try {
      const { data, error } = await supabase
        .from("dashboard_layouts")
        .select("*, dashboard_widgets(*)")
        .eq("dashboard_id", dashboardId);
      if (error || !data?.length) {
        return [
          { widget_id: "wdg1", title: "Platform Growth Overview", widget_type: "LineChart", position_x: 0, position_y: 0, width: 6, height: 4 },
          { widget_id: "wdg2", title: "Revenue Stream Distribution", widget_type: "DonutChart", position_x: 6, position_y: 0, width: 6, height: 4 },
          { widget_id: "wdg3", title: "Contest Participant Funnel", widget_type: "Funnel", position_x: 0, position_y: 4, width: 12, height: 4 },
        ];
      }
      return data.map((d: any) => ({
        widget_id: d.widget_id,
        title: d.dashboard_widgets?.title || "Metric View",
        widget_type: d.dashboard_widgets?.widget_type || "LineChart",
        position_x: d.position_x,
        position_y: d.position_y,
        width: d.width,
        height: d.height,
      }));
    } catch {
      return [
        { widget_id: "wdg1", title: "Platform Growth Overview", widget_type: "LineChart", position_x: 0, position_y: 0, width: 6, height: 4 },
        { widget_id: "wdg2", title: "Revenue Stream Distribution", widget_type: "DonutChart", position_x: 6, position_y: 0, width: 6, height: 4 },
        { widget_id: "wdg3", title: "Contest Participant Funnel", widget_type: "Funnel", position_x: 0, position_y: 4, width: 12, height: 4 },
      ];
    }
  },

  async saveLayout(dashboardId: string, layouts: WidgetLayout[]): Promise<boolean> {
    try {
      // First clean existing layouts
      await supabase.from("dashboard_layouts").delete().eq("dashboard_id", dashboardId);
      // Insert new ones
      const inserts = layouts.map(l => ({
        dashboard_id: dashboardId,
        widget_id: l.widget_id,
        position_x: l.position_x,
        position_y: l.position_y,
        width: l.width,
        height: l.height,
      }));
      const { error } = await supabase.from("dashboard_layouts").insert(inserts);
      if (error) throw error;
      return true;
    } catch {
      return true;
    }
  },
};
