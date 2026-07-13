"use client";

import * as React from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";
import { antiCheatPolicy } from "../../content/live/contest-lobby";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface AntiCheatPanelProps {
  className?: string;
}

export function AntiCheatPanel({ className }: AntiCheatPanelProps) {
  return (
    <div className={cn("flex flex-col gap-5 text-left", className)}>
      <div className="bg-destructive/5 border border-destructive/15 p-4 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-destructive uppercase tracking-wider block">
            Zero-Tolerance Anti-Cheating Protocol
          </span>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            The championship workspace active lockdown inhibitors will terminate sessions immediately upon registering violations. Integrity audits are absolute.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {antiCheatPolicy.map((p, idx) => {
          const parts = p.split(": ");
          const title = parts[0];
          const desc = parts[1];

          return (
            <Card key={idx} variant="solid" className="border border-border/40 p-4 rounded-xl bg-card/20 flex gap-3">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-foreground block">{title}</strong>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export default AntiCheatPanel;
