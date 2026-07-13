import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface CommTemplate {
  id: string;
  title: string;
  description?: string;
  channel: "Email" | "SMS" | "WhatsApp" | "In-App";
  subject_template?: string;
  body_template: string;
  variables: string[];
}

const FALLBACK_TEMPLATES: CommTemplate[] = [
  { id: "WELCOME_MESSAGE", title: "Welcome to Ranker's League", description: "Sent instantly upon registration completion.", channel: "Email", subject_template: "Welcome to Ranker's League, {{name}}!", body_template: "Hello {{name}},\n\nYour account @{{username}} is verified. Prepare to compete!", variables: ["name", "username"] },
  { id: "CONTEST_LOBBY_OPEN", title: "Lobby Open Notification", description: "Notification alert when examination lobby opens.", channel: "SMS", body_template: "The lobby for contest \"{{contest}}\" is now open. Join instantly!", variables: ["contest"] },
  { id: "PRIZE_CREDIT", title: "Contest Prize Credited", description: "Sent when contest earnings hit wallet.", channel: "In-App", subject_template: "Earnings Credited", body_template: "Congratulations! You won {{amount}} in the \"{{contest}}\" challenge. Balance updated.", variables: ["amount", "contest"] },
];

export const templateService = {
  async getTemplates(): Promise<CommTemplate[]> {
    try {
      const { data, error } = await supabase.from("communication_templates").select("*");
      if (error || !data?.length) return FALLBACK_TEMPLATES;
      return data as CommTemplate[];
    } catch {
      return FALLBACK_TEMPLATES;
    }
  },

  async getTemplate(id: string): Promise<CommTemplate | null> {
    try {
      const { data, error } = await supabase.from("communication_templates").select("*").eq("id", id).single();
      if (error) throw error;
      return data as CommTemplate;
    } catch {
      return FALLBACK_TEMPLATES.find(t => t.id === id) || null;
    }
  },

  async createTemplate(tpl: CommTemplate): Promise<boolean> {
    try {
      const { error } = await supabase.from("communication_templates").insert(tpl);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async updateTemplate(id: string, tpl: Partial<CommTemplate>): Promise<boolean> {
    try {
      const { error } = await supabase.from("communication_templates").update(tpl).eq("id", id);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  parseTemplate(body: string, vars: Record<string, string>): string {
    let output = body;
    Object.entries(vars).forEach(([k, v]) => {
      output = output.replace(new RegExp(`{{${k}}}`, "g"), v);
    });
    return output;
  },
};
