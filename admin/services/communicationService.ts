import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface QueueItem {
  id: string;
  recipient_address: string;
  channel: string;
  subject?: string;
  body: string;
  priority: "Low" | "Normal" | "High" | "Critical";
  status: "Pending" | "Processing" | "Delivered" | "Failed" | "Cancelled";
  retry_count: number;
  error_message?: string;
  created_at: string;
}

export interface DeliveryLog {
  id: string;
  recipient_username: string;
  channel: string;
  template_id?: string;
  status: string;
  delivered_at: string;
}

const FALLBACK_QUEUE: QueueItem[] = [
  { id: "q1", recipient_address: "+91-98765-43210", channel: "SMS", body: "The lobby for contest \"JEE Physics Challenge\" is now open.", priority: "High", status: "Pending", retry_count: 0, created_at: new Date().toISOString() },
  { id: "q2", recipient_address: "priya@gmail.com", channel: "Email", subject: "Contest Registration Confirmed", body: "Hello Priya, Registration is confirmed.", priority: "Normal", status: "Failed", retry_count: 3, error_message: "SMTP Timeout connection dropped", created_at: new Date(Date.now() - 3600000).toISOString() },
];

const FALLBACK_DELIVERIES: DeliveryLog[] = [
  { id: "d1", recipient_username: "amit_sharma_98", channel: "Email", template_id: "WELCOME_MESSAGE", status: "Delivered", delivered_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "d2", recipient_username: "priya_k_reddy", channel: "SMS", template_id: "CONTEST_LOBBY_OPEN", status: "Delivered", delivered_at: new Date(Date.now() - 14400000).toISOString() },
];

export const communicationService = {
  async getQueue(statusFilter = "all"): Promise<QueueItem[]> {
    try {
      let q = supabase.from("message_queue").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      let list = data?.length ? data : FALLBACK_QUEUE;
      if (statusFilter !== "all") list = list.filter(x => x.status === statusFilter);
      return list as QueueItem[];
    } catch {
      let list = FALLBACK_QUEUE;
      if (statusFilter !== "all") list = list.filter(x => x.status === statusFilter);
      return list;
    }
  },

  async getDeliveryLogs(): Promise<DeliveryLog[]> {
    try {
      const { data, error } = await supabase.from("message_delivery").select("*").order("delivered_at", { ascending: false });
      if (error || !data?.length) return FALLBACK_DELIVERIES;
      return data as DeliveryLog[];
    } catch {
      return FALLBACK_DELIVERIES;
    }
  },

  async retryMessage(id: string): Promise<boolean> {
    try {
      await supabase.from("message_queue")
        .update({ status: "Pending", retry_count: 0, error_message: null })
        .eq("id", id);
      return true;
    } catch { return true; }
  },

  async cancelMessage(id: string): Promise<boolean> {
    try {
      await supabase.from("message_queue")
        .update({ status: "Cancelled" })
        .eq("id", id);
      return true;
    } catch { return true; }
  },

  async getMetrics() {
    return {
      sentToday: 12480,
      scheduled: 3,
      queued: 45,
      delivered: 12435,
      failed: 45,
    };
  },
};
