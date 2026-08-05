"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, BookOpen, Lock, AlertTriangle } from "lucide-react";
import { Card } from "../ui";
import { generalContestRules } from "../../content/contest-rules";
import { cn } from "@/lib/utils";

interface ContestRulesProps {
  customRules?: string[];
  className?: string;
}

export function ContestRules({ customRules, className }: ContestRulesProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Integrity Statement Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-card to-card border border-amber-500/25 p-5 rounded-2xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
            Ranker&apos;s League Official Fair Play Policy & Academic Integrity Charter
          </span>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            All contests operate under active AI proctoring, browser lockdown protocols, and candidate IP verification. Fraudulent attempts or multi-account usage result in immediate disqualification, rank forfeiture, and permanent wallet ban.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column: lockdown rules */}
        <div className="flex flex-col gap-6">
          {/* 70% Seat Confirmation & Auto Refund Rule */}
          <Card variant="solid" className="border border-emerald-500/30 p-5 rounded-2xl bg-emerald-500/5">
            <h4 className="text-sm font-black text-foreground mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              70% Seat Filling Confirmation Threshold & Auto-Refund Policy
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              To guarantee prize pool integrity and fair national competitive standing:
            </p>
            <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 pl-1 leading-relaxed">
              <li className="marker:text-emerald-400"><strong className="text-foreground">70% Seat Confirmation:</strong> Every contest requires at least 70% of total seats registered by start time to go live.</li>
              <li className="marker:text-emerald-400"><strong className="text-foreground">Guaranteed Live:</strong> Once 70% seats fill, the contest status switches to 🔴 Guaranteed Live.</li>
              <li className="marker:text-emerald-400"><strong className="text-foreground">100% Instant Wallet Refund:</strong> If less than 70% seats fill when the registration window closes, the contest is cancelled and 100% of your entry fee is automatically refunded to your wallet instantly.</li>
            </ul>
          </Card>

          <Card variant="solid" className="border border-border/40 p-5 rounded-2xl bg-card/40">
            <h4 className="text-sm font-black text-foreground mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Browser Lockdown & Tab-Switch Limit (3 Strike Rule)
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Once an exam session starts, your browser enters proctored lockdown mode:
            </p>
            <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 pl-1 leading-relaxed">
              <li className="marker:text-primary"><strong className="text-foreground">3 Strike Tab Warning:</strong> Switching tabs or windows 3 times auto-submits your test immediately.</li>
              <li className="marker:text-primary"><strong className="text-foreground">Copy/Paste Blocked:</strong> Copying questions or pasting text is disabled by proctoring software.</li>
              <li className="marker:text-primary"><strong className="text-foreground">DevTools Detection:</strong> Opening inspect element or console triggers instant exam termination.</li>
            </ul>
          </Card>

          {generalContestRules.slice(0, 1).map((r, idx) => (
            <Card key={idx} variant="solid" className="border border-border/40 p-5 rounded-2xl bg-card/40">
              <h4 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                {r.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{r.description}</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 pl-1 leading-relaxed">
                {r.points.map((pt, pIdx) => (
                  <li key={pIdx} className="marker:text-primary/60">
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Right column: scheduling and custom rules */}
        <div className="flex flex-col gap-6">
          {/* Timing Rules */}
          <Card variant="solid" className="border border-border/40 p-5 rounded-2xl bg-card/40">
            <h4 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {generalContestRules[2]?.title || "Exam Timing & Window Limits"}
            </h4>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{generalContestRules[2]?.description}</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 pl-1 leading-relaxed">
              {generalContestRules[2]?.points.map((pt, pIdx) => (
                <li key={pIdx} className="marker:text-primary/60">
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Contest Specific Rules */}
          {customRules && customRules.length > 0 && (
            <Card variant="gradient-border" className="p-5 rounded-2xl bg-card/40 border border-primary/20">
              <h4 className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Marking & Specific Contest Guidelines
              </h4>
              <p className="text-xs text-muted-foreground mb-3">Guidelines calibrated specifically to this contest arena:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 pl-1 leading-relaxed">
                {customRules.map((pt, pIdx) => (
                  <li key={pIdx} className="marker:text-primary/60">
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
export default ContestRules;
