"use client";

import * as React from "react";
import { HelpCircle, Plus, FileText, Check, AlertTriangle, ShieldCheck, Sliders } from "lucide-react";

interface QuestionItem {
  id: string;
  exam: string;
  subject: string;
  topic: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  marking: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = React.useState<QuestionItem[]>([
    {
      id: "q1",
      exam: "JEE_MAIN",
      subject: "Physics",
      topic: "Rotational Dynamics",
      questionText: "A solid sphere of mass M and radius R rolls without slipping down an inclined plane of inclination θ. What is its linear acceleration?",
      options: ["(5/7) g sin θ", "(3/5) g sin θ", "(2/3) g sin θ", "(1/2) g sin θ"],
      correctIndex: 0,
      marking: "+4 / -1",
      difficulty: "Medium",
    },
    {
      id: "q2",
      exam: "NEET_UG",
      subject: "Biology",
      topic: "Genetics & Evolution",
      questionText: "Which of the following nitrogenous bases is present in RNA but absent in DNA?",
      options: ["Adenine", "Guanine", "Uracil", "Thymine"],
      correctIndex: 2,
      marking: "+4 / -1",
      difficulty: "Easy",
    },
    {
      id: "q3",
      exam: "UPSC_CSE",
      subject: "General Studies",
      topic: "Indian Polity",
      questionText: "Which Article of the Constitution of India provides for the creation of an All India Services?",
      options: ["Article 310", "Article 312", "Article 315", "Article 320"],
      correctIndex: 1,
      marking: "+2 / -0.66",
      difficulty: "Hard",
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            <span>Question Paper & Exam Engine Settings</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Manage question banks, specify marking schemes (+4/-1), answer keys, and set AI proctoring strictness.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* AI Proctoring & Marking Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Marking Schemes */}
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-black text-sm text-foreground">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Marking Scheme Preset</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/30">
              <span className="font-bold">JEE Main / NEET UG</span>
              <span className="text-emerald-400 font-black">+4 Correct / -1 Wrong</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/30">
              <span className="font-bold">JEE Advanced</span>
              <span className="text-violet-400 font-black">+3 Correct / -1 Partial</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/30">
              <span className="font-bold">UPSC CSE Prelims</span>
              <span className="text-amber-400 font-black">+2 Correct / -0.66 Wrong</span>
            </div>
          </div>
        </div>

        {/* AI Proctoring Settings */}
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-black text-sm text-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Proctoring Strictness</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Calibrated AIR 1 anti-cheat proctoring checks tab switches, camera face-tracking, and dual-screen usage.
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span>🔴 Strict Mode Active (AIR 1 Calibrated)</span>
          </div>
        </div>

        {/* Question Count Stats */}
        <div className="bg-card/40 border border-border/40 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 font-black text-sm text-foreground">
            <FileText className="w-4 h-4 text-violet-400" />
            <span>Question Bank Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-background/50 border border-border/30">
              <span className="block text-[10px] text-muted-foreground font-bold">Total MCQs</span>
              <span className="text-xl font-black text-foreground">4,850</span>
            </div>
            <div className="p-2.5 rounded-xl bg-background/50 border border-border/30">
              <span className="block text-[10px] text-muted-foreground font-bold">Verified Keys</span>
              <span className="text-xl font-black text-emerald-400">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Bank Directory */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-black font-heading">Configured Question Bank</h2>

        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-background/60 border border-border/40 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-md border border-primary/20">
                    {q.exam}
                  </span>
                  <span className="text-xs font-bold text-foreground">
                    {q.subject} • <span className="text-muted-foreground">{q.topic}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Marking: {q.marking}
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {q.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-sm font-bold text-foreground leading-relaxed">
                {q.questionText}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, idx) => {
                  const isCorrect = idx === q.correctIndex;
                  return (
                    <div
                      key={opt}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
                        isCorrect
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                          : "bg-card/40 border-border/30 text-muted-foreground"
                      }`}
                    >
                      <span>{String.fromCharCode(65 + idx)}. {opt}</span>
                      {isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
