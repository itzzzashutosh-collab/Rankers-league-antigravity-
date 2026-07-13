"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckSquare, ShieldCheck, XCircle, ArrowLeft, BookOpen } from "lucide-react";
import { paperService, PaperListItem } from "@/services/paperService";

export default function PaperReviewQueue() {
  const router = useRouter();
  const [papers, setPapers] = useState<PaperListItem[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperListItem | null>(null);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const all = await paperService.getPapers();
      const reviewable = all.filter(p => p.status === "Review" || p.status === "Draft");
      setPapers(reviewable);
      if (reviewable.length > 0) {
        setSelectedPaper(reviewable[0]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleDecision = async (decision: "Approved" | "Rejected") => {
    if (!selectedPaper) return;

    const success = await paperService.updateStatus(selectedPaper.id, decision);
    if (success) {
      alert(`Paper set to status: ${decision}`);
      setPapers(prev => prev.filter(p => p.id !== selectedPaper.id));
      setComments("");
      const remaining = papers.filter(p => p.id !== selectedPaper.id);
      if (remaining.length > 0) {
        setSelectedPaper(remaining[0]);
      } else {
        setSelectedPaper(null);
      }
    }
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
              <CheckSquare className="w-5 h-5 text-primary" />
              Paper Editorial Review
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Audit quality score compliance, section limits and questions exposure.
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
          Loading Review Queue...
        </div>
      ) : papers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Queue Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">
              Pending Validation Papers
            </span>
            <div className="space-y-2 text-xs font-semibold">
              {papers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPaper(p)}
                  className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                    selectedPaper?.id === p.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border bg-card/10 hover:bg-card/25"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground truncate block flex-1">{p.name}</span>
                    <span className="text-[8px] font-black uppercase text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                      {p.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block">{p.exam_name} • Code: {p.code}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details & Actions Panel */}
          {selectedPaper && (
            <div className="lg:col-span-8 space-y-6">
              <div className="rounded-3xl border border-border bg-card/15 p-6 md:p-8 space-y-6 text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-wider block">
                    Verify Specifications & Allocations
                  </span>
                  <h3 className="font-black text-sm text-foreground mt-1">
                    {selectedPaper.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-border/40 rounded-xl p-4 bg-background/20 font-semibold leading-relaxed">
                  <div>Exam target: <strong className="text-foreground">{selectedPaper.exam_name}</strong></div>
                  <div>Paper Code: <strong className="text-foreground">{selectedPaper.code}</strong></div>
                  <div>Duration: <strong className="text-foreground">{selectedPaper.duration_minutes} minutes</strong></div>
                  <div>Quality compliance index: <strong className="text-emerald-400">{selectedPaper.quality_score}% Match</strong></div>
                </div>

                {/* Review actions */}
                <div className="space-y-4 pt-4 border-t border-border/20">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-muted-foreground">Verification Comments</label>
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      rows={2}
                      placeholder="Add compliance notes or unlock warnings..."
                      className="w-full p-3 rounded-xl border border-border bg-background/50 focus:outline-none"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision("Approved")}
                      className="h-9 px-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Approve Paper
                    </button>
                    <button
                      onClick={() => handleDecision("Rejected")}
                      className="h-9 px-4 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Paper
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
          <span className="text-[10px] text-muted-foreground">All papers reviewed successfully.</span>
        </div>
      )}
    </div>
  );
}
