"use client";

import * as React from "react";
import { Sparkles, Trophy, Users, Award, ShieldCheck } from "lucide-react";
import { Typography, Section, Container } from "../ui";

export function ContestHero() {
  const metrics = [
    {
      label: "Active Championships",
      value: "5 Arenas Live Soon",
      icon: Trophy,
      color: "text-amber-500 bg-amber-500/5 border-amber-500/10",
    },
    {
      label: "Accumulated Rewards",
      value: "₹24,00,000+",
      icon: Award,
      color: "text-primary bg-primary/5 border-primary/10",
    },
    {
      label: "Active Contenders",
      value: "148,992 Aspirants",
      icon: Users,
      color: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    },
    {
      label: "Standing Authenticity",
      value: "100% Audited RLS",
      icon: ShieldCheck,
      color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    },
  ];

  return (
    <Section radialGlow className="pt-20 pb-12 border-b border-border/20 bg-background/30">
      <Container className="text-center max-w-4xl mx-auto flex flex-col gap-5">
        <div className="inline-flex items-center gap-1.5 self-center bg-primary/5 text-primary border border-primary/15 rounded-full px-3.5 py-1 text-[10px] sm:text-xs font-bold tracking-widest uppercase select-none">
          <Sparkles className="w-3.5 h-3.5" />
          Verifiable Academic Standing
        </div>

        <Typography variant="display-l" className="font-extrabold tracking-tight">
          Competition & Contest Discovery
        </Typography>

        <Typography variant="subtitle" className="max-w-2xl mx-auto text-muted-foreground">
          Enroll in scheduled, high-fidelity Competitive Examination Championships. Compete against top talent nationwide, secure verified standing percentiles, and unlock premium academic awards.
        </Typography>

        {/* Dynamic Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-left">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-card/40 backdrop-blur-md border border-border/40 p-4 rounded-xl flex flex-col gap-2.5 shadow-sm hover:border-primary/20 transition-colors"
              >
                <div className={`p-2 rounded-lg border w-fit ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold block">
                    {m.label}
                  </span>
                  <span className="text-sm font-bold text-foreground block mt-0.5">
                    {m.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
export default ContestHero;
