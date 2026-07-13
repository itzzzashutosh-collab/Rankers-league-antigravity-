"use client";

import * as React from "react";
import { Zap, ChevronRight, History } from "lucide-react";
import { cn } from "@/lib/utils";

export const AURA_TIERS = [
  { name: "Bronze", min: 0, max: 499, color: "text-amber-700 bg-amber-700/10 border-amber-700/25", glow: "shadow-amber-700/5" },
  { name: "Silver", min: 500, max: 999, color: "text-slate-400 bg-slate-400/10 border-slate-400/25", glow: "shadow-slate-400/5" },
  { name: "Gold", min: 1000, max: 2499, color: "text-amber-500 bg-amber-500/10 border-amber-500/25", glow: "shadow-amber-500/10" },
  { name: "Platinum", min: 2500, max: 4999, color: "text-sky-400 bg-sky-400/10 border-sky-400/25", glow: "shadow-sky-400/10" },
  { name: "Diamond", min: 5000, max: 9999, color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/25", glow: "shadow-cyan-400/10" },
  { name: "Master", min: 10000, max: 24999, color: "text-purple-500 bg-purple-500/10 border-purple-500/25", glow: "shadow-purple-500/10" },
  { name: "Legend", min: 25000, max: 49999, color: "text-pink-500 bg-pink-500/10 border-pink-500/25", glow: "shadow-pink-500/10" },
  { name: "Grandmaster", min: 50000, max: Infinity, color: "text-red-500 bg-red-500/10 border-red-500/25", glow: "shadow-red-500/15" },
];

export function getTierInfo(points: number) {
  const tier = AURA_TIERS.find((t) => points >= t.min && points <= t.max);
  return tier || AURA_TIERS[0];
}

interface AuraActivity {
  id: string;
  event_type: string;
  points: number;
  description: string;
  created_at: string;
}

interface AuraHubProps {
  currentAura: number;
  monthlyAura: number;
  history: AuraActivity[];
  compact?: boolean;
}

export function AuraHub({ currentAura, monthlyAura, history, compact }: AuraHubProps) {
  const currentTier = getTierInfo(currentAura);
  const nextTierIndex = AURA_TIERS.findIndex((t) => t.name === currentTier.name) + 1;
  const nextTier = nextTierIndex < AURA_TIERS.length ? AURA_TIERS[nextTierIndex] : null;

  const pointsInCurrentTier = currentAura - currentTier.min;
  const tierRange = nextTier ? nextTier.min - currentTier.min : 1;
  const progressPercent = nextTier ? Math.min(100, Math.max(0, (pointsInCurrentTier / tierRange) * 100)) : 100;
  const pointsNeeded = nextTier ? nextTier.min - currentAura : 0;

  return (
    <div className="space-y-6">
      {/* Tier summary card */}
      <div className={cn(
        "relative overflow-hidden bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl",
        currentTier.glow
      )}>
        {/* Ambient background glow matching tier color */}
        <div className={cn("absolute right-0 top-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 transition-all", 
          currentTier.name === "Gold" ? "bg-amber-500" :
          currentTier.name === "Platinum" ? "bg-sky-400" :
          currentTier.name === "Diamond" ? "bg-cyan-400" :
          currentTier.name === "Master" ? "bg-purple-500" : "bg-primary"
        )} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <div className={cn("px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border", currentTier.color)}>
                {currentTier.name} Tier
              </div>
              <span className="text-[10px] text-muted-foreground font-semibold">Current Division</span>
            </div>
            
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl font-black text-foreground">{currentAura.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground font-bold">Aura Points</span>
            </div>
          </div>

          <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border/20">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase">Earned This Month</p>
            <p className="text-lg font-black text-primary mt-0.5">+{monthlyAura.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {nextTier && (
          <div className="mt-6 relative z-10">
            <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground mb-2">
              <span>Next Tier: {nextTier.name}</span>
              <span>{pointsNeeded.toLocaleString()} Points needed</span>
            </div>
            <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-muted-foreground/60 mt-1.5 font-mono">
              <span>{currentTier.min.toLocaleString()}</span>
              <span>{nextTier.min.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Elegant Aura level path progress cards */}
      {!compact && (
        <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-black text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary fill-primary" />
            League Tiers Path
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {AURA_TIERS.map((tier) => {
              const isActiveTier = currentTier.name === tier.name;
              const isUnlocked = currentAura >= tier.min;
              return (
                <div
                  key={tier.name}
                  className={cn(
                    "p-3 rounded-xl border flex flex-col justify-between min-h-[90px] transition-all",
                    isActiveTier
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/5"
                      : isUnlocked
                      ? "border-border/60 bg-muted/20 opacity-80"
                      : "border-border/30 bg-muted/5 opacity-40"
                  )}
                >
                  <div>
                    <span className={cn("px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border", tier.color)}>
                      {tier.name}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                      {tier.max === Infinity ? `${tier.min.toLocaleString()}+` : `${tier.min.toLocaleString()} - ${tier.max.toLocaleString()}`}
                    </p>
                  </div>
                  {isActiveTier && (
                    <span className="text-[8px] font-bold text-primary uppercase text-right mt-1">Current</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent aura activity log */}
      <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-border/30 flex items-center justify-between">
          <h3 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-muted-foreground" />
            Aura Ledger Activity
          </h3>
        </div>

        <div className="divide-y divide-border/20 max-h-72 overflow-y-auto">
          {history.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No recent aura activity recorded.
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-muted/10 transition-colors">
                <div>
                  <p className="text-xs font-bold text-foreground">{item.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(item.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className={cn(
                    "text-xs font-black",
                    item.points >= 0 ? "text-primary" : "text-destructive"
                  )}>
                    {item.points >= 0 ? `+${item.points}` : item.points}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
export default AuraHub;
