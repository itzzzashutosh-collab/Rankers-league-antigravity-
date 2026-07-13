"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { paperService } from "@/services/paperService";

export default function VersionsEquivalenceGrid() {
  const [questions, setQuestions] = useState([
    { id: "q1", title: "Electrostatics force magnitude", chapter: "Electrostatics", marks: 4 },
    { id: "q2", title: "Faradays Lenz Law induction", chapter: "Magnetism", marks: 4 },
    { id: "q3", title: "First order Kinetics half life", chapter: "Chemical Kinetics", marks: 4 }
  ]);

  const [versionMaps, setVersionMaps] = useState<any>(
    paperService.generateVersionMaps([
      { id: "q1", title: "Electrostatics force magnitude", marks: 4 },
      { id: "q2", title: "Faradays Lenz Law induction", marks: 4 },
      { id: "q3", title: "First order Kinetics half life", marks: 4 }
    ])
  );

  const shuffleVersions = () => {
    const freshMaps = paperService.generateVersionMaps(questions);
    setVersionMaps(freshMaps);
    alert("Equivalent question order index maps shuffled for Version A, B, C, D!");
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/papers"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Equivalence Versions Matrix
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Verify randomized question index paths for Version A, B, C, and D mappings side by side.
            </p>
          </div>
        </div>

        <button
          onClick={shuffleVersions}
          className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-bold flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Shuffle Version Maps
        </button>
      </div>

      <section className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Equivalent marks & difficulty indexes mapping
        </h2>

        <div className="overflow-x-auto border border-border/60 rounded-xl bg-background/25 text-xs font-semibold">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-muted/40 border-b border-border/80 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Reference Question</th>
                <th className="p-3 text-center">Version A Index</th>
                <th className="p-3 text-center">Version B Index</th>
                <th className="p-3 text-center">Version C Index</th>
                <th className="p-3 text-center">Version D Index</th>
                <th className="p-3 text-right">Marks Weightage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-[11px]">
              {questions.map((q, idx) => {
                // Lookup mapped index in shuffled lists
                const idxA = versionMaps["Version A"]?.findIndex((x: any) => x.id === q.id) ?? 0;
                const idxB = versionMaps["Version B"]?.findIndex((x: any) => x.id === q.id) ?? 0;
                const idxC = versionMaps["Version C"]?.findIndex((x: any) => x.id === q.id) ?? 0;
                const idxD = versionMaps["Version D"]?.findIndex((x: any) => x.id === q.id) ?? 0;
                return (
                  <tr key={q.id} className="hover:bg-card/10 transition-colors">
                    <td className="p-3 text-foreground font-bold">{q.title}</td>
                    <td className="p-3 text-center text-muted-foreground font-mono">#{idxA + 1}</td>
                    <td className="p-3 text-center text-muted-foreground font-mono">#{idxB + 1}</td>
                    <td className="p-3 text-center text-muted-foreground font-mono">#{idxC + 1}</td>
                    <td className="p-3 text-center text-muted-foreground font-mono">#{idxD + 1}</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{q.marks} Marks</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
