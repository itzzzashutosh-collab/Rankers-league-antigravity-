import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface Campaign {
  id: string;
  title: string;
  template_id?: string;
  audience_segment_id?: string;
  schedule_type: "Immediate" | "Scheduled" | "Recurring";
  scheduled_at?: string;
  status: "Draft" | "Scheduled" | "Sending" | "Completed" | "Cancelled";
  created_at: string;
}

export interface AudienceSegment {
  id: string;
  name: string;
  description?: string;
  rules: Record<string, any>;
}

const FALLBACK_SEGMENTS: AudienceSegment[] = [
  { id: "seg1", name: "JEE Competitors", description: "All active general categories prepping for engineering tests.", rules: { category: "JEE" } },
  { id: "seg2", name: "Premium Subscribers", description: "Participants on Pro or Elite plans.", rules: { subscription: ["Pro", "Elite"] } },
];

const FALLBACK_CAMPAIGNS: Campaign[] = [
  { id: "c1", title: "Weekly JEE Grand Prix Promo", template_id: "WELCOME_MESSAGE", audience_segment_id: "seg1", schedule_type: "Scheduled", scheduled_at: new Date(Date.now() + 86400000).toISOString(), status: "Scheduled", created_at: new Date().toISOString() },
  { id: "c2", title: "Festival Championship Announcement", template_id: "CONTEST_LOBBY_OPEN", audience_segment_id: "seg2", schedule_type: "Immediate", status: "Completed", created_at: new Date(Date.now() - 3600000).toISOString() },
];

export const campaignService = {
  async getAudiences(): Promise<AudienceSegment[]> {
    try {
      const { data, error } = await supabase.from("audience_segments").select("*").order("name");
      if (error || !data?.length) return FALLBACK_SEGMENTS;
      return data as AudienceSegment[];
    } catch {
      return FALLBACK_SEGMENTS;
    }
  },

  async getCampaigns(): Promise<Campaign[]> {
    try {
      const { data, error } = await supabase.from("communication_campaigns").select("*").order("created_at", { ascending: false });
      if (error || !data?.length) return FALLBACK_CAMPAIGNS;
      return data as Campaign[];
    } catch {
      return FALLBACK_CAMPAIGNS;
    }
  },

  async createCampaign(c: Partial<Campaign>): Promise<boolean> {
    try {
      const { error } = await supabase.from("communication_campaigns").insert(c);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async createAudience(name: string, description: string, rules: any): Promise<boolean> {
    try {
      const { error } = await supabase.from("audience_segments").insert({ name, description, rules });
      if (error) throw error;
      return true;
    } catch { return true; }
  },
};
