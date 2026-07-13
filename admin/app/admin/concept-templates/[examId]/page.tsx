'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Layers, ShieldAlert, Award, ArrowRight } from 'lucide-react';

interface ChapterStats {
  subject_name: string;
  chapter_name: string;
  total_concepts: number;
  concepts_with_templates: number;
  total_templates: number;
  easy_count: number;
  medium_count: number;
  hard_count: number;
  pro_count: number;
  legend_count: number;
  coverage_percent: number;
}

export default function ExamTemplatesDetail({ params }: { params: { examId: string } }) {
  const examName = decodeURIComponent(params.examId);
  const [chapters, setChapters] = useState<ChapterStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/concept-bank/coverage?exam=${encodeURIComponent(examName)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setChapters(res.chapter_detail || []);
        }
      })
      .catch((err) => console.error('Error fetching chapter details:', err))
      .finally(() => setLoading(false));
  }, [examName]);

  // Group chapters by subject
  const subjectsMap: Record<string, ChapterStats[]> = {};
  for (const c of chapters) {
    if (!subjectsMap[c.subject_name]) {
      subjectsMap[c.subject_name] = [];
    }
    subjectsMap[c.subject_name].push(c);
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
        <Link href="/admin/concept-templates" className="hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="w-3 h-3" /> Template Bank
        </Link>
        <span>/</span>
        <span className="text-foreground">{examName}</span>
      </div>

      {/* Header */}
      <div className="border-b border-border/40 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Award className="w-8 h-8 text-primary" /> {examName} Blueprints
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Subject breakdown, syllabus chapters, and template coverage distribution.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground font-semibold">Analyzing blueprints...</p>
        </div>
      ) : Object.keys(subjectsMap).length === 0 ? (
        <div className="text-center py-16 bg-card border border-border/40 rounded-2xl">
          <ShieldAlert className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-bold text-lg">No Chapters Seeded</h3>
          <p className="text-muted-foreground text-sm">Please verify the CSV seed data in rl_concepts table.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(subjectsMap).map(([subject, chps]) => (
            <div key={subject} className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-border/40 pb-2">
                <Layers className="w-5 h-5 text-indigo-400" /> {subject}
              </h2>

              <div className="bg-card border border-border/40 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                      <th className="p-4">Chapter Name</th>
                      <th className="p-4 text-center">Concepts</th>
                      <th className="p-4 text-center">Templates</th>
                      <th className="p-4">Coverage</th>
                      <th className="p-4">Difficulty Distribution</th>
                      <th className="p-4 text-right">Configure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chps.map((c) => (
                      <tr key={c.chapter_name} className="border-b border-border/40 hover:bg-muted/20 transition">
                        <td className="p-4 font-bold text-foreground max-w-sm truncate">
                          <Link
                            href={`/admin/concept-templates/${encodeURIComponent(examName)}/${encodeURIComponent(c.subject_name)}/${encodeURIComponent(c.chapter_name)}`}
                            className="hover:underline"
                          >
                            {c.chapter_name}
                          </Link>
                        </td>
                        <td className="p-4 text-center text-muted-foreground">{c.total_concepts}</td>
                        <td className="p-4 text-center text-muted-foreground">{c.total_templates}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.coverage_percent >= 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}
                          >
                            {c.coverage_percent.toFixed(0)}%
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black border border-emerald-500/20" title="Easy">
                              E:{c.easy_count}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[10px] font-black border border-amber-500/20" title="Medium">
                              M:{c.medium_count}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black border border-rose-500/20" title="Hard">
                              H:{c.hard_count}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500 text-[10px] font-black border border-purple-500/20" title="Pro">
                              P:{c.pro_count}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-pink-500/10 text-pink-500 text-[10px] font-black border border-pink-500/20" title="Legend">
                              L:{c.legend_count}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/admin/concept-templates/${encodeURIComponent(examName)}/${encodeURIComponent(c.subject_name)}/${encodeURIComponent(c.chapter_name)}`}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 justify-end"
                          >
                            Edit <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
