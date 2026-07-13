"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, RotateCcw, AlertTriangle, ShieldCheck, ArrowLeft } from "lucide-react";
import { questionService, QuestionListItem } from "@/services/questionService";

export default function RecycleBinTrash() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await questionService.getQuestions(true); // Fetch soft-deleted items
      setQuestions(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleRestore = async (id: string) => {
    const success = await questionService.restoreQuestion(id);
    if (success) {
      alert("Question restored successfully to main bank.");
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handlePermanentDelete = (q: QuestionListItem) => {
    const usage = q.usage?.contests_count || 0;
    if (usage > 0) {
      alert(
        `Security Rule Violate: Cannot permanently delete "${q.title}" as it is currently referenced by ${usage} active contest papers.`
      );
      return;
    }

    setQuestions(prev => prev.filter(item => item.id !== q.id));
    alert(`"${q.title}" permanently purged from knowledge storage schema.`);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/question-bank"
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-destructive" />
              Knowledge Recycle Bin
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Restore soft deleted questions or permanently purge unreferenced items.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
          Loading Recycle Bin...
        </div>
      ) : questions.length > 0 ? (
        <div className="space-y-4">
          {questions.map((q) => {
            const hasUsage = (q.usage?.contests_count || 0) > 0;
            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl border border-border/60 bg-card/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-xs text-foreground">{q.title}</h3>
                  <p className="text-[10px] text-muted-foreground truncate max-w-xl">{q.statement}</p>
                  {hasUsage && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1.5">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      Active Contests Reference Warning
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0 font-bold">
                  <button
                    onClick={() => handleRestore(q.id)}
                    className="h-8 px-3 rounded-lg border border-border hover:bg-muted/40 text-foreground transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restore
                  </button>

                  <button
                    onClick={() => handlePermanentDelete(q)}
                    className={`h-8 px-3 rounded-lg flex items-center gap-1 transition-all ${
                      hasUsage
                        ? "border-border/40 text-muted-foreground cursor-not-allowed opacity-30"
                        : "border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive"
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Purge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-2">
          <Trash2 className="w-12 h-12 text-muted-foreground/20 mx-auto" />
          <span className="text-xs font-bold block text-foreground">Recycle Bin is Empty</span>
          <span className="text-[10px] text-muted-foreground">Soft deleted items will populate here.</span>
        </div>
      )}
    </div>
  );
}
