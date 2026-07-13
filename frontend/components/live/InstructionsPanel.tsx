"use client";

import * as React from "react";
import { BookOpen, AlertCircle, Award, Hourglass, ArrowRight } from "lucide-react";
import { InstructionsData } from "../../content/live/contest-lobby";
import { Card, Typography } from "../ui";
import { cn } from "@/lib/utils";

interface InstructionsPanelProps {
  data: InstructionsData;
  className?: string;
}

export function InstructionsPanel({ data, className }: InstructionsPanelProps) {
  const cards = [
    {
      label: "Duration & Timing",
      value: data.duration,
      icon: Hourglass,
      color: "text-amber-500 bg-amber-500/5 border-amber-500/10",
    },
    {
      label: "Question Pattern",
      value: data.questionPattern,
      icon: BookOpen,
      color: "text-blue-500 bg-blue-500/5 border-blue-500/10",
    },
    {
      label: "Marking Scheme",
      value: data.markingScheme,
      icon: Award,
      color: "text-emerald-500 bg-emerald-500/5 border-emerald-500/10",
    },
    {
      label: "Negative Marking penalty",
      value: data.negativeMarking,
      icon: AlertCircle,
      color: "text-destructive bg-destructive/5 border-destructive/10",
    },
  ];

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid sm:grid-cols-2 gap-4 text-left">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Card key={idx} variant="solid" className="bg-card/30 border border-border/40 p-4 rounded-xl flex items-start gap-3">
              <div className={`p-2 rounded-lg border shrink-0 ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block">
                  {c.label}
                </span>
                <p className="text-xs text-foreground font-semibold mt-1 leading-relaxed">
                  {c.value}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Navigation and Submission list */}
      <div className="grid md:grid-cols-2 gap-6 text-left">
        <div className="flex flex-col gap-3">
          <Typography variant="body-large" className="font-extrabold text-foreground tracking-tight border-b border-border/20 pb-2 flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-primary" />
            Navigation Guidelines
          </Typography>
          <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 leading-relaxed">
            {data.navigation.map((n, i) => (
              <li key={i} className="marker:text-primary/60">
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <Typography variant="body-large" className="font-extrabold text-foreground tracking-tight border-b border-border/20 pb-2 flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-primary" />
            Submission Rules
          </Typography>
          <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-2 leading-relaxed">
            {data.submission.map((s, i) => (
              <li key={i} className="marker:text-primary/60">
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default InstructionsPanel;
