"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy, Search, Filter, Plus, Calendar, Settings, Archive, 
  Trash2, Play, Pause, Copy, ExternalLink, ChevronRight, Layers, Eye
} from "lucide-react";
import { contestService, ContestListItem } from "@/services/contestService";
import { useInspector } from "@/utils/InspectorContext";

export default function ContestsListPage() {
  const { inspect } = useInspector();
  const [contests, setContests] = useState<ContestListItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await contestService.getContests();
      setContests(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const success = await contestService.updateStatus(id, newStatus);
    if (success) {
      setContests(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      alert(`Contest status updated to ${newStatus}`);
    }
  };

  const handleDuplicate = (c: ContestListItem) => {
    const duplicated = {
      ...c,
      id: `clone-${Date.now()}`,
      name: `${c.name} (Copy)`,
      slug: `${c.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: "Draft"
    };
    setContests(prev => [duplicated, ...prev]);
    alert(`Contest "${c.name}" duplicated as a new Draft.`);
  };

  const handleArchive = (id: string) => {
    setContests(prev => prev.filter(c => c.id !== id));
    alert("Contest archived successfully.");
  };

  const filteredContests = contests.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.exam_name.toLowerCase().includes(search.toLowerCase()) ||
                          c.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || c.category_name === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live": return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "Evaluation": return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
      case "Scheduled": return "text-primary border-primary/20 bg-primary/5";
      case "Registration Open": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "Draft": return "text-muted-foreground border-border/80 bg-muted/10";
      default: return "text-foreground/80 border-border/50 bg-background/40";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Contest Management Studio
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Build, duplicate, schedule, and grade live competition arenas.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/contests/calendar"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            Scheduler Calendar
          </Link>
          <Link
            href="/admin/contests/templates"
            className="h-9 px-4 rounded-xl border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            Templates Blueprints
          </Link>
          <Link
            href="/admin/contests/create"
            className="h-9 px-4 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Arena Contest
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl border border-border bg-card/25 p-5 space-y-4">
            <span className="text-xs font-black text-muted-foreground uppercase tracking-wider block">
              Filters & Search
            </span>

            {/* Search */}
            <div className="relative flex items-center text-xs">
              <Search className="w-3.5 h-3.5 text-muted-foreground/60 absolute left-3" />
              <input
                type="text"
                placeholder="Search name, category, ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background/50 placeholder:text-muted-foreground/60 focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-muted-foreground">Contest Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background/50 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Live">Live</option>
                <option value="Evaluation">Evaluation</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-muted-foreground">Exam Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-border bg-background/50 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Civil Services">Civil Services</option>
                <option value="Engineering">Engineering</option>
                <option value="Medical">Medical</option>
                <option value="Management">Management</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contests List Grid */}
        <div className="lg:col-span-9 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground/60 animate-pulse font-bold tracking-widest uppercase">
              Loading Contests Registry...
            </div>
          ) : filteredContests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredContests.map((c) => (
                <div
                  key={c.id}
                  onClick={() => inspect({
                    type: "contest",
                    title: c.name,
                    subtitle: `${c.category_name} • ${c.exam_name}`,
                    metadata: {
                      id: c.id,
                      slug: c.slug,
                      status: c.status,
                      entry_fee: formatCurrency(c.entry_fee),
                      prize_pool: formatCurrency(c.prize_pool),
                      max_participants: c.max_participants,
                    },
                    timeline: [
                      { label: "Contest created", date: "2026-07-09" },
                      { label: "Status updated to " + c.status, date: "2026-07-10" }
                    ]
                  })}
                  className="rounded-2xl border border-border bg-card/15 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-card/25 transition-all group relative overflow-hidden cursor-pointer"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground/80 font-bold">
                        {c.category_name} • {c.exam_name}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {c.name}
                    </h3>

                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground/80 flex-wrap pt-1 font-semibold">
                      <span>Fee: <strong className="text-foreground">{formatCurrency(c.entry_fee)}</strong></span>
                      <span>Prize Pool: <strong className="text-emerald-400">{formatCurrency(c.prize_pool)}</strong></span>
                      <span>Capacity: <strong className="text-foreground">{c.max_participants.toLocaleString()} seats</strong></span>
                      <span>Date: <strong className="text-foreground">{new Date(c.start_time).toLocaleDateString("en-IN")}</strong></span>
                    </div>
                  </div>

                  {/* Operational Quick Actions */}
                  <div className="flex items-center gap-2 text-xs border-t md:border-t-0 border-border/20 pt-4 md:pt-0 shrink-0">
                    <Link
                      href={`/admin/contests/${c.id}`}
                      className="p-2 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDuplicate(c)}
                      className="p-2 rounded-lg border border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors"
                      title="Duplicate Contest"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {c.status === "Draft" && (
                      <button
                        onClick={() => handleStatusChange(c.id, "Registration Open")}
                        className="h-8 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 font-bold transition-all flex items-center gap-1"
                        title="Publish Live"
                      >
                        <Play className="w-3 h-3" />
                        Open Registration
                      </button>
                    )}

                    {c.status === "Registration Open" && (
                      <button
                        onClick={() => handleStatusChange(c.id, "Draft")}
                        className="h-8 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/25 text-amber-400 font-bold transition-all flex items-center gap-1"
                        title="Pause Registration"
                      >
                        <Pause className="w-3 h-3" />
                        Pause
                      </button>
                    )}

                    <button
                      onClick={() => handleArchive(c.id)}
                      className="p-2 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive transition-colors"
                      title="Archive/Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-border rounded-3xl text-muted-foreground/60 space-y-3">
              <Trophy className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold block text-foreground">No Contests Matches</span>
                <span className="text-[10px] text-muted-foreground block">
                  Verify filters, change keywords or create a new event.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
