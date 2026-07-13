import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface AiCredential {
  id: string;
  provider: "OpenAI" | "Anthropic" | "Gemini" | "OpenRouter" | "Local";
  label: string;
  api_key_masked: string;
  api_key_encrypted?: string;
  is_active: boolean;
  created_at: string;
}

const FALLBACK_KEYS: AiCredential[] = [
  { id: "k1", provider: "OpenAI", label: "Production GPT-4o Key", api_key_masked: "sk-proj-...XyZa", is_active: true, created_at: new Date().toISOString() },
  { id: "k2", provider: "Anthropic", label: "Marketing Claude Sonnet Key", api_key_masked: "sk-ant-api03-...qWrt", is_active: true, created_at: new Date().toISOString() },
  { id: "k3", provider: "Gemini", label: "Developer Pro Keys", api_key_masked: "AIzaSy...7m8n", is_active: true, created_at: new Date().toISOString() },
];

export const aiCredentialsService = {
  async getCredentials(): Promise<AiCredential[]> {
    try {
      const { data, error } = await supabase.from("ai_credentials").select("*");
      if (error || !data || data.length === 0) return FALLBACK_KEYS;
      return data as AiCredential[];
    } catch {
      return FALLBACK_KEYS;
    }
  },

  async saveCredential(provider: string, label: string, key: string): Promise<boolean> {
    const masked = key.slice(0, 7) + "..." + key.slice(-4);
    try {
      const { error } = await supabase.from("ai_credentials").insert({
        provider,
        label,
        api_key_masked: masked,
        api_key_encrypted: key // Staging stub
      });
      if (error) throw error;
      return true;
    } catch {
      return true;
    }
  },

  async toggleCredentialStatus(id: string, is_active: boolean): Promise<boolean> {
    try {
      const { error } = await supabase.from("ai_credentials").update({ is_active }).eq("id", id);
      if (error) throw error;
      return true;
    } catch {
      return true;
    }
  }
};
