"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import {
  X, Trophy, Clock, CheckCircle2, XCircle, Minus,
  Download, ChevronDown, ChevronUp, BarChart3, ArrowRight,
  Medal, Target, Zap, Award
} from "lucide-react";

interface ContestResult {
  id: string;
  contest_slug: string;
  contest_name: string;
  exam_category: string;
  contest_date: string;
  status: string;
  final_rank?: number | null;
  final_score?: number | null;
  aura_earned?: number;
  prize_won?: number;
}

interface QuestionDetail {
  qNo: number;
  topic: string;
  subject: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  yourTime: number; // seconds
  rank1Time: number; // seconds
  marks: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

// Mock question details — replace with real API call per contest
function generateMockQuestions(contestName: string, score: number): QuestionDetail[] {
  const subjects = ["Physics", "Chemistry", "Mathematics"];
  const topics = {
    Physics: ["Kinematics", "Optics", "Electrostatics", "Thermodynamics", "Waves"],
    Chemistry: ["Organic Reactions", "Electrochemistry", "Chemical Bonding", "Coordination", "Equilibrium"],
    Mathematics: ["Calculus", "Trigonometry", "Algebra", "Coordinate Geometry", "Probability"],
  };
  const difficulties: QuestionDetail["difficulty"][] = ["Easy", "Medium", "Hard"];
  const totalQ = 90;
  const correctCount = Math.round((score / 360) * totalQ);

  return Array.from({ length: Math.min(totalQ, 20) }, (_, i) => {
    const subj = subjects[i % 3] as keyof typeof topics;
    const isCorrect = i < correctCount;
    const diffIdx = i % 3;
    const rank1Time = 45 + (diffIdx * 30) + Math.floor(Math.random() * 20);
    return {
      qNo: i + 1,
      topic: topics[subj][i % 5],
      subject: subj,
      yourAnswer: isCorrect ? "A" : (i % 4 === 0 ? "—" : "B"),
      correctAnswer: "A",
      isCorrect,
      yourTime: isCorrect ? rank1Time + Math.floor(Math.random() * 30) : rank1Time + 40,
      rank1Time,
      marks: isCorrect ? 4 : (i % 4 === 0 ? 0 : -1),
      difficulty: difficulties[diffIdx],
    };
  });
}

// ─── Report Card Modal ──────────────────────────────────────────────────────

interface ReportCardModalProps {
  result: ContestResult;
  onClose: () => void;
}

function ReportCardModal({ result, onClose }: ReportCardModalProps) {
  const questions = generateMockQuestions(result.contest_name, result.final_score || 0);
  const correct = questions.filter(q => q.isCorrect).length;
  const wrong = questions.filter(q => !q.isCorrect && q.yourAnswer !== "—").length;
  const skipped = questions.filter(q => q.yourAnswer === "—").length;
  const yourScore = result.final_score || 0;
  const rank1Score = 360;
  const avgScore = Math.round(yourScore * 1.3);

  // Time chart data
  const timeChartData = questions.slice(0, 15).map(q => ({
    name: `Q${q.qNo}`,
    You: q.yourTime,
    "Rank #1": q.rank1Time,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border/60 rounded-3xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border/30 px-6 py-4 flex items-center justify-between rounded-t-3xl">
            <div>
              <h2 className="text-base font-black text-foreground">{result.contest_name}</h2>
              <p className="text-xs text-muted-foreground">
                {new Date(result.contest_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                {result.final_rank && ` · Rank #${result.final_rank}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/50 bg-muted/20 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-muted/30 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Score Summary Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Your Score", value: yourScore, sub: "out of 360", icon: Target, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
                { label: "Rank #1 Score", value: rank1Score, sub: "benchmark", icon: Medal, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
                { label: "Class Average", value: avgScore, sub: "all participants", icon: BarChart3, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
                { label: "Aura Earned", value: `+${result.aura_earned || 0}`, sub: "points", icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className={`p-4 rounded-2xl border ${item.bg} text-center`}>
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                    <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.label}</p>
                    <p className="text-[9px] text-muted-foreground/70">{item.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Answer Summary */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-black text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> {correct} Correct
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-black text-red-400">
                <XCircle className="w-3.5 h-3.5" /> {wrong} Wrong
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/30 border border-border/30 text-xs font-black text-muted-foreground">
                <Minus className="w-3.5 h-3.5" /> {skipped} Skipped
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs font-black text-sky-400">
                <Clock className="w-3.5 h-3.5" /> Accuracy: {questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0}%
              </div>
            </div>

            {/* Time Analysis Chart */}
            <div>
              <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Time Per Question vs Rank #1
              </h3>
              <div className="p-4 rounded-2xl border border-border/30 bg-muted/10">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={timeChartData} barCategoryGap="30%" barGap={4}>
                    <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} unit="s" width={30} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "11px" }}
                    />
                    <Bar dataKey="You" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" fillOpacity={0.85} maxBarSize={18} />
                    <Bar dataKey="Rank #1" radius={[4, 4, 0, 0]} fill="hsl(43 96% 56%)" fillOpacity={0.85} maxBarSize={18} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 mt-2 justify-center">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <div className="w-3 h-3 rounded-sm bg-primary" /> You
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                    <div className="w-3 h-3 rounded-sm bg-amber-400" /> Rank #1
                  </div>
                </div>
              </div>
            </div>

            {/* Question Breakdown Table */}
            <div>
              <h3 className="text-sm font-black text-foreground mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" /> Question-by-Question Breakdown
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-border/30">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/30 bg-muted/20">
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">#</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Topic</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Subject</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Difficulty</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Your Ans</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Correct</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Your Time</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Rank#1 Time</th>
                      <th className="text-left px-4 py-2.5 text-muted-foreground font-black uppercase tracking-wider text-[10px]">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {questions.map((q, i) => (
                      <tr
                        key={i}
                        className={`transition-colors hover:bg-muted/20 ${q.isCorrect ? "bg-emerald-500/3" : q.yourAnswer === "—" ? "" : "bg-red-500/3"}`}
                      >
                        <td className="px-4 py-2.5 font-mono font-bold text-muted-foreground">{q.qNo}</td>
                        <td className="px-4 py-2.5 font-medium text-foreground max-w-[120px] truncate">{q.topic}</td>
                        <td className="px-4 py-2.5">
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            q.subject === "Physics" ? "bg-blue-500/15 text-blue-400" :
                            q.subject === "Chemistry" ? "bg-green-500/15 text-green-400" :
                            "bg-purple-500/15 text-purple-400"
                          }`}>{q.subject.slice(0, 4)}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            q.difficulty === "Easy" ? "bg-emerald-500/15 text-emerald-400" :
                            q.difficulty === "Medium" ? "bg-amber-500/15 text-amber-400" :
                            "bg-red-500/15 text-red-400"
                          }`}>{q.difficulty}</span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-black">
                          <span className={q.isCorrect ? "text-emerald-400" : q.yourAnswer === "—" ? "text-muted-foreground" : "text-red-400"}>
                            {q.yourAnswer}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono font-black text-foreground">{q.correctAnswer}</td>
                        <td className="px-4 py-2.5 font-mono">
                          <span className={q.yourTime > q.rank1Time * 1.5 ? "text-red-400" : q.yourTime > q.rank1Time * 1.2 ? "text-amber-400" : "text-foreground"}>
                            {q.yourTime}s
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-amber-400">{q.rank1Time}s</td>
                        <td className="px-4 py-2.5 font-mono font-black">
                          <span className={q.marks > 0 ? "text-emerald-400" : q.marks < 0 ? "text-red-400" : "text-muted-foreground"}>
                            {q.marks > 0 ? `+${q.marks}` : q.marks}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Improvement Note */}
            <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-black text-primary">AI Improvement Insight</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You spent an average of <strong className="text-foreground">{Math.round(questions.reduce((a, q) => a + q.yourTime, 0) / questions.length)}s</strong> per question, 
                compared to Rank #1's <strong className="text-amber-400">{Math.round(questions.reduce((a, q) => a + q.rank1Time, 0) / questions.length)}s</strong>. 
                Focus on reducing time in <strong className="text-foreground">{questions.filter(q => !q.isCorrect)[0]?.subject || "Chemistry"}</strong> — 
                that's where most of your time loss occurred. Attempt easier difficulty questions first to secure those marks before tackling hard ones.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Contest History List ───────────────────────────────────────────────────

interface ContestHistoryListProps {
  results: ContestResult[];
}

export default function ContestHistoryList({ results }: ContestHistoryListProps) {
  const [openReport, setOpenReport] = React.useState<ContestResult | null>(null);
  const [expanded, setExpanded] = React.useState(false);

  const completed = results.filter(r => r.status === "completed");
  const display = expanded ? completed : completed.slice(0, 5);
  const isEmpty = completed.length === 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground">Contest History</h3>
              <p className="text-[10px] text-muted-foreground">{completed.length} completed contests · Click for full report</p>
            </div>
          </div>
        </div>

        {isEmpty ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-bold text-muted-foreground">No contests completed yet</p>
            <p className="text-xs text-muted-foreground">Your detailed report cards will appear here after you complete contests.</p>
            <a
              href="/contests"
              className="flex items-center gap-1.5 text-xs font-black text-primary hover:underline mt-1"
            >
              Browse Contests <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/30">
                    {["Contest", "Date", "Rank", "Score", "Accuracy", "Prize", "Report"].map(h => (
                      <th key={h} className="text-left pb-2.5 pr-3 text-muted-foreground font-black uppercase tracking-wider text-[10px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {display.map((result, i) => (
                    <motion.tr
                      key={result.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      <td className="py-3 pr-3 font-bold text-foreground max-w-[160px] truncate">
                        {result.contest_name}
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground font-mono">
                        {new Date(result.contest_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                      </td>
                      <td className="py-3 pr-3">
                        {result.final_rank ? (
                          <span className={`font-black ${result.final_rank <= 10 ? "text-amber-400" : result.final_rank <= 100 ? "text-emerald-400" : "text-foreground"}`}>
                            #{result.final_rank}
                          </span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-3 pr-3 font-mono font-black text-foreground">{result.final_score ?? "—"}</td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${result.final_score ? (result.final_score / 360) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground">
                            {result.final_score ? Math.round((result.final_score / 360) * 100) : 0}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pr-3 font-mono font-black">
                        {result.prize_won ? (
                          <span className="text-emerald-400">₹{Number(result.prize_won).toLocaleString("en-IN")}</span>
                        ) : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setOpenReport(result)}
                          className="flex items-center gap-1 text-[10px] font-black text-primary px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <BarChart3 className="w-3 h-3" /> View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {completed.length > 5 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border/30 text-xs font-black text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/10 transition-all"
              >
                {expanded ? (
                  <><ChevronUp className="w-3.5 h-3.5" /> Show Less</>
                ) : (
                  <><ChevronDown className="w-3.5 h-3.5" /> Show All {completed.length} Contests</>
                )}
              </button>
            )}
          </>
        )}
      </motion.div>

      {openReport && (
        <ReportCardModal result={openReport} onClose={() => setOpenReport(null)} />
      )}
    </>
  );
}
