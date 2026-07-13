import { createClient } from "@/utils/supabase/server";

export interface AchievementCatalogItem {
  key: string;
  category_id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  aura_reward: number;
  unlocked: boolean;
  earned_at?: string;
}

export interface BadgeCatalogItem {
  key: string;
  category_id: string;
  title: string;
  description: string;
  requirements: string;
  target_value: number;
  icon: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";
  badge_artwork: string;
  unlocked: boolean;
  earned_at?: string;
  current_progress: number;
}

export interface UserCertificate {
  id: string;
  user_id: string;
  contest_id: string | null;
  contest_slug: string | null;
  contest_name: string;
  exam_category: string | null;
  participant_name: string;
  rank: number | null;
  score: number | null;
  certificate_type: "participation" | "winner" | "top_performer" | "special_recognition" | "national_rank" | "global_rank";
  certificate_number: string;
  verification_id: string;
  created_at: string;
}

export interface UserStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  weekly_activity_mask: number;
  monthly_activity_mask: number;
  updated_at: string;
}

export interface AuraTierInfo {
  currentTier: string;
  nextTier: string | null;
  minAura: number;
  maxAura: number;
  color: string;
  badge: string;
  remainingAura: number;
  progressPercent: number;
}

export interface AuraHistoryEvent {
  id: string;
  event_type: string;
  points: number;
  description: string;
  contest_name: string | null;
  created_at: string;
}

