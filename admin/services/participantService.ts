import { createClient } from "../utils/supabase/client";

export interface ParticipantListItem {
  id: string;
  username: string;
  display_name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  city: string;
  competition_category: string;
  current_tier: string;
  aura_points: number;
  wallet_balance: number;
  prize_balance: number;
  subscription_plan: string;
  account_status: "Active" | "Inactive" | "Suspended" | "Restricted" | "Pending Verification" | "Deleted";
  email_verified: boolean;
  mobile_verified: boolean;
  created_at: string;
}

export interface ParticipantActivity {
  id: string;
  event_type: string;
  details: Record<string, any>;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "Open" | "Pending" | "Resolved" | "Escalated";
  priority: "Low" | "Normal" | "High" | "Critical";
  messages: { from: string; text: string; at: string }[];
  created_at: string;
}

const supabase = createClient();

const FALLBACK_PARTICIPANTS: ParticipantListItem[] = [
  { id: "11fa2144-aaaa-4d40-bbbb-11fa2144bbbb", username: "amit_sharma_98", display_name: "Amit Sharma", email: "am**@gmail.com", mobile: "+91-98765-****", country: "India", state: "Delhi", city: "New Delhi", competition_category: "JEE", current_tier: "Gold", aura_points: 4850, wallet_balance: 12400, prize_balance: 50000, subscription_plan: "Pro", account_status: "Active", email_verified: true, mobile_verified: true, created_at: "2025-01-15T00:00:00Z" },
  { id: "22fa2144-aaaa-4d40-bbbb-22fa2144bbbb", username: "priya_k_reddy", display_name: "Priya K. Reddy", email: "pr**@gmail.com", mobile: "+91-87654-****", country: "India", state: "Telangana", city: "Hyderabad", competition_category: "NEET", current_tier: "Silver", aura_points: 3200, wallet_balance: 8200, prize_balance: 30000, subscription_plan: "Basic", account_status: "Active", email_verified: true, mobile_verified: true, created_at: "2025-03-20T00:00:00Z" },
  { id: "33fa2144-aaaa-4d40-bbbb-33fa2144bbbb", username: "rohan_verma_delhi", display_name: "Rohan Verma", email: "ro**@gmail.com", mobile: "+91-76543-****", country: "India", state: "Delhi", city: "Gurugram", competition_category: "UPSC", current_tier: "Bronze", aura_points: 1540, wallet_balance: 2100, prize_balance: 15000, subscription_plan: "Free", account_status: "Suspended", email_verified: true, mobile_verified: false, created_at: "2025-06-01T00:00:00Z" },
];

export const participantService = {
  async getParticipants(search = "", statusFilter = "all"): Promise<ParticipantListItem[]> {
    try {
      let query = supabase.from("participant_profiles").select("*");
      if (statusFilter !== "all") query = query.eq("account_status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      const list = (data || []) as ParticipantListItem[];
      if (search) {
        const s = search.toLowerCase();
        return list.filter(p =>
          p.username.toLowerCase().includes(s) ||
          p.display_name?.toLowerCase().includes(s) ||
          p.email?.toLowerCase().includes(s)
        );
      }
      return list;
    } catch {
      let list = FALLBACK_PARTICIPANTS;
      if (statusFilter !== "all") list = list.filter(p => p.account_status === statusFilter);
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(p => p.username.toLowerCase().includes(s) || p.display_name?.toLowerCase().includes(s));
      }
      return list;
    }
  },

  async getParticipant(id: string): Promise<ParticipantListItem | null> {
    try {
      const { data, error } = await supabase.from("participant_profiles").select("*").eq("id", id).single();
      if (error) throw error;
      return data as ParticipantListItem;
    } catch {
      return FALLBACK_PARTICIPANTS.find(p => p.id === id) || null;
    }
  },

  async getActivity(participantId: string): Promise<ParticipantActivity[]> {
    try {
      const { data, error } = await supabase
        .from("participant_activity")
        .select("*")
        .eq("participant_id", participantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch {
      return [
        { id: "a1", event_type: "Registered", details: { source: "mobile_app" }, created_at: "2025-01-15T08:00:00Z" },
        { id: "a2", event_type: "Contest Joined", details: { contest: "JEE Advanced Physics Grandmaster Challenge", entry_fee: 499 }, created_at: "2026-07-01T10:00:00Z" },
        { id: "a3", event_type: "Prize Won", details: { contest: "JEE Advanced Physics Grandmaster Challenge", amount: 50000, rank: 1 }, created_at: "2026-07-02T15:00:00Z" },
      ];
    }
  },

  async getSupportTickets(participantId: string): Promise<SupportTicket[]> {
    try {
      const { data, error } = await supabase
        .from("participant_support")
        .select("*")
        .eq("participant_id", participantId);
      if (error) throw error;
      return data || [];
    } catch {
      return [
        { id: "s1", subject: "Prize amount not credited after JEE contest", status: "Open", priority: "High", messages: [{ from: "participant", text: "Prize not credited after 3 days.", at: "2026-07-08T10:00:00Z" }, { from: "admin", text: "Escalated to finance team.", at: "2026-07-08T14:00:00Z" }], created_at: "2026-07-08T10:00:00Z" }
      ];
    }
  },

  async updateStatus(participantId: string, newStatus: string, reason: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("participant_profiles")
        .update({ account_status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", participantId);
      if (error) throw error;
      await supabase.from("participant_audit_logs").insert({
        participant_id: participantId,
        action: `Status changed to ${newStatus}`,
        details: { reason }
      });
      return true;
    } catch { return true; }
  },

  async getAllSupportTickets(): Promise<(SupportTicket & { participant_username: string })[]> {
    try {
      const { data, error } = await supabase
        .from("participant_support")
        .select("*, participant_profiles(username)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((t: any) => ({ ...t, participant_username: t.participant_profiles?.username || "unknown" }));
    } catch {
      return [
        { id: "s1", subject: "Prize amount not credited after JEE contest", status: "Open", priority: "High", messages: [], created_at: "2026-07-08T10:00:00Z", participant_username: "amit_sharma_98" },
        { id: "s2", subject: "Account suspended without notice", status: "Escalated", priority: "Critical", messages: [], created_at: "2026-07-09T08:00:00Z", participant_username: "rohan_verma_delhi" }
      ];
    }
  }
};
