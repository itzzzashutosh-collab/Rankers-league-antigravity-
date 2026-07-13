"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Award, FileText, RefreshCw, BarChart3, HelpCircle, CheckCircle, XCircle } from "lucide-react";

interface QuestionStat {
  id: string;
  question_text: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  correct_count: number;
  incorrect_count: number;
  avg_time_spent_seconds: number;
}

export default function ResultsWorkspace() {
  const [contests] = useState([
    { id: "cc001", name: "JEE Advanced Physics Grandmaster Challenge", participants: 1248, avg_score: 72.4 },
    { id: "cc002", name: "NEET Biology Sprint — Season 4", participants: 876, avg_score: 84.5 },
  ]);

  const [selectedContest, setSelectedContest] = useState("cc001");

  // Mocked question analytics for the chosen contest
  const questionStats: Record<string, QuestionStat[]> = {
    cc001: [
      { id: "q1", question_text: "Find the work done by a force of (2i + 3j) N in displacing a particle by (3i - 2j) m.", topic: "Work-Energy Theorem", difficulty: "Easy", correct_count: 980, incorrect_count: 268, avg_time_spent_seconds: 42 },
      { id: "q2", question_text: "Calculate the rotational kinetic energy of a solid sphere rolling down an inclined plane without slipping.", topic: "Rotational Mechanics", difficulty: "Medium", correct_count: 654, incorrect_count: 594, avg_time_spent_seconds: 88 },
      { id: "q3", question_text: "Derive the electrostatic potential due to a polarized dielectric sphere of radius R.", topic: "Electrostatics", difficulty: "Hard", correct_count: 312, incorrect_count: 936, avg_time_spent_seconds: 145 },
    ],
    cc002: [
      { id: "q1", question_text: "Which of the following cellular organelle contains hydrolytic enzymes?", topic: "Cell Biology", difficulty: "Easy", correct_count: 812, incorrect_count: 64, avg_time_spent_seconds: 18 },
      { id: "q2", question_text: "Explain the process of double fertilization in angiosperms and specify zygote ploidy.", topic: "Plant Reproduction", difficulty: "Medium", correct_count: 540, incorrect_count: 336, avg_time_spent_seconds: 35 },
    ]
  };

  const activeStats = questionStats[selectedContest] || [];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Results & Question Analysis
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Analyze question difficulty distribution, accuracy, and response breakdowns per contest paper.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Contest selector list */}
        <aside className="lg:col-span-4 space-y-2">
          <h2 className="font-black text-sm text-foreground uppercase tracking-wider mb-2">Select Contest</h2>
          {contests.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedContest(c.id)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                selectedContest === c.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"
              }`}
            >
              <div className="font-bold text-foreground leading-tight">{c.name}</div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{c.participants.toLocaleString()} participants</span>
                <span className="text-primary font-bold">Avg: {c.avg_score} pts</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Question stats list */}
        <section className="lg:col-span-8 space-y-5">
          <h2 className="font-black text-sm text-foreground uppercase tracking-wider">Question Accuracy & Performance</h2>
          
          <div className="space-y-4">
            {activeStats.map((q, idx) => {
              const total = q.correct_count + q.incorrect_count;
              const accuracy = ((q.correct_count / total) * 100).toFixed(1);

              return (
                <div key={q.id} className="rounded-3xl border border-border bg-card/15 p-5 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-primary uppercase font-black block">Question {idx + 1} · {q.topic}</span>
                      <p className="text-[11px] text-foreground font-bold leading-relaxed">{q.question_text}</p>
                    </div>
                    <span className={`text-[8px] font-black border px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      q.difficulty === "Easy" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" :
                      q.difficulty === "Medium" ? "text-amber-400 border-amber-500/20 bg-amber-500/5" :
                      "text-destructive border-destructive/20 bg-destructive/5"
                    }`}>{q.difficulty}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 border-t border-border/10 pt-3 text-[10px]">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{q.correct_count.toLocaleString()} Correct ({accuracy}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-destructive">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{q.incorrect_count.toLocaleString()} Incorrect</span>
                    </div>
                    <div className="text-right text-muted-foreground">
                      Avg Time: <strong className="text-foreground">{q.avg_time_spent_seconds}s</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
