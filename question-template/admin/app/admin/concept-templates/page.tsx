'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Search, BookOpen, CheckCircle, AlertCircle, TrendingUp, Grid, List } from 'lucide-react';

interface ExamSummary {
  exam_name: string;
  total_concepts: number;
  concepts_with_templates: number;
  total_templates: number;
  coverage_percent: number;
  by_difficulty: { easy: number; medium: number; hard: number; pro: number; legend: number };
}

const CATEGORY_META: Record<string, { icon: string; gradient: string }> = {
  Engineering:          { icon: '⚙️', gradient: 'from-blue-600 to-indigo-600' },
  Medical:              { icon: '🧬', gradient: 'from-rose-600 to-pink-600' },
  Law:                  { icon: '⚖️', gradient: 'from-amber-600 to-orange-600' },
  'Government/Defence':  { icon: '🛡️', gradient: 'from-emerald-600 to-teal-600' },
  Foreign:              { icon: '🌍', gradient: 'from-teal-600 to-cyan-600' },
  General:              { icon: '🎓', gradient: 'from-purple-600 to-fuchsia-600' },
};

export default function ConceptTemplatesDashboard() {
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // Note: The API route is deployed under /api/concept-bank/coverage
    fetch('/api/concept-bank/coverage')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setExams(res.exam_summary || []);
        }
      })
      .catch((err) => console.error('Error fetching coverage stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalExams = exams.length;
  const totalConcepts = exams.reduce((acc, curr) => acc + curr.total_concepts, 0);
  const totalTemplates = exams.reduce((acc, curr) => acc + curr.total_templates, 0);
  const avgCoverage = totalConcepts > 0
    ? (exams.reduce((acc, curr) => acc + curr.concepts_with_templates, 0) / totalConcepts) * 100
    : 0;

  const categories = ['All', ...Object.keys(CATEGORY_META)];

  const filtered = exams.filter((e) => {
    const matchesSearch = e.exam_name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-indigo-400 bg-clip-text text-transparent">
            Concept Template Bank
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Build, seed, and manage reusable blueprints across competitive exams for question generation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg border transition ${viewMode === 'grid' ? 'bg-accent border-accent-foreground/10 text-accent-foreground' : 'bg-background border-border text-muted-foreground'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg border transition ${viewMode === 'list' ? 'bg-accent border-accent-foreground/10 text-accent-foreground' : 'bg-background border-border text-muted-foreground'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/40 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black">{totalExams}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Exams Covered</div>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black">{totalConcepts.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Concepts</div>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black">{totalTemplates.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Blueprints</div>
          </div>
        </div>

        <div className="bg-card border border-border/40 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black">{avgCoverage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Global Coverage</div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card/45 backdrop-blur-md border border-border/40 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            className="w-full bg-background border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Search exam template bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${selectedCategory === cat ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/40 hover:bg-muted text-muted-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Loading Blueprint Dashboards...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border/40 rounded-2xl">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-bold text-lg">No Exam Template Banks Found</h3>
          <p className="text-muted-foreground text-sm">Refine your search parameters or check the database connections.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((exam) => {
            const catKey = Object.keys(CATEGORY_META)[
              Math.abs(exam.exam_name.charCodeAt(0)) % Object.keys(CATEGORY_META).length
            ];
            const meta = CATEGORY_META[catKey];
            return (
              <div
                key={exam.exam_name}
                className="group relative bg-card border border-border/40 hover:border-primary/20 rounded-2xl overflow-hidden transition duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div className={`p-6 bg-gradient-to-br ${meta.gradient} text-white flex justify-between items-start`}>
                  <div>
                    <span className="text-2xl mb-2 block">{meta.icon}</span>
                    <h3 className="font-bold text-lg tracking-tight group-hover:underline">
                      <Link href={`/admin/concept-templates/${encodeURIComponent(exam.exam_name)}`}>
                        {exam.exam_name}
                      </Link>
                    </h3>
                  </div>
                  <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full font-bold">
                    {exam.coverage_percent.toFixed(0)}% Ready
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    <span>{exam.total_concepts} Concepts</span>
                    <span>{exam.total_templates} Blueprints</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${exam.coverage_percent}%` }}
                    />
                  </div>

                  {/* Difficulty Breakdown dots */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Levels Matrix:</span>
                    <div className="flex gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black flex items-center justify-center border border-emerald-500/20" title="Easy">
                        {exam.by_difficulty.easy}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 text-[9px] font-black flex items-center justify-center border border-amber-500/20" title="Medium">
                        {exam.by_difficulty.medium}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 text-[9px] font-black flex items-center justify-center border border-rose-500/20" title="Hard">
                        {exam.by_difficulty.hard}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-500 text-[9px] font-black flex items-center justify-center border border-purple-500/20" title="Pro">
                        {exam.by_difficulty.pro}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-pink-500/10 text-pink-500 text-[9px] font-black flex items-center justify-center border border-pink-500/20" title="Legend">
                        {exam.by_difficulty.legend}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border/40 rounded-2xl overflow-hidden">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
                <th className="p-4">Exam Name</th>
                <th className="p-4">Concepts</th>
                <th className="p-4">Active Templates</th>
                <th className="p-4">Completion Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exam) => (
                <tr key={exam.exam_name} className="border-b border-border/40 hover:bg-muted/20 transition">
                  <td className="p-4 font-bold text-foreground">
                    <Link href={`/admin/concept-templates/${encodeURIComponent(exam.exam_name)}`} className="hover:underline">
                      {exam.exam_name}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{exam.total_concepts}</td>
                  <td className="p-4 text-muted-foreground">{exam.total_templates}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${exam.coverage_percent}%` }} />
                      </div>
                      <span className="text-xs font-bold text-foreground">{exam.coverage_percent.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/concept-templates/${encodeURIComponent(exam.exam_name)}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Configure Blueprint
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
