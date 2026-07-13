"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, CheckSquare, Eye, ShieldCheck, XCircle, ArrowLeft } from "lucide-react";
import { questionService, QuestionListItem } from "@/services/questionService";

export default function EditorialReviewQueue() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionListItem | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await questionService.getQuestions();
      const reviewable = all.filter(q => q.status === "In Review" || q.status === "Draft");
      setQuestions(reviewable);
      if (reviewable.length > 0) {
        setSelectedQuestion(reviewable[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleDecision = async (decision: "Approved" | "Rejected") => {
    if (!selectedQuestion) return;
    
    // Simulate updating database
    const success = await questionService.updateQuestion(selectedQuestion.id, {
      ...selectedQuestion,
      status: decision
    });

    if (success) {
      alert(`Question status set to: ${decision}`);
      setQuestions(prev => prev.filter(q => q.id !== selectedQuestion.id));
      setComments("");
      
      const remaining = questions.filter(q => q.id !== selectedQuestion.id);
      if (remaining.length > 0) {
        setSelectedQuestion(remaining[0]);
      } else {
        setSelectedQuestion(null);
      }
    }
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
              <CheckSquare className="w-5 h-5 text-primary" />
              Editorial Review Queue
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Verify accuracy rates, tags consistency, and audit draft items.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
          Loading Review Queue...
        </div>
      ) : questions.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List queue */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">
              Pending Validation Items
            </span>
            <div className="space-y-2">
              {questions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuestion(q)}
                  className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                    selectedQuestion?.id === q.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-card/10 hover:bg-card/25"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-foreground truncate block flex-1">{q.title}</span>
                    <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {q.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate">{q.statement}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Review Details Box */}
          {selectedQuestion && (
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-border bg-card/15 p-6 md:p-8 space-y-6">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">
                    Verify Question Contents
                  </span>
                  <h3 className="font-black text-sm text-foreground mt-1">
                    {selectedQuestion.title}
                  </h3>
                </div>

                <div className="p-4 rounded-2xl border border-border/60 bg-background/30 text-xs font-semibold leading-relaxed">
                  <span className="font-bold text-muted-foreground block mb-2">Statement:</span>
                  <p className="text-foreground">{selectedQuestion.statement}</p>
                </div>

                <div className="space-y-2 text-xs font-semibold">
                  <span className="font-bold text-muted-foreground block">Options Choices:</span>
                  {selectedQuestion.options.map((opt, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-border/80 bg-background/50 flex items-center justify-between">
                      <span>{opt.option_index}. {opt.content}</span>
                      {opt.is_correct && (
                        <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Editorial actions */}
                <div className="space-y-4 pt-4 border-t border-border/20">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-muted-foreground">Reviewer Feedback Notes</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={2}
                      placeholder="Add correction notes or approval reason details..."
                      className="w-full p-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision("Approved")}
                      className="h-9 px-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleDecision("Rejected")}
                      className="h-9 px-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-2">
          <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto" />
          <span className="text-xs font-bold block text-foreground">Review Queue Cleared</span>
          <span className="text-[10px] text-muted-foreground">All draft questions approved or reviewed.</span>
        </div>
      )}
    </div>
  );
}
