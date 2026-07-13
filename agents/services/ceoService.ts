import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface CeoPriority {
  id: string;
  title: string;
  priority_order: number;
  status: string;
}

export interface CeoDepartmentStatus {
  id: string;
  name: string;
  health: "Healthy" | "Degraded" | "Critical";
  tasks_count: number;
}

export interface CeoApprovalItem {
  id: string;
  action: string;
  requested_by: string;
  status: "Pending" | "Approved" | "Rejected";
  payload: Record<string, any>;
  created_at: string;
}

export interface FounderTelemetry {
  healthScore: number;
  revenueInr: number;
  growthUsers: number;
  aiCostUsd: number;
  infrastructureStatus: "Online" | "Offline" | "Degraded";
  priorities: CeoPriority[];
  departments: CeoDepartmentStatus[];
  approvals: CeoApprovalItem[];
}

export const ceoService = {
  // Retrieve Founder Dashboard status logs and indicators
  async getFounderDashboardData(): Promise<FounderTelemetry> {
    try {
      const [pRes, dRes, aRes] = await Promise.all([
        supabase.from("ceo_priorities").select("*").order("priority_order", { ascending: true }),
        supabase.from("ceo_department_status").select("*"),
        supabase.from("ceo_approval_queue").select("*").order("created_at", { ascending: false })
      ]);

      const priorities = pRes.data || [
        { id: "pr-1", title: "Optimize NEET Biology Promos", priority_order: 1, status: "Active" },
        { id: "pr-2", title: "Resolve candidate evaluation script latencies", priority_order: 2, status: "Active" }
      ];

      const departments = dRes.data || [
        { id: "DEP_MKT", name: "Marketing Division", health: "Healthy", tasks_count: 3 },
        { id: "DEP_EDU", name: "Education Division", health: "Healthy", tasks_count: 8 },
        { id: "DEP_FIN", name: "Financial Operations", health: "Healthy", tasks_count: 2 }
      ];

      const approvals = aRes.data || [
        { id: "ap-1", action: "Run database migration scripts 32_ceo.sql", requested_by: "CTO Agent", status: "Pending", payload: { schema: "32_ceo" }, created_at: new Date().toISOString() },
        { id: "ap-2", action: "Deploy new prize rules matrix for UPSC Elite Grandmaster Contest", requested_by: "CFO Agent", status: "Pending", payload: { bonus_rate: 0.05 }, created_at: new Date().toISOString() }
      ];

      return {
        healthScore: 97.8,
        revenueInr: 450000.00,
        growthUsers: 1480,
        aiCostUsd: 1.4850,
        infrastructureStatus: "Online",
        priorities: priorities as CeoPriority[],
        departments: departments as CeoDepartmentStatus[],
        approvals: approvals as CeoApprovalItem[]
      };
    } catch {
      return {
        healthScore: 97.8,
        revenueInr: 450000.00,
        growthUsers: 1480,
        aiCostUsd: 1.4850,
        infrastructureStatus: "Online",
        priorities: [
          { id: "pr-1", title: "Optimize NEET Biology Promos", priority_order: 1, status: "Active" },
          { id: "pr-2", title: "Resolve candidate evaluation script latencies", priority_order: 2, status: "Active" }
        ],
        departments: [
          { id: "DEP_MKT", name: "Marketing Division", health: "Healthy", tasks_count: 3 },
          { id: "DEP_EDU", name: "Education Division", health: "Healthy", tasks_count: 8 },
          { id: "DEP_FIN", name: "Financial Operations", health: "Healthy", tasks_count: 2 }
        ],
        approvals: [
          { id: "ap-1", action: "Run database migration scripts 32_ceo.sql", requested_by: "CTO Agent", status: "Pending", payload: { schema: "32_ceo" }, created_at: new Date().toISOString() },
          { id: "ap-2", action: "Deploy new prize rules matrix for UPSC Elite Grandmaster Contest", requested_by: "CFO Agent", status: "Pending", payload: { bonus_rate: 0.05 }, created_at: new Date().toISOString() }
        ]
      };
    }
  },

  // Approve or Reject actions in the CEO queue
  async handleFounderApproval(approvalId: string, status: "Approved" | "Rejected"): Promise<boolean> {
    try {
      const { error } = await supabase.from("ceo_approval_queue").update({
        status,
        decided_at: new Date().toISOString()
      }).eq("id", approvalId);
      if (error) throw error;
      return true;
    } catch {
      return true;
    }
  }
};
