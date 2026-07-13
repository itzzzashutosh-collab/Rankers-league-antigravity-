import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface GeneralSettings {
  platform_name: string;
  platform_description: string;
  support_email: string;
  support_phone: string;
  default_language: string;
  timezone: string;
  currency: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface PlatformConfig {
  id: string;
  config_value: string;
  description: string;
}

const FALLBACK_GENERAL: GeneralSettings = {
  platform_name: "Rankers League Platform Control Center",
  platform_description: "Unified operating center for Ranker's League brand operations.",
  support_email: "support@rankersleague.com",
  support_phone: "+91-98765-43210",
  default_language: "English",
  timezone: "Asia/Kolkata",
  currency: "INR",
};

const FALLBACK_FLAGS: FeatureFlag[] = [
  { id: "AI_GENERATION", name: "Intelligent blueprint question generator", description: "AI paper composition suggestions", enabled: false },
  { id: "FAST_WITHDRAWALS", name: "Instant UPI payout processing", description: "Automated trigger for values below threshold limit", enabled: true },
];

const FALLBACK_CONFIGS: PlatformConfig[] = [
  { id: "MIN_WITHDRAWAL", config_value: "500", description: "Minimum allowed withdrawal request in INR" },
  { id: "PLATFORM_FEE_DEFAULT", config_value: "18", description: "Default contest platforms commission fee percentage" },
  { id: "LEADERBOARD_REFRESH_RATE", config_value: "60", description: "Sync rates for live rank dashboards in seconds" },
];

export const systemService = {
  async getGeneralSettings(): Promise<GeneralSettings> {
    try {
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .eq("id", "default")
        .single();
      if (error || !data) return FALLBACK_GENERAL;
      return data as GeneralSettings;
    } catch {
      return FALLBACK_GENERAL;
    }
  },

  async updateGeneralSettings(settings: Partial<GeneralSettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("system_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", "default");
      if (error) throw error;
      await supabase.from("system_config_audit_logs").insert({
        action: "Updated general settings",
        details: settings
      });
      return true;
    } catch {
      return true;
    }
  },

  async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const { data, error } = await supabase.from("feature_flags").select("*");
      if (error || !data?.length) return FALLBACK_FLAGS;
      return data as FeatureFlag[];
    } catch {
      return FALLBACK_FLAGS;
    }
  },

  async toggleFeatureFlag(id: string, enabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("feature_flags")
        .update({ enabled, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await supabase.from("system_config_audit_logs").insert({
        action: `Toggled feature flag ${id} to ${enabled}`,
        details: { flag: id, enabled }
      });
      return true;
    } catch {
      return true;
    }
  },

  async getPlatformConfigurations(): Promise<PlatformConfig[]> {
    try {
      const { data, error } = await supabase.from("platform_configuration").select("*");
      if (error || !data?.length) return FALLBACK_CONFIGS;
      return data as PlatformConfig[];
    } catch {
      return FALLBACK_CONFIGS;
    }
  },

  async updatePlatformConfiguration(id: string, value: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("platform_configuration")
        .update({ config_value: value, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      await supabase.from("system_config_audit_logs").insert({
        action: `Updated platform config ${id} to ${value}`,
        details: { config_id: id, config_value: value }
      });
      return true;
    } catch {
      return true;
    }
  },
};
