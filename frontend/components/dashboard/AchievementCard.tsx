"use client";

import { cn } from "@/lib/utils";
import { Star, Award, Calendar } from "lucide-react";

interface Achievement {
  id: string;
  achievement_key: string;
  category: string;
  title: string;
  description: string;
  icon?: string;
  color?: string;
  rarity?: string;
  aura_reward?: number;
  earned_at?: string;
  unlocked?: boolean;
}

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.unlocked !== false;

  const rarityColor = 
    achievement.rarity === "epic" ? "border-amber-500/35 bg-amber-500/5 text-amber-500" :
    achievement.rarity === "rare" ? "border-purple-500/35 bg-purple-500/5 text-purple-500" :
    achievement.rarity === "uncommon" ? "border-sky-500/35 bg-sky-500/5 text-sky-500" :
    "border-border/40 text-muted-foreground";

  return (
    <div className={cn(
      "relative bg-card/60 backdrop-blur-xl border rounded-2xl p-4 transition-all flex items-start gap-3.5 min-h-[110px]",
      isUnlocked
        ? "border-border/40 hover:border-primary/20 hover:shadow-lg hover:-translate-y-0.5"
        : "border-border/20 opacity-50 grayscale hover:opacity-60"
    )}>
      {/* Icon display */}
      <div className={cn(
        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-2xl border",
        isUnlocked ? "bg-primary/10 border-primary/20" : "bg-muted/30 border-border/20"
      )}>
        {achievement.icon || "🏆"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-black text-foreground truncate">{achievement.title}</h4>
          {isUnlocked && achievement.rarity && (
            <span className={cn("px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border", rarityColor)}>
              {achievement.rarity}
            </span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {achievement.description}
        </p>

        <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-border/10">
          <span className="flex items-center gap-1 text-[9px] font-bold text-primary">
            <Star className="w-3 h-3 text-primary fill-primary" />
            +{achievement.aura_reward || 0} Aura
          </span>
          {isUnlocked && achievement.earned_at ? (
            <span className="flex items-center gap-1 text-[8px] text-muted-foreground/60 font-mono">
              <Calendar className="w-2.5 h-2.5" />
              {new Date(achievement.earned_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })}
            </span>
          ) : (
            <span className="text-[8px] text-muted-foreground font-black uppercase tracking-wider">Locked</span>
          )}
        </div>
      </div>
    </div>
  );
}
export default AchievementCard;