export const achievementsService = {
  // Get all user achievements
  async getUserAchievements(userId: string): Promise<{
    catalog: AchievementCatalogItem[];
    completionPercentage: number;
    totalUnlocked: number;
    totalLocked: number;
    latestAchievement: AchievementCatalogItem | null;
    nextAchievement: AchievementCatalogItem | null;
  }> {
    const supabase = await createClient();

    // 1. Fetch catalog
    const { data: catalogData } = await supabase
      .from("achievements")
      .select("*");

    // 2. Fetch user unlocked records
    const { data: unlockedData } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId);

    const unlockedMap = new Map<string, string>(); // key -> earned_at
    unlockedData?.forEach((ach) => {
      unlockedMap.set(ach.achievement_key, ach.earned_at);
    });

    const catalog: AchievementCatalogItem[] = (catalogData || []).map((item) => {
      const isUnlocked = unlockedMap.has(item.key);
      return {
        key: item.key,
        category_id: item.category_id,
        title: item.title,
        description: item.description,
        icon: item.icon || "🏆",
        rarity: item.rarity,
        aura_reward: item.aura_reward,
        unlocked: isUnlocked,
        earned_at: unlockedMap.get(item.key),
      };
    });

    const totalUnlocked = catalog.filter((a) => a.unlocked).length;
    const totalLocked = catalog.length - totalUnlocked;
    const completionPercentage = catalog.length > 0 ? Math.round((totalUnlocked / catalog.length) * 100) : 0;

    // Get latest unlocked
    const sortedUnlocked = [...catalog]
      .filter((a) => a.unlocked && a.earned_at)
      .sort((a, b) => new Date(b.earned_at!).getTime() - new Date(a.earned_at!).getTime());
    const latestAchievement = sortedUnlocked[0] || null;

    // Suggest a locked one to unlock next
    const nextAchievement = catalog.find((a) => !a.unlocked) || null;

    return {
      catalog,
      completionPercentage,
      totalUnlocked,
      totalLocked,
      latestAchievement,
      nextAchievement,
    };
  },

  // Get all badges & progress
  async getUserBadges(userId: string): Promise<BadgeCatalogItem[]> {
    const supabase = await createClient();

    // 1. Fetch badges catalog
    const { data: badgesData } = await supabase.from("badges").select("*");

    // 2. Fetch user unlocked badges
    const { data: userBadgesData } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId);

    // 3. Fetch badge progress
    const { data: progressData } = await supabase
      .from("badge_progress")
      .select("*")
      .eq("user_id", userId);

    const unlockedMap = new Map<string, string>(); // key -> earned_at
    userBadgesData?.forEach((b) => {
      unlockedMap.set(b.badge_key, b.earned_at);
    });

    const progressMap = new Map<string, number>(); // key -> progress
    progressData?.forEach((p) => {
      progressMap.set(p.badge_key, p.current_progress);
    });

    return (badgesData || []).map((b) => {
      const isUnlocked = unlockedMap.has(b.key);
      const current_progress = progressMap.get(b.key) || (isUnlocked ? b.target_value : 0);
      return {
        key: b.key,
        category_id: b.category_id,
        title: b.title,
        description: b.description,
        requirements: b.requirements,
        target_value: b.target_value,
        icon: b.icon || "🏅",
        rarity: b.rarity,
        badge_artwork: b.badge_artwork || "",
        unlocked: isUnlocked,
        earned_at: unlockedMap.get(b.key),
        current_progress,
      };
    });
  },

  // Get all user certificates
  async getUserCertificates(userId: string): Promise<UserCertificate[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("user_certificates")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as UserCertificate[];
  },

  // Get user streaks
  async getUserStreak(userId: string): Promise<UserStreak> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("streaks")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return {
        user_id: userId,
        current_streak: 0,
        longest_streak: 0,
        last_active_date: null,
        weekly_activity_mask: 0,
        monthly_activity_mask: 0,
        updated_at: new Date().toISOString(),
      };
    }

    return data as UserStreak;
  },

  // Get Aura details & tier progression
  async getAuraProgress(userId: string): Promise<{
    tierInfo: AuraTierInfo;
    history: AuraHistoryEvent[];
  }> {
    const supabase = await createClient();

    // 1. Get user profile aura
    const { data: profile } = await supabase
      .from("profiles")
      .select("aura_points")
      .eq("id", userId)
      .single();

    const currentAura = profile?.aura_points || 0;

    // 2. Fetch all levels to evaluate tier
    const { data: tiers } = await supabase
      .from("aura_levels")
      .select("*")
      .order("min_aura", { ascending: true });

    let currentTier = "Explorer";
    let nextTier: string | null = null;
    let minAura = 0;
    let maxAura = 499;
    let color = "text-zinc-400 border-zinc-500/20 bg-zinc-500/5";
    let badge = "Explorer";

    if (tiers && tiers.length > 0) {
      for (let i = 0; i < tiers.length; i++) {
        const t = tiers[i];
        if (currentAura >= t.min_aura && currentAura <= t.max_aura) {
          currentTier = t.tier;
          minAura = t.min_aura;
          maxAura = t.max_aura;
          color = t.color;
          badge = t.badge;
          nextTier = i + 1 < tiers.length ? tiers[i + 1].tier : null;
          break;
        }
      }
    }

    const range = maxAura - minAura;
    const progressInTier = currentAura - minAura;
    const progressPercent = range > 0 ? Math.min(100, Math.max(0, Math.round((progressInTier / range) * 100))) : 100;
    const remainingAura = nextTier ? maxAura + 1 - currentAura : 0;

    const tierInfo: AuraTierInfo = {
      currentTier,
      nextTier,
      minAura,
      maxAura,
      color,
      badge,
      remainingAura,
      progressPercent,
    };

    // 3. Fetch recent history
    const { data: historyData } = await supabase
      .from("aura_history")
      .select("id, event_type, points, description, contest_name, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return {
      tierInfo,
      history: (historyData || []) as AuraHistoryEvent[],
    };
  },

  // Verify certificate by public verification ID
  async verifyCertificate(verificationId: string): Promise<{
    certificate: UserCertificate | null;
    verificationCount: number;
    error: string | null;
  }> {
    const supabase = await createClient();
    const { data: cert, error } = await supabase
      .from("user_certificates")
      .select("*")
      .eq("verification_id", verificationId)
      .maybeSingle();

    if (error || !cert) {
      return { certificate: null, verificationCount: 0, error: "Certificate not found" };
    }

    // Increment verification auditor count
    const { data: verifyLogs } = await supabase
      .from("certificate_verifications")
      .select("*")
      .eq("certificate_id", cert.id)
      .maybeSingle();

    let viewCount = 1;
    if (verifyLogs) {
      viewCount = verifyLogs.view_count + 1;
      await supabase
        .from("certificate_verifications")
        .update({ view_count: viewCount })
        .eq("certificate_id", cert.id);
    } else {
      await supabase
        .from("certificate_verifications")
        .insert({ certificate_id: cert.id, view_count: 1 });
    }

    return {
      certificate: cert as UserCertificate,
      verificationCount: viewCount,
      error: null,
    };
  },
};
