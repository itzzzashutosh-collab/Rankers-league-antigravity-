"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, ArrowRight, BookOpen, Star, Cpu } from "lucide-react";
import { paperService, PaperTemplate } from "@/services/paperService";

export default function TemplatesListPage() {
  const [templates, setTemplates] = useState<PaperTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await paperService.getTemplates();
      setTemplates(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Blueprint templates selector
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Generate balanced exam papers from predefined templates blueprints.
          </p>
        </div>
        <Link
          href="/admin/papers"
          className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 text-xs font-bold text-foreground flex items-center gap-1.5 transition-colors"
        >
          View All Papers
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
          Loading Blueprints...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-3xl border border-border bg-card/15 p-6 flex flex-col justify-between h-72 relative overflow-hidden group hover:border-primary/40 hover:bg-card/25 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[8px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <Cpu className="w-2.5 h-2.5" />
                    Template
                  </span>
                  <span className="text-[10px] text-muted-foreground/80 font-bold">
                    {tpl.exam_name}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                    {tpl.name}
                  </h3>
                  <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider">
                    Duration: {tpl.default_duration} minutes
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-background/50 text-[10px] text-muted-foreground/80 space-y-1 font-semibold leading-relaxed">
                  <div>Default Max Marks: <strong className="text-foreground">{tpl.default_max_marks}</strong></div>
                  <div>Target Sections:
                    <div className="flex flex-wrap gap-1 mt-1">
                      {tpl.sections_json.map((sec, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-muted/40 text-[9px]">
                          {sec.name} ({sec.questions} Qs)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href={`/admin/papers/create?templateId=${tpl.id}`}
                className="h-10 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-primary/15 mt-4"
              >
                Assemble Paper
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
