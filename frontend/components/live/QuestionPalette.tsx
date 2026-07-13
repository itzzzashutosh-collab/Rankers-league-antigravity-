"use client";

import * as React from "react";
import { ExamSection, ExamQuestion, QuestionStatus } from "../../types/exam";
import { Card } from "../ui";
import { cn } from "@/lib/utils";

interface QuestionPaletteProps {
  sections: ExamSection[];
  questions: ExamQuestion[];
  currentSectionId: string;
  currentQuestionId: string;
  statuses: Record<string, QuestionStatus>;
  onSelectSection: (id: string) => void;
  onSelectQuestion: (id: string) => void;
  className?: string;
}

export function QuestionPalette({
  sections,
  questions,
  currentSectionId,
  currentQuestionId,
  statuses,
  onSelectSection,
  onSelectQuestion,
  className,
}: QuestionPaletteProps) {
  const currentSection = sections.find((s) => s.id === currentSectionId) || sections[0];
  const sectionQuestionIds = currentSection ? currentSection.questionIds : [];

  // Count states globally
  const stats = React.useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let notVisited = 0;

    questions.forEach((q) => {
      const stat = statuses[q.id] || "not_visited";
      if (stat === "answered") answered++;
      else if (stat === "visited") notAnswered++;
      else if (stat === "marked" || stat === "answered_marked") marked++;
      else if (stat === "not_visited") notVisited++;
    });

    return { answered, notAnswered, marked, notVisited };
  }, [questions, statuses]);

  const getStatusColor = (questionId: string) => {
    const isCurrent = questionId === currentQuestionId;
    const stat = statuses[questionId] || "not_visited";

    const baseClasses = "w-9 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center select-none cursor-pointer";

    if (isCurrent) {
      return cn(baseClasses, "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary bg-primary/5 text-primary scale-105");
    }

    switch (stat) {
      case "answered":
        return cn(baseClasses, "bg-emerald-500/10 text-emerald-500 border-emerald-500/25 shadow-sm");
      case "visited":
        return cn(baseClasses, "bg-amber-500/10 text-amber-500 border-amber-500/25");
      case "marked":
      case "answered_marked":
        return cn(baseClasses, "bg-violet-500/10 text-violet-500 border-violet-500/25");
      case "not_visited":
      default:
        return cn(baseClasses, "bg-secondary/45 text-muted-foreground border-border/80 hover:border-border");
    }
  };

  const statLabels = [
    { label: "Answered", count: stats.answered, color: "bg-emerald-500" },
    { label: "Not Answered", count: stats.notAnswered, color: "bg-amber-500" },
    { label: "Marked", count: stats.marked, color: "bg-violet-500" },
    { label: "Not Visited", count: stats.notVisited, color: "bg-muted" },
  ];

  return (
    <Card variant="solid" className={cn("border border-border/40 p-4 rounded-xl text-left bg-card/25 flex flex-col gap-5", className)}>
      
      {/* 1. Subject Section Tab Controls */}
      <div className="flex flex-col gap-1.5 border-b border-border/20 pb-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
          Exam Subjects
        </span>
        <div className="flex flex-wrap gap-1.5 bg-secondary/40 border border-border/45 rounded-lg p-0.5">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={cn(
                "flex-1 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all select-none truncate text-center",
                currentSectionId === sec.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Numeric Question Index grid */}
      <div className="flex-grow min-h-[160px]">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-3">
          Question Palette
        </span>
        <div className="grid grid-cols-5 gap-2.5">
          {sectionQuestionIds.map((qId) => {
            const q = questions.find((item) => item.id === qId);
            if (!q) return null;
            return (
              <button
                key={q.id}
                onClick={() => onSelectQuestion(q.id)}
                className={getStatusColor(q.id)}
                title={`Question ${q.number} Status: ${statuses[q.id] || "not_visited"}`}
              >
                {q.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Global Stats Counters */}
      <div className="grid grid-cols-2 gap-3.5 border-t border-border/20 pt-4 mt-auto">
        {statLabels.map((st) => (
          <div key={st.label} className="flex items-center gap-2 text-xs">
            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", st.color)} />
            <div className="leading-none min-w-0">
              <span className="text-[10px] font-bold text-muted-foreground block truncate">{st.label}</span>
              <strong className="text-foreground font-extrabold text-sm block mt-0.5">{st.count}</strong>
            </div>
          </div>
        ))}
      </div>

    </Card>
  );
}
export default QuestionPalette;
