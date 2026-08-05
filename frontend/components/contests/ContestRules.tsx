"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, BookOpen } from "lucide-react";
import { Card, Typography } from "../ui";
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
      <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Academic integrity protocol active
          </span>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            All contests are audited under active browser proctoring systems to establish verified standing credentials. Fraudulent actions result in instant disqualified standing.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column: lockdown rules */}
        <div className="flex flex-col gap-6">
          {generalContestRules.slice(0, 2).map((r, idx) => (
            <Card key={idx} variant="solid" className="border border-border/40 p-5 rounded-2xl bg-card/40">
              <h4 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-primary" />
                {r.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{r.description}</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2.5 pl-1 leading-relaxed">
                {r.points.map((pt, pIdx) => (
                  <li key={pIdx} className="marker:text-primary/60">
                    <span className="text-muted-foreground">{pt}</span>
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
              {generalContestRules[2].title}
            </h4>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{generalContestRules[2].description}</p>
            <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2.5 pl-1 leading-relaxed">
              {generalContestRules[2].points.map((pt, pIdx) => (
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
                Syllabus & Marking Guidelines
              </h4>
              <p className="text-xs text-muted-foreground mb-4">Specific guidelines calibrated to this contest arena:</p>
              <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2.5 pl-1 leading-relaxed">
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
