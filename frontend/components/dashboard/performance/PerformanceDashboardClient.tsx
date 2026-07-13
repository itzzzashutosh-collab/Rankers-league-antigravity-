"use client";

import React, { useState, useMemo } from "react";
import {
  PerformanceReport,
  PerformanceHeatmap,
  SubjectStatistic,
  ChapterStatistic,
  TopicStatistic,
  DifficultyStatistic,
  TimeStatistic,
  AccuracyStatistic,
  ConsistencyStatistic,
  DashboardSummary
} from "@/services/auth/performanceService";
import HeatmapGrid from "./HeatmapGrid";
import DrillDownPanel from "./DrillDownPanel";
import AIReportCard from "./AIReportCard";
import {
  Award,
  Zap,
  Gauge,
  Filter,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Fallbacks for brand new users to keep UI beautiful and premium
const FALLBACK_SUMMARY: DashboardSummary = {
  user_id: "",
  total_aura: 0,
  global_rank: null,
  current_streak: 0,
  next_tier_progress: 0,
  updated_at: new Date().toISOString()
};

interface PerformanceDashboardClientProps {
  initialData: {
    report: PerformanceReport | null;
    heatmaps: PerformanceHeatmap[];
    subjects: SubjectStatistic[];
    chapters: ChapterStatistic[];
    topics: TopicStatistic[];
    difficulties: DifficultyStatistic[];
    times: TimeStatistic[];
    accuracies: AccuracyStatistic[];
    consistency: ConsistencyStatistic[];
    summary: DashboardSummary | null;
  };
}

export function PerformanceDashboardClient({ initialData }: PerformanceDashboardClientProps) {
  // Filters
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("90"); // "30" | "90" | "all"
  const [selectedExam, setSelectedExam] = useState<string>("All");

  const data = initialData;
  const summary = data.summary || FALLBACK_SUMMARY;

  // List of unique subjects available
  const subjectOptions = useMemo(() => {
    const subs = new Set<string>();
    data.subjects.forEach((s) => {
      if (s.total_contests > 0) subs.add(s.subject);
    });
    return ["All", ...Array.from(subs)];
  }, [data.subjects]);

  // List of unique exams available
  const examOptions = useMemo(() => {
    const exams = new Set<string>();
    data.heatmaps.forEach((h) => {
      // Try to parse exam category if present, or extract from name
      if (h.contest_name.toLowerCase().includes("jee")) exams.add("JEE");
      else if (h.contest_name.toLowerCase().includes("neet")) exams.add("NEET");
      else if (h.contest_name.toLowerCase().includes("bitsat")) exams.add("BITSAT");
    });
    return ["All", ...Array.from(exams)];
  }, [data.heatmaps]);

  // Apply filters to heatmaps & consistency records
  const filteredHeatmaps = useMemo(() => {
    return data.heatmaps.filter((h) => {
      // 1. Subject filter
      if (selectedSubject !== "All" && h.subject.toLowerCase() !== selectedSubject.toLowerCase()) {
        return false;
      }
      // 2. Exam filter
      if (selectedExam !== "All" && !h.contest_name.toLowerCase().includes(selectedExam.toLowerCase())) {
        return false;
      }
      // 3. Period filter
      if (selectedPeriod !== "all") {
        const days = parseInt(selectedPeriod);
        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - days);
        if (new Date(h.contest_date) < limitDate) return false;
      }
      return true;
    });
  }, [data.heatmaps, selectedSubject, selectedExam, selectedPeriod]);

  const filteredConsistency = useMemo(() => {
    if (selectedPeriod === "all") return data.consistency;
    const days = parseInt(selectedPeriod);
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - days);

    return data.consistency.filter((c) => new Date(c.date) >= limitDate);
  }, [data.consistency, selectedPeriod]);

  // Computed overview metrics based on filters
  const computedStats = useMemo(() => {
    if (filteredHeatmaps.length === 0) {
      return {
        accuracy: 0,
        averageTime: 0,
        totalQuestions: 0,
        totalMockExams: 0
      };
    }

    const totalMockExams = filteredHeatmaps.length;
    const totalCorrect = filteredHeatmaps.reduce((sum, h) => sum + h.correct_answers, 0);
    const totalIncorrect = filteredHeatmaps.reduce((sum, h) => sum + h.incorrect_answers, 0);
    const totalQuestions = totalCorrect + totalIncorrect + filteredHeatmaps.reduce((sum, h) => sum + h.skipped, 0);

    const accuracy = totalQuestions > 0 ? (totalCorrect / (totalCorrect + totalIncorrect)) * 100 : 0;
    const averageTime = filteredHeatmaps.reduce((sum, h) => sum + h.average_time_seconds, 0) / totalMockExams;

    return {
      accuracy,
      averageTime,
      totalQuestions,
      totalMockExams
    };
  }, [filteredHeatmaps]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            Competition Intelligence Hub
            <span className="px-2 py-0.5 text-[10px] font-black tracking-widest text-primary-foreground bg-primary rounded-md uppercase">
              AI Analytics
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze your performance parameters, solving speeds, cognitive metrics, and rank growth trajectories.
          </p>
        </div>

        {/* Global rank and aura badges */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 border border-border/30 rounded-2xl bg-card/40 backdrop-blur-md text-right select-none">
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">Global Rank</span>
            <span className="text-sm font-black text-foreground mt-0.5">
              {summary.global_rank ? `#${summary.global_rank}` : "Unranked"}
            </span>
          </div>

          <div className="px-4 py-2 border border-border/30 rounded-2xl bg-primary/10 text-right select-none">
            <span className="text-[10px] text-primary font-black uppercase tracking-wider block">Current Streak</span>
            <span className="text-sm font-black text-foreground mt-0.5 flex items-center justify-end gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
              {summary.current_streak} Days
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="p-4 rounded-2xl border border-border/30 bg-muted/10 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-black uppercase tracking-wider">
            <Filter className="w-4 h-4 text-primary" />
            Filters:
          </div>

          {/* Subject Filter Dropdown/Buttons */}
          <div className="flex items-center gap-1 bg-background/50 border border-border/20 p-1 rounded-xl">
            {subjectOptions.slice(0, 4).map((sub) => (
              <button
                key={sub}
                id={`subject-filter-${sub.toLowerCase()}`}
                onClick={() => setSelectedSubject(sub)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200",
                  selectedSubject === sub
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Exam Filter Dropdown */}
          {examOptions.length > 1 && (
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-muted-foreground">Exam:</span>
              <select
                id="exam-category-select"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="bg-background/80 border border-border/30 rounded-xl px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:border-primary/50"
              >
                {examOptions.map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Period Selector (30 Days, 90 Days, 120 Days) */}
        <div className="flex items-center gap-1.5 p-1 bg-background/50 border border-border/20 rounded-xl self-end md:self-auto">
          {[
            { id: "30", label: "30 Days" },
            { id: "90", label: "90 Days" },
            { id: "all", label: "All Time" }
          ].map((per) => (
            <button
              key={per.id}
              id={`period-filter-${per.id}`}
              onClick={() => setSelectedPeriod(per.id)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200",
                selectedPeriod === per.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {per.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate Widgets Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Widget 1: Accuracy */}
        <div className="p-5 border border-border/40 bg-card/60 backdrop-blur-xl rounded-3xl flex items-center gap-4 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">Average Accuracy</span>
            <h3 id="widget-accuracy" className="text-lg font-black text-foreground mt-0.5">
              {computedStats.accuracy.toFixed(1)}%
            </h3>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">
              Across filtered contests
            </span>
          </div>
        </div>

        {/* Widget 2: Solve Time Pace */}
        <div className="p-5 border border-border/40 bg-card/60 backdrop-blur-xl rounded-3xl flex items-center gap-4 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">Average Pace</span>
            <h3 id="widget-pace" className="text-lg font-black text-foreground mt-0.5">
              {computedStats.averageTime.toFixed(0)}s
            </h3>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">
              Per question average
            </span>
          </div>
        </div>

        {/* Widget 3: Questions Solved */}
        <div className="p-5 border border-border/40 bg-card/60 backdrop-blur-xl rounded-3xl flex items-center gap-4 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">Questions Evaluated</span>
            <h3 id="widget-questions" className="text-lg font-black text-foreground mt-0.5">
              {computedStats.totalQuestions}
            </h3>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">
              Total questions processed
            </span>
          </div>
        </div>

        {/* Widget 4: Total Mock Contests */}
        <div className="p-5 border border-border/40 bg-card/60 backdrop-blur-xl rounded-3xl flex items-center gap-4 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider block">Contest Volume</span>
            <h3 id="widget-volume" className="text-lg font-black text-foreground mt-0.5">
              {computedStats.totalMockExams}
            </h3>
            <span className="text-[9px] text-muted-foreground mt-0.5 block">
              Practices & tournaments
            </span>
          </div>
        </div>
      </div>

      {/* Main Heatmap component */}
      <HeatmapGrid
        heatmaps={filteredHeatmaps}
        consistency={filteredConsistency}
      />

      {/* AI Performance Report Section */}
      <AIReportCard report={data.report} />

      {/* Navigation Folder Explorer Panel (Drilldown) */}
      <DrillDownPanel
        subjects={data.subjects}
        chapters={data.chapters}
        topics={data.topics}
        heatmaps={data.heatmaps}
        times={data.times}
      />
    </div>
  );
}
export default PerformanceDashboardClient;
