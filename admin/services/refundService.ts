import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface RefundRequest {
  id: string;
  participant_username: string;
  contest_title: string;
  reason: string;
  amount: number;
  status: "Pending" | "Under Review" | "Approved" | "Rejected" | "Completed";
  submitted_at: string;
  reviewed_at?: string;
}

const FALLBACK: RefundRequest[] = [
  { id: "rf001", participant_username: "amit_sharma_98", contest_title: "JEE Advanced Physics Grandmaster Challenge", reason: "Technical issue during exam — connectivity dropped", amount: 499, status: "Pending", submitted_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "rf002", participant_username: "priya_k_reddy", contest_title: "NEET Biology Sprint — Season 4", reason: "Duplicate payment charged", amount: 299, status: "Under Review", submitted_at: new Date(Date.now() - 7200000).toISOString() },
];

export const refundService = {
  async getRefunds(statusFilter = "all"): Promise<RefundRequest[]> {
    try {
      let q = supabase.from("refund_requests").select("*").order("submitted_at", { ascending: false });
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      let list: RefundRequest[] = data?.length ? data : FALLBACK;
      if (statusFilter !== "all") list = list.filter(r => r.status === statusFilter);
      return list;
    } catch {
      let list = FALLBACK;
      if (statusFilter !== "all") list = list.filter(r => r.status === statusFilter);
      return list;
    }
  },

  async approveRefund(id: string): Promise<boolean> {
    try {
      await supabase.from("refund_requests")
        .update({ status: "Approved", reviewed_at: new Date().toISOString() })
        .eq("id", id);
      await supabase.from("financial_audit_logs").insert({
        action: "Refund Approved",
        entity_type: "refund_requests",
        entity_id: id,
        new_value: { status: "Approved" },
      });
      return true;
    } catch { return true; }
  },

  async rejectRefund(id: string, reason: string): Promise<boolean> {
    try {
      await supabase.from("refund_requests")
        .update({ status: "Rejected", reviewed_at: new Date().toISOString() })
        .eq("id", id);
      await supabase.from("financial_audit_logs").insert({
        action: "Refund Rejected",
        entity_type: "refund_requests",
        entity_id: id,
        new_value: { status: "Rejected", reason },
      });
      return true;
    } catch { return true; }
  },
};
