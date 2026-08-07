"use client";

import * as React from "react";
import { BookOpenCheck, Plus, Layers, CheckCircle2, Search, SlidersHorizontal } from "lucide-react";
import { adminService, ExamCategoryConfig } from "@/services/adminService";

export default function ExamCategoriesPage() {
  const [categories, setCategories] = React.useState<ExamCategoryConfig[]>([]);
  const [search, setSearch] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  // New Category Form State
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [subjects, setSubjects] = React.useState("");

  React.useEffect(() => {
    setCategories(adminService.getExamCategories());
  }, []);

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newCat: ExamCategoryConfig = {
      id: String(Date.now()),
      name,
      code: code.toUpperCase().replace(/\s+/g, "_"),
      targetSubjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
      totalContests: 0,
      status: "active",
    };

    setCategories([newCat, ...categories]);
    setName("");
    setCode("");
    setSubjects("");
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-primary" />
            <span>Exam Category Configuration</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Configure primary competitive examination targets (JEE, NEET, UPSC, CUET, NDA) and subject mappings.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Exam Target</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-card/40 border border-border/40 rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exam category code or name..."
            className="w-full bg-background/50 border border-border/40 rounded-lg pl-10 pr-4 py-2 text-xs font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/40 bg-card text-xs font-bold text-muted-foreground hover:text-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-5 space-y-4 relative overflow-hidden group hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-md border border-primary/20 uppercase">
                  {cat.code}
                </span>
                <h2 className="text-lg font-black font-heading text-foreground pt-1">
                  {cat.name}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            </div>

            {/* Target Subjects */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Configured Subjects
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cat.targetSubjects.map((sub) => (
                  <span
                    key={sub}
                    className="text-xs font-bold bg-secondary/60 border border-border/40 px-2.5 py-1 rounded-lg text-foreground"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs font-bold text-muted-foreground">
              <span className="flex items-center gap-1 text-foreground">
                <Layers className="w-3.5 h-3.5 text-primary" />
                {cat.totalContests} Contests Scheduled
              </span>
              <button className="text-primary hover:underline text-xs">Configure Rules →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Exam Target Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h2 className="text-lg font-black font-heading">Add New Exam Series</h2>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Exam Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. BITSAT Elite League"
                  required
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Exam Code *</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. BITSAT_2026"
                  required
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs font-mono outline-none focus:border-primary uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Subjects (comma separated)</label>
                <input
                  type="text"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  placeholder="Physics, Chemistry, English, Logical Reasoning"
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/50 text-xs font-bold text-muted-foreground hover:bg-muted/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md shadow-primary/25"
                >
                  Create Exam Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
