"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SubjectStatistic,
  ChapterStatistic,
  TopicStatistic,
  PerformanceHeatmap,
  TimeStatistic
} from "@/services/auth/performanceService";
import { ChevronRight, Folder, FileText, ChevronLeft, Calendar, Clock, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrillDownPanelProps {
  subjects: SubjectStatistic[];
  chapters: ChapterStatistic[];
  topics: TopicStatistic[];
  heatmaps: PerformanceHeatmap[];
  times: TimeStatistic[];
}

interface SelectionState {
  subject: string | null;
  chapter: string | null;
  topic: string | null;
}

export function DrillDownPanel({
  subjects,
  chapters,
  topics,
  heatmaps,
  times
}: DrillDownPanelProps) {
  const [sel, setSel] = useState<SelectionState>({
    subject: null,
    chapter: null,
    topic: null
  });

  // Filter lists based on selections
  const activeChapters = sel.subject
    ? chapters.filter((c) => c.subject.toLowerCase() === sel.subject?.toLowerCase())
    : [];

  const activeTopics = sel.subject && sel.chapter
    ? topics.filter(
        (t) =>
          t.subject.toLowerCase() === sel.subject?.toLowerCase() &&
          t.chapter.toLowerCase() === sel.chapter?.toLowerCase()
      )
    : [];

  const activeHeatmaps = sel.subject && sel.chapter && sel.topic
    ? heatmaps.filter(
        (h) =>
          h.subject.toLowerCase() === sel.subject?.toLowerCase() &&
          h.chapter.toLowerCase() === sel.chapter?.toLowerCase() &&
          h.topic.toLowerCase() === sel.topic?.toLowerCase()
      )
    : [];

  // Reset helpers
  const handleSubjectSelect = (sub: string) => {
    setSel({ subject: sub, chapter: null, topic: null });
  };

  const handleChapterSelect = (ch: string) => {
    setSel((prev) => ({ ...prev, chapter: ch, topic: null }));
  };

  const handleTopicSelect = (tp: string) => {
    setSel((prev) => ({ ...prev, topic: tp }));
  };

  const goBack = () => {
    if (sel.topic) {
      setSel((prev) => ({ ...prev, topic: null }));
    } else if (sel.chapter) {
      setSel((prev) => ({ ...prev, chapter: null }));
    } else if (sel.subject) {
      setSel((prev) => ({ ...prev, subject: null }));
    }
  };

  const getPaceColor = (pace: string) => {
    if (pace === "fast") return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    if (pace === "normal") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (pace === "slow") return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  const getDifficultyColor = (diff: string) => {
    if (diff === "easy") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (diff === "medium") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (diff === "hard") return "text-violet-400 bg-violet-500/10 border-violet-500/20";
    return "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20";
  };

  // Breadcrumbs rendering
  const renderBreadcrumbs = () => {
    return (
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground bg-muted/20 px-4 py-2.5 rounded-2xl border border-border/20 mb-4 select-none">
        <span
          onClick={() => setSel({ subject: null, chapter: null, topic: null })}
          className={cn(
            "hover:text-foreground cursor-pointer transition-colors font-bold",
            !sel.subject && "text-foreground font-black pointer-events-none"
          )}
        >
          All Subjects
        </span>

        {sel.subject && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span
              onClick={() => setSel({ subject: sel.subject, chapter: null, topic: null })}
              className={cn(
                "hover:text-foreground cursor-pointer transition-colors font-bold",
                !sel.chapter && "text-foreground font-black pointer-events-none"
              )}
            >
              {sel.subject}
            </span>
          </>
        )}

        {sel.chapter && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span
              onClick={() => setSel({ subject: sel.subject, chapter: sel.chapter, topic: null })}
              className={cn(
                "hover:text-foreground cursor-pointer transition-colors font-bold",
                !sel.topic && "text-foreground font-black pointer-events-none"
              )}
            >
              {sel.chapter}
            </span>
          </>
        )}

        {sel.topic && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-black pointer-events-none">{sel.topic}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-black tracking-tight text-foreground">
            Topic Drill-down Analytics
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Double-click or click rows to drill down from Subject to Chapter, Topic, and Contest instances.
          </p>
        </div>

        {sel.subject && (
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border/30 hover:border-border rounded-xl text-xs font-bold bg-muted/10 hover:bg-muted/30 transition-all select-none"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}
      </div>

      {renderBreadcrumbs()}

      <div className="relative overflow-hidden min-h-[300px]">
        <AnimatePresence mode="wait">
          {/* 1. SUBJECTS LIST */}
          {!sel.subject && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {subjects.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => handleSubjectSelect(sub.subject)}
                  className="flex items-center justify-between p-4 border border-border/30 rounded-2xl bg-muted/5 hover:bg-muted/15 hover:border-border/60 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <Folder className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-foreground">{sub.subject}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sub.total_contests} Contests Joined
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {sub.total_contests > 0 ? (
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground font-semibold">Avg Score / Accuracy</div>
                        <div className="text-sm font-black text-foreground mt-0.5">
                          {Number(sub.average_score).toFixed(1)} /{" "}
                          <span className="text-primary">{Number(sub.accuracy_rate).toFixed(1)}%</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic hidden sm:block">No mock sessions</span>
                    )}

                    {sub.total_contests > 0 && (
                      <div className="w-24 bg-muted/40 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${sub.accuracy_rate}%` }}
                        />
                      </div>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* 2. CHAPTERS LIST */}
          {sel.subject && !sel.chapter && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {activeChapters.length === 0 ? (
                <div className="py-12 border border-dashed border-border/30 rounded-2xl text-center text-xs text-muted-foreground select-none">
                  No chapters or statistics available for {sel.subject} yet.
                </div>
              ) : (
                activeChapters.map((ch) => {
                  const timeRecord = times.find(
                    (t) =>
                      t.subject.toLowerCase() === sel.subject?.toLowerCase() &&
                      t.chapter.toLowerCase() === ch.chapter.toLowerCase()
                  );
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleChapterSelect(ch.chapter)}
                      className="flex items-center justify-between p-4 border border-border/30 rounded-2xl bg-muted/5 hover:bg-muted/15 hover:border-border/60 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
                          <Folder className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-foreground">{ch.chapter}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {ch.total_questions} Questions Solved
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {timeRecord && (
                          <div className={cn(
                            "px-2.5 py-0.5 border rounded-lg text-[10px] font-black uppercase tracking-wider hidden md:block",
                            getPaceColor(timeRecord.pace)
                          )}>
                            {timeRecord.pace} Solve Speed
                          </div>
                        )}

                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-muted-foreground font-semibold">Accuracy</div>
                          <div className="text-sm font-black text-foreground mt-0.5">
                            {ch.correct_questions}/{ch.total_questions} (
                            <span className="text-primary">{Number(ch.accuracy_rate).toFixed(1)}%</span>)
                          </div>
                        </div>

                        <div className="w-24 bg-muted/40 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${ch.accuracy_rate}%` }}
                          />
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* 3. TOPICS LIST */}
          {sel.subject && sel.chapter && !sel.topic && (
            <motion.div
              key="topics"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {activeTopics.length === 0 ? (
                <div className="py-12 border border-dashed border-border/30 rounded-2xl text-center text-xs text-muted-foreground select-none">
                  No topic metrics available for {sel.chapter} yet.
                </div>
              ) : (
                activeTopics.map((tp) => (
                  <div
                    key={tp.id}
                    onClick={() => handleTopicSelect(tp.topic)}
                    className="flex items-center justify-between p-4 border border-border/30 rounded-2xl bg-muted/5 hover:bg-muted/15 hover:border-border/60 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-foreground">{tp.topic}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tp.total_questions} Questions Solved
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground font-semibold">Accuracy</div>
                        <div className="text-sm font-black text-foreground mt-0.5">
                          {tp.correct_questions}/{tp.total_questions} (
                          <span className="text-primary">{Number(tp.accuracy_rate).toFixed(1)}%</span>)
                        </div>
                      </div>

                      <div className="w-24 bg-muted/40 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${tp.accuracy_rate}%` }}
                        />
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* 4. CONTEST INSTANCE DETAILS */}
          {sel.subject && sel.chapter && sel.topic && (
            <motion.div
              key="instances"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {activeHeatmaps.length === 0 ? (
                <div className="py-12 border border-dashed border-border/30 rounded-2xl text-center text-xs text-muted-foreground select-none">
                  No individual mock sessions recorded on this topic yet.
                </div>
              ) : (
                activeHeatmaps.map((h) => (
                  <div
                    key={h.id}
                    className="p-5 border border-border/30 rounded-2xl bg-muted/5 relative overflow-hidden"
                  >
                    {/* Glow according to accuracy */}
                    <div className={cn(
                      "absolute top-0 left-0 w-1.5 h-full",
                      h.accuracy >= 80 ? "bg-emerald-500" :
                      h.accuracy >= 60 ? "bg-amber-500" : "bg-red-500"
                    )} />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Name / Date */}
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <h4 className="text-sm font-black text-foreground">{h.contest_name}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(h.contest_date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {h.average_time_seconds}s avg solve speed
                          </span>
                          {h.rank && (
                            <span className="flex items-center gap-1 text-primary/95 font-bold">
                              <Trophy className="w-3.5 h-3.5 text-primary" />
                              Rank {h.rank}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-primary/95 font-bold">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            +{h.aura_earned} Aura
                          </span>
                        </div>
                      </div>

                      {/* Score / Accuracy / Status */}
                      <div className="flex items-center gap-4 self-start md:self-auto">
                        <div className={cn(
                          "px-2.5 py-0.5 border rounded-lg text-[10px] font-black uppercase tracking-wider capitalize",
                          getDifficultyColor(h.difficulty)
                        )}>
                          {h.difficulty} Difficulty
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-muted-foreground font-semibold">Performance</div>
                          <div className="text-sm font-black text-foreground mt-0.5">
                            Score: {Number(h.score).toFixed(1)} (
                            <span className={cn(
                              "font-black",
                              h.accuracy >= 80 ? "text-emerald-400" :
                              h.accuracy >= 60 ? "text-amber-400" : "text-red-400"
                            )}>
                              {Number(h.accuracy).toFixed(0)}% Acc
                            </span>
                            )
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini metrics bar */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/20 text-center text-xs">
                      <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Correct</span>
                        <span className="font-black text-emerald-400 text-sm">{h.correct_answers}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-500/5 border border-rose-500/10">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Incorrect</span>
                        <span className="font-black text-rose-400 text-sm">{h.incorrect_answers}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-muted/30 border border-border/20">
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Skipped</span>
                        <span className="font-black text-foreground text-sm">{h.skipped}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default DrillDownPanel;
