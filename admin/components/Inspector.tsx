"use client";

import React from "react";
import { X, ShieldAlert, Cpu, Sparkles, Terminal, Activity, FileCode } from "lucide-react";
import { useInspector } from "@/utils/InspectorContext";

export default function Inspector() {
  const { inspected, inspect } = useInspector();

  if (!inspected) return null;

  return (
    <aside className="w-80 border-l border-border bg-card/45 flex flex-col h-full animate-slide-in font-sans select-text text-xs shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/40 shrink-0">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Inspector Panel
          </span>
        </div>
        <button onClick={() => inspect(null)} className="p-1 rounded hover:bg-muted/40 text-muted-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Details */}
      <div className="p-5 space-y-6 flex-1">
        <div>
          <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
            {inspected.type}
          </span>
          <h3 className="text-sm font-black text-foreground mt-3 leading-snug">
            {inspected.title}
          </h3>
          {inspected.subtitle && (
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">
              {inspected.subtitle}
            </p>
          )}
        </div>

        {/* AI Insights Segment */}
        <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 space-y-2">
          <div className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI Copilot Insights
          </div>
          <p className="text-[10px] text-foreground/80 leading-relaxed font-semibold">
            Health: Normal. Active registrations tracking pace is matching historical benchmarks. Performance bounds are within limits.
          </p>
        </div>

        {/* Metadata Key-Values */}
        {inspected.metadata && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-muted-foreground" /> Parameters Metadata
            </h4>
            <div className="rounded-xl border border-border/40 bg-background/50 divide-y divide-border/20 overflow-hidden font-mono text-[9px]">
              {Object.entries(inspected.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between p-2.5">
                  <span className="text-muted-foreground font-semibold uppercase">{key}</span>
                  <span className="text-foreground font-bold break-all max-w-[140px] text-right">
                    {typeof value === "object" ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Log */}
        {inspected.timeline && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" /> Audit Trail History
            </h4>
            <div className="space-y-3 pl-2 border-l border-border/60">
              {inspected.timeline.map((evt, idx) => (
                <div key={idx} className="relative pl-3 space-y-0.5">
                  <div className="absolute left-[-11px] top-1.5 w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-background"></div>
                  <div className="font-bold text-foreground leading-normal">{evt.label}</div>
                  <div className="text-[8px] text-muted-foreground font-mono">{evt.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
