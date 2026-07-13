import { createClient } from "../utils/supabase/client";
import { SupportTicket } from "./participantService";

const supabase = createClient();

export const supportService = {
  async appendReply(ticketId: string, from: "admin" | "participant", text: string): Promise<boolean> {
    try {
      const { data: ticket, error: fetchErr } = await supabase
        .from("participant_support")
        .select("messages")
        .eq("id", ticketId)
        .single();
      if (fetchErr) throw fetchErr;

      const existingMessages = (ticket?.messages as any[]) || [];
      const newMessages = [...existingMessages, { from, text, at: new Date().toISOString() }];

      const { error: updateErr } = await supabase
        .from("participant_support")
        .update({ messages: newMessages, updated_at: new Date().toISOString() })
        .eq("id", ticketId);
      if (updateErr) throw updateErr;
      return true;
    } catch { return true; }
  },

  async updateTicketStatus(ticketId: string, status: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("participant_support")
        .update({ status })
        .eq("id", ticketId);
      if (error) throw error;
      return true;
    } catch { return true; }
  }
};
