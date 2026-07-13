"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Plus, Search, Filter, Layers, ShieldCheck, 
  Trash2, Copy, Lock, Eye, CheckCircle, HelpCircle, Activity
} from "lucide-react";
import { paperService, PaperListItem } from "@/services/paperService";

export default function PapersListPage() {
  const [papers, setPapers] = useState<PaperListItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await paperService.getPapers();
      setPapers(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await paperService.updateStatus(id, newStatus);
    if (success) {
      setPapers(prev => prev.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
      alert(`Paper status transitioned to: ${newStatus}`);
    }
  };

  const handleDuplicate = (p: PaperListItem) => {
    const duplicated: PaperListItem = {
      ...p,
      id: `clone-${Date.now()}`,
      name: `${p.name} (Copy)`,
      code: `${p.code}-COPY`,
      status: "Draft",
      quality_score: p.quality_score
    };
    setPapers(prev => [duplicated, ...prev]);
    alert(`Paper blueprint copied: "${p.name}" cloned into a new Draft.`);
  };

  const handleArchive = (id: string) => {
    setPapers(prev => prev.filter(p => p.id !== id));
    alert("Paper removed from active registry.");
  };

  const filteredPapers = papers.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.code.toLowerCase().includes(search.toLowerCase()) ||
                          p.exam_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Published": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Locked": return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      case "Approved": return "text-primary border-primary/20 bg-primary/5";
      case "Review": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "Draft": return "text-muted-foreground border-border/80 bg-muted/10";
      default: return "text-foreground/80 border-border/50 bg-background/40";
    }
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Exam Assembly Studio
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Build blueprint maps, allocate questions, verify quality distributions, and lock versions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/papers/templates"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            Blueprints Templates
          </Link>
          <Link
            href="/admin/papers/versions"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Versions Map (A-D)
          </Link>
          <Link
            href="/admin/papers/review"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            Review Queue
          </Link>
          <Link
            href="/admin/papers/create"
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Assemble New Paper
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Filters sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card/25 p-5 space-y-4 text-xs font-semibold">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block">
              Filters & Search
            </span>

            {/* Search */}
            <div className="relative flex items-center text-xs">
              <Search className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
              <input
                type="text"
                placeholder="Search name, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background/50 focus:outline-none"
              />
            </div>

            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-muted-foreground">Paper Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background/50 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Approved">Approved</option>
                <option value="Locked">Locked</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Papers Catalog Grid */}
        <div className="lg:col-span-9 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
              Loading Exam Papers Catalog...
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredPapers.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border bg-card/15 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-card/25 transition-all group relative overflow-hidden"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusBadge(p.status)}`}>
                        {p.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground/80 font-bold">
                        {p.exam_name} • Code: {p.code} • Version {p.version}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {p.name}
                    </h3>

                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 flex-wrap pt-1 font-semibold">
                      <span>Max Marks: <strong className="text-foreground">{p.max_marks}</strong></span>
                      <span>Duration: <strong className="text-foreground">{p.duration_minutes} mins</strong></span>
                      <span>Sections: <strong className="text-foreground">{p.sections_count}</strong></span>
                      <span>Questions: <strong className="text-foreground">{p.questions_count} allocated</strong></span>
                      <span>Quality Score: <strong className="text-emerald-400">{p.quality_score}%</strong></span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 text-xs border-t md:border-t-0 border-border/20 pt-4 md:pt-0 shrink-0">
                    <button
                      onClick={() => handleDuplicate(p)}
                      className="p-2 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                      title="Duplicate Blueprint Template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {p.status === "Approved" && (
                      <button
                        onClick={() => handleStatusChange(p.id, "Locked")}
                        className="h-8 px-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/25 text-cyan-400 font-bold transition-all flex items-center gap-1"
                        title="Lock Paper mapping specs"
                      >
                        <Lock className="w-3 h-3" />
                        Lock Blueprint
                      </button>
                    )}

                    {p.status === "Locked" && (
                      <button
                        onClick={() => handleStatusChange(p.id, "Published")}
                        className="h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 font-bold transition-all flex items-center gap-1"
                        title="Publish Live mapping specs"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Publish Paper
                      </button>
                    )}

                    <button
                      onClick={() => handleArchive(p.id)}
                      className="p-2 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive transition-colors"
                      title="Archive Paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-2">
              <BookOpen className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <span className="text-xs font-bold block text-foreground">No Exam Papers Found</span>
              <span className="text-[10px] text-muted-foreground">Adjust filters or create a new paper template.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
