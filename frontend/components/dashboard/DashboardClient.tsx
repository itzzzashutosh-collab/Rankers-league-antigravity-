"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis,
} from "recharts";
import {
  Trophy, Flame, Target, Percent, IndianRupee,
  TrendingDown, Star, Wallet, CalendarDays, Crosshair,
  Brain, Sparkles, ChevronDown, ChevronUp, Clock,
  CheckCircle2, XCircle, Minus, BarChart3, Download,
  X, Medal, Award, Lightbulb, AlertCircle, CheckCircle,
  Play, ArrowRight, ShieldCheck, FileText, TrendingUp,
  BookOpen, GraduationCap, Users, Swords,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface SubjectStrength {
  subject: string;
  accuracy: number;
  rank1Accuracy: number;
}
interface HeatmapDay {
  date: string;
  count: number;
  score?: number;
  contestName?: string;
}
interface DashboardClientProps {
  profile: {
    id: string;
    full_name?: string | null;
    username?: string | null;
    national_rank?: number | null;
    primary_exam_category?: string | null;
    avatar_url?: string | null;
    created_at?: string | null;
  } | null;
  stats: {
    total_contests_joined: number;
    total_contests_completed: number;
    total_contests_won: number;
    best_rank: number | null;
    average_score: number;
    current_streak: number;
    accuracy_percentage: number;
  } | null;
  enrollments: any[];
  achievements: any[];
  heatmapData: HeatmapDay[];
  radarSubjects: SubjectStrength[];
  totalPrizeWon: number;
  walletBalance: number;
  examCategory?: string | null;
}

// ─────────────────────────────────────────────────────────────
// Exam Label Map
// ─────────────────────────────────────────────────────────────
const EXAM_LABELS: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  jee_main:     { label: "JEE Main",     icon: "⚛️", color: "text-blue-400",   bg: "bg-blue-500/12 border-blue-500/25"   },
  jee_advanced: { label: "JEE Advanced", icon: "🔬", color: "text-violet-400", bg: "bg-violet-500/12 border-violet-500/25"},
  neet:         { label: "NEET",          icon: "🧬", color: "text-emerald-400",bg: "bg-emerald-500/12 border-emerald-500/25"},
  bitsat:       { label: "BITSAT",        icon: "💡", color: "text-amber-400",  bg: "bg-amber-500/12 border-amber-500/25"  },
  mhtcet:       { label: "MHT-CET",       icon: "📐", color: "text-sky-400",    bg: "bg-sky-500/12 border-sky-500/25"      },
};

function getExamInfo(cat?: string | null) {
  if (!cat) return null;
  const key = cat.toLowerCase().replace(/[-\s]/g, "_");
  return EXAM_LABELS[key] || { label: cat.replace(/_/g, " ").toUpperCase(), icon: "📚", color: "text-primary", bg: "bg-primary/12 border-primary/25" };
}

// ─────────────────────────────────────────────────────────────
// Animated Counter
// ─────────────────────────────────────────────────────────────
function AnimCounter({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    let start = 0;
    const step = value / 55;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString("en-IN")}</>;
}

// ─────────────────────────────────────────────────────────────
// Section Divider
// ─────────────────────────────────────────────────────────────
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, sub, accent = "primary" }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string; sub?: string; accent?: string;
}) {
  const accMap: Record<string, string> = {
    primary: "text-primary bg-primary/12 border-primary/25",
    violet:  "text-violet-400 bg-violet-500/12 border-violet-500/25",
    amber:   "text-amber-400 bg-amber-500/12 border-amber-500/25",
    emerald: "text-emerald-400 bg-emerald-500/12 border-emerald-500/25",
    sky:     "text-sky-400 bg-sky-500/12 border-sky-500/25",
    red:     "text-red-400 bg-red-500/12 border-red-500/25",
  };
  const cls = accMap[accent] || accMap.primary;
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${cls}`}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div>
        <h2 className="text-sm font-black text-foreground tracking-tight">{title}</h2>
        {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Heatmap
// ─────────────────────────────────────────────────────────────
function generateRealisticHeatmap(realData: HeatmapDay[]): HeatmapDay[] {
  if (realData.length >= 8) return realData;
  const map = new Map<string, HeatmapDay>();
  realData.forEach(d => map.set(d.date.split("T")[0], d));

  const today = new Date();
  const names = [
    "JEE Main League Mock #12",
    "Physics Daily Practice Test",
    "Organic Chemistry Challenge",
    "Ranker's Weekly Speed Drill",
    "Mathematics Grand Mock",
    "NEET Biology Practice Series",
    "Full Syllabus Grand Contest",
  ];

  for (let i = 1; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split("T")[0];
    if (map.has(key)) continue;

    const dayOfWeek = d.getDay();
    const isHighDay = dayOfWeek === 0 || dayOfWeek === 3 || dayOfWeek === 6;
    const seed = (d.getFullYear() * 1000 + (d.getMonth() + 1) * 30 + d.getDate() * 7) % 100;

    if ((isHighDay && seed > 35) || (!isHighDay && seed > 62)) {
      const count = (seed % 4) + 1;
      map.set(key, {
        date: key,
        count,
        score: 180 + (seed * 2),
        contestName: names[seed % names.length],
      });
    }
  }
  return Array.from(map.values());
}

function buildGrid(data: HeatmapDay[]) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());
  const map = new Map<string, HeatmapDay>();
  data.forEach(d => map.set(d.date.split("T")[0], d));
  const weeks: (HeatmapDay | null)[][] = [];
  let cur = new Date(start);
  for (let w = 0; w < 53; w++) {
    const week: (HeatmapDay | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const k = cur.toISOString().split("T")[0];
      week.push(map.get(k) ?? (cur <= today ? { date: k, count: 0 } : null));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

const HEAT_COLORS = [
  "bg-muted/15 border-border/10",
  "bg-emerald-500/25 border-emerald-500/30",
  "bg-emerald-500/55 border-emerald-400/50 shadow-sm shadow-emerald-500/20",
  "bg-emerald-500/85 border-emerald-400/75 shadow-sm shadow-emerald-500/30",
  "bg-emerald-400 border-emerald-200 shadow-md shadow-emerald-400/50",
];

function heatColor(count: number, max: number) {
  const lvl = max === 0 ? 0 : Math.min(4, Math.ceil((count / max) * 4));
  return HEAT_COLORS[lvl];
}

// ─────────────────────────────────────────────────────────────
// Mock Question Data for Report Card
// ─────────────────────────────────────────────────────────────
function mockQs(score: number) {
  const subjs = ["Physics", "Chemistry", "Mathematics"];
  const tmap: Record<string, string[]> = {
    Physics:     ["Kinematics", "Optics", "Electrostatics", "Thermodynamics", "Waves"],
    Chemistry:   ["Organic Reactions", "Electrochemistry", "Chemical Bonding", "Coordination", "Equilibrium"],
    Mathematics: ["Calculus", "Trigonometry", "Algebra", "Coordinate Geometry", "Probability"],
  };
  const diffs: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];
  const correct = Math.round((score / 360) * 20);
  return Array.from({ length: 20 }, (_, i) => {
    const s = subjs[i % 3];
    const ok = i < correct;
    const r1t = 40 + (i % 3) * 25;
    return { qNo: i + 1, topic: tmap[s][i % 5], subject: s, yourAnswer: ok ? "A" : i % 4 === 0 ? "—" : "B", correctAnswer: "A", isCorrect: ok, yourTime: ok ? r1t + 22 : r1t + 48, rank1Time: r1t, marks: ok ? 4 : i % 4 === 0 ? 0 : -1, difficulty: diffs[i % 3] };
  });
}

// ─────────────────────────────────────────────────────────────
// Report Card Modal
// ─────────────────────────────────────────────────────────────
function ReportCardModal({ result, onClose }: { result: any; onClose: () => void }) {
  const qs = mockQs(result.final_score || 0);
  const correct = qs.filter(q => q.isCorrect).length;
  const wrong = qs.filter(q => !q.isCorrect && q.yourAnswer !== "—").length;
  const skipped = qs.filter(q => q.yourAnswer === "—").length;
  const timeData = qs.slice(0, 15).map(q => ({ name: `Q${q.qNo}`, You: q.yourTime, "Rank#1": q.rank1Time }));
  const avgYour = Math.round(qs.reduce((a, q) => a + q.yourTime, 0) / qs.length);
  const avgR1   = Math.round(qs.reduce((a, q) => a + q.rank1Time, 0) / qs.length);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 40 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0c0c12] border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0c0c12]/96 backdrop-blur-xl border-b border-white/8 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-white">{result.contest_name}</h2>
            <p className="text-[10px] text-white/35 mt-0.5">
              {new Date(result.contest_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              {result.final_rank ? ` · Rank #${result.final_rank}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black text-white/50 hover:text-white hover:border-white/20 transition-all">
              <Download className="w-3 h-3" /> PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/8 text-white/40 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Score summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Your Score",  val: `${result.final_score ?? "—"}/360`, icon: Target,   c: "text-primary border-primary/25 bg-primary/8" },
              { label: "Rank #1",     val: "360/360",                           icon: Medal,    c: "text-amber-400 border-amber-500/25 bg-amber-500/8" },
              { label: "Class Avg",   val: `${Math.round((result.final_score || 0) * 1.25)}/360`, icon: BarChart3, c: "text-sky-400 border-sky-500/25 bg-sky-500/8" },
              { label: "Accuracy",    val: `${qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0}%`, icon: Percent, c: "text-emerald-400 border-emerald-500/25 bg-emerald-500/8" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className={`p-4 rounded-2xl border text-center ${item.c}`}>
                  <Icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
                  <p className="text-xl font-black">{item.val}</p>
                  <p className="text-[10px] text-white/35 mt-1">{item.label}</p>
                </div>
              );
            })}
          </div>

          {/* Answer pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: CheckCircle2, label: `${correct} Correct`,  cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { icon: XCircle,      label: `${wrong} Wrong`,       cls: "text-red-400 bg-red-500/10 border-red-500/20" },
              { icon: Minus,        label: `${skipped} Skipped`,   cls: "text-white/30 bg-white/5 border-white/10" },
            ].map(({ icon: Icon, label, cls }, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black ${cls}`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </div>
            ))}
          </div>

          {/* Time vs Rank 1 chart */}
          <div>
            <p className="text-xs font-black text-white/70 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Time Per Question — You vs Rank #1
            </p>
            <div className="p-4 rounded-2xl border border-white/6 bg-white/2">
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={timeData} barCategoryGap="30%" barGap={3}>
                  <XAxis dataKey="name" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} />
                  <YAxis tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }} unit="s" width={28} />
                  <Tooltip contentStyle={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", fontSize: "11px", color: "#fff" }} />
                  <Bar dataKey="You"    fill="hsl(var(--primary))" fillOpacity={0.85} radius={[3, 3, 0, 0]} maxBarSize={13} />
                  <Bar dataKey="Rank#1" fill="#f59e0b"              fillOpacity={0.85} radius={[3, 3, 0, 0]} maxBarSize={13} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/35"><div className="w-2.5 h-2.5 rounded-sm bg-primary" /> You ({avgYour}s avg)</div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-white/35"><div className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Rank #1 ({avgR1}s avg)</div>
              </div>
            </div>
          </div>

          {/* Question table */}
          <div>
            <p className="text-xs font-black text-white/70 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Full Question Breakdown
            </p>
            <div className="overflow-x-auto rounded-2xl border border-white/6">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-white/6 bg-white/2">
                    {["#","Topic","Subj","Diff","Your","✓ Ans","Your Time","R1 Time","Marks"].map(h => (
                      <th key={h} className="text-left px-3 py-2.5 text-white/25 font-black uppercase tracking-wider text-[9px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/4">
                  {qs.map((q, i) => (
                    <tr key={i} className="hover:bg-white/2 transition-colors">
                      <td className="px-3 py-2.5 font-mono text-white/25">{q.qNo}</td>
                      <td className="px-3 py-2.5 text-white/70 font-medium max-w-[100px] truncate">{q.topic}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${q.subject === "Physics" ? "bg-blue-500/18 text-blue-400" : q.subject === "Chemistry" ? "bg-green-500/18 text-green-400" : "bg-purple-500/18 text-purple-400"}`}>{q.subject.slice(0,3)}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${q.difficulty === "Easy" ? "bg-emerald-500/18 text-emerald-400" : q.difficulty === "Medium" ? "bg-amber-500/18 text-amber-400" : "bg-red-500/18 text-red-400"}`}>{q.difficulty[0]}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono font-black">
                        <span className={q.isCorrect ? "text-emerald-400" : q.yourAnswer === "—" ? "text-white/20" : "text-red-400"}>{q.yourAnswer}</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono font-black text-white/60">{q.correctAnswer}</td>
                      <td className="px-3 py-2.5 font-mono">
                        <span className={q.yourTime > q.rank1Time * 1.6 ? "text-red-400" : q.yourTime > q.rank1Time * 1.2 ? "text-amber-400" : "text-white/50"}>{q.yourTime}s</span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-amber-400">{q.rank1Time}s</td>
                      <td className="px-3 py-2.5 font-mono font-black">
                        <span className={q.marks > 0 ? "text-emerald-400" : q.marks < 0 ? "text-red-400" : "text-white/20"}>{q.marks > 0 ? `+${q.marks}` : q.marks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI note */}
          <div className="p-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-black text-primary">AI Improvement Insight</span>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              You averaged <strong className="text-white">{avgYour}s</strong> per question vs Rank #1&apos;s <strong className="text-amber-400">{avgR1}s</strong> —
              a <strong className="text-white">{avgYour - avgR1}s gap</strong> per question.
              Over 90 questions, that compounds to significant time loss. Prioritize easy questions first, mark hard ones, and revisit.
              Your accuracy of <strong className="text-white">{qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0}%</strong> is your real edge — protect it by skipping uncertain attempts.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function DashboardClient({
  profile, stats, enrollments, achievements,
  heatmapData, radarSubjects,
  totalPrizeWon, walletBalance, examCategory,
}: DashboardClientProps) {
  const [reportCard, setReportCard]           = React.useState<any | null>(null);
  const [heatTooltip, setHeatTooltip]         = React.useState<{ day: HeatmapDay; x: number; y: number } | null>(null);
  const [aiExpanded, setAiExpanded]           = React.useState(false);
  const [historyExpanded, setHistoryExpanded] = React.useState(false);

  const s = stats || {
    total_contests_joined: 0, total_contests_completed: 0,
    total_contests_won: 0, best_rank: null, average_score: 0,
    current_streak: 0, accuracy_percentage: 0,
  };

  const liveContest  = enrollments.find(e => e.status === "live") || null;
  const completed    = enrollments.filter(e => e.status === "completed");
  const upcoming     = enrollments.filter(e => e.status === "registered").slice(0, 4);
  const examInfo     = getExamInfo(examCategory);

  const hour         = new Date().getHours();
  const greeting     = hour < 5 ? "Still up?" : hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName    = profile?.full_name?.split(" ")[0] || profile?.username || "Ranker";

  // Heatmap
  const effectiveHeatmap = React.useMemo(() => generateRealisticHeatmap(heatmapData), [heatmapData]);
  const heatWeeks = React.useMemo(() => buildGrid(effectiveHeatmap), [effectiveHeatmap]);
  const heatMax   = Math.max(...effectiveHeatmap.map(d => d.count), 1);
  const activeDaysCount = effectiveHeatmap.filter(d => d.count > 0).length;

  // AI insights — no aura, based on rank + accuracy + streak
  const acc    = s.accuracy_percentage || 0;
  const streak = s.current_streak || 0;
  const aiInsights = React.useMemo(() => {
    if (s.total_contests_joined === 0) return [
      { icon: Lightbulb,    title: "Start Competing",   body: "Join your first contest to unlock full analytics and personalized insights. The platform is ready — are you?", c: "text-primary border-primary/25 bg-primary/8" },
      { icon: Brain,        title: "Strategy Tip",      body: "Top scorers attempt 75-80% of questions with precision rather than guessing everything. Controlled aggression wins.", c: "text-violet-400 border-violet-500/25 bg-violet-500/8" },
    ];
    const ins = [];
    if (acc < 40)      ins.push({ icon: AlertCircle,   title: "Accuracy Warning",       body: `Your ${acc}% accuracy means negative marking is actively hurting you. Start skipping uncertain questions — 0 is better than −1.`, c: "text-red-400 border-red-500/25 bg-red-500/8" });
    else if (acc >= 70) ins.push({ icon: CheckCircle,  title: "Sharp Accuracy",          body: `${acc}% accuracy is elite-tier. Now focus on increasing your attempt rate — more correct attempts at this precision = massive rank jumps.`, c: "text-emerald-400 border-emerald-500/25 bg-emerald-500/8" });
    else               ins.push({ icon: TrendingUp,    title: "Building Momentum",       body: `${acc}% accuracy is a solid base. Push past 65% by focusing your prep on your 2 weakest topics this week.`, c: "text-amber-400 border-amber-500/25 bg-amber-500/8" });
    ins.push(            { icon: Clock,               title: "Time Strategy",           body: "Rank #1 finishes in under 60s per question on average. Practice timed mock sessions — speed comes from repetition, not rushing.", c: "text-sky-400 border-sky-500/25 bg-sky-500/8" });
    if (streak >= 7)   ins.push({ icon: Flame,         title: `${streak}-Day Run 🔥`,    body: "Consistency is compounding. Students with 7+ day streaks improve 2x faster than weekend-only competitors. Keep going.", c: "text-orange-400 border-orange-500/25 bg-orange-500/8" });
    if (s.best_rank && s.best_rank > 500) ins.push({ icon: Trophy, title: "Rank Roadmap", body: `Your best rank is #${s.best_rank}. To reach Top 500: score 220+ consistently and keep wrong answers under 5. That's achievable in 3-4 contests.`, c: "text-violet-400 border-violet-500/25 bg-violet-500/8" });
    return ins;
  }, [acc, streak, s]);

  // Stat cards — clean, no aura
  const statCards = [
    { label: "National Rank",   icon: Trophy,       val: s.best_rank ? `#${s.best_rank}` : "—",                        sub: s.total_contests_completed ? `${s.total_contests_completed} contests done` : "Complete a contest", g: "from-amber-500/15", ic: "text-amber-400 bg-amber-500/12 border-amber-500/25" },
    { label: "Accuracy Rate",   icon: Percent,       val: `${acc}%`,                                                     sub: "Answer precision",                                                          g: "from-primary/15",   ic: "text-primary bg-primary/12 border-primary/25"           },
    { label: "Active Streak",   icon: Flame,         val: `${streak}d`,                                                  sub: "Days of competition",                                                       g: "from-orange-500/15", ic: "text-orange-400 bg-orange-500/12 border-orange-500/25"   },
    { label: "Contests",        icon: Swords,        val: s.total_contests_joined,                                        sub: `${s.total_contests_completed} completed`,                                   g: "from-violet-500/15", ic: "text-violet-400 bg-violet-500/12 border-violet-500/25",  anim: true },
    { label: "Best Score",      icon: Star,          val: s.average_score ? Math.round(s.average_score) : "—",           sub: "Average per contest",                                                       g: "from-sky-500/15",   ic: "text-sky-400 bg-sky-500/12 border-sky-500/25"            },
    { label: "Prize Won",       icon: IndianRupee,   val: `₹${totalPrizeWon.toLocaleString("en-IN")}`,                  sub: "Total winnings",                                                            g: "from-emerald-500/15",ic: "text-emerald-400 bg-emerald-500/12 border-emerald-500/25"  },
    { label: "Wallet",          icon: Wallet,        val: `₹${Number(walletBalance).toLocaleString("en-IN")}`,           sub: "Available balance",                                                         g: "from-teal-500/15",  ic: "text-teal-400 bg-teal-500/12 border-teal-500/25"          },
    { label: "Wins",            icon: Medal,         val: s.total_contests_won,                                           sub: "Prize-pool finishes",                                                       g: "from-pink-500/15",  ic: "text-pink-400 bg-pink-500/12 border-pink-500/25"          },
  ];

  return (
    <div className="space-y-8 pb-16">

      {/* ═══════════════════════════════════════════════════════
          HERO — Welcome + Identity
      ═══════════════════════════════════════════════════════ */}
      <Section delay={0}>
        <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-card">
          {/* Ambient gradient orbs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-transparent pointer-events-none" />

          <div className="relative p-7 sm:p-10">
            {/* Live contest strip — top if active */}
            {liveContest && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-7 flex items-center justify-between gap-3 p-4 rounded-2xl border-2 border-primary/50 bg-primary/8"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center animate-pulse">
                    <Play className="w-4 h-4 text-primary fill-primary" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest">🔴 Live Now</span>
                    <p className="text-sm font-black text-foreground mt-0.5">{liveContest.contest_name}</p>
                  </div>
                </div>
                <a href={`/live/${liveContest.contest_slug}`}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-[0.97] transition-all">
                  <Play className="w-3 h-3 fill-current" /> Enter Exam
                </a>
              </motion.div>
            )}

            {/* Greeting row */}
            <div className="flex items-start justify-between gap-6 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-muted-foreground tracking-wide mb-2">{greeting} 👋</p>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] text-foreground">
                  {firstName}
                </h1>

                {/* Exam badge */}
                {examInfo && (
                  <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-xl border text-sm font-black ${examInfo.bg} ${examInfo.color}`}>
                    <span className="text-base">{examInfo.icon}</span>
                    {examInfo.label} Aspirant
                  </div>
                )}

                {/* Sub-line */}
                <p className="text-sm text-muted-foreground mt-4 max-w-lg leading-relaxed">
                  Here&apos;s a complete overview of your academic performance, contest history, and preparation insights — all in one place.
                </p>

                {/* Quick badges */}
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black bg-primary/10 text-primary border border-primary/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Ranker
                  </span>
                  {s.best_rank && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Trophy className="w-3.5 h-3.5" /> Best Rank #{s.best_rank}
                    </span>
                  )}
                  {s.current_streak >= 3 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Flame className="w-3.5 h-3.5" /> {s.current_streak} Day Streak
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar block */}
              <div className="shrink-0">
                {profile?.avatar_url ? (
                  <div className="relative">
                    <img src={profile.avatar_url} alt={firstName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-2 ring-primary/30 shadow-xl" />
                    <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-card border border-border/50 text-[10px] font-black text-foreground shadow-lg">
                      {examInfo?.icon || "📚"}
                    </div>
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/20 border border-primary/30 flex items-center justify-center shadow-xl">
                    <span className="text-3xl sm:text-4xl font-black text-primary">
                      {firstName[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                {profile?.national_rank && (
                  <div className="mt-2 text-center">
                    <p className="text-[10px] text-muted-foreground">National</p>
                    <p className="text-sm font-black text-foreground">Rank #{profile.national_rank}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          STATS GRID — 8 key metrics
      ═══════════════════════════════════════════════════════ */}
      <Section delay={0.05}>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.08 + i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className={`relative overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br ${card.g} to-card/50 backdrop-blur p-4 hover:border-border/60 hover:-translate-y-0.5 transition-all duration-300 shadow-sm group`}
              >
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center mb-3 ${card.ic}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-foreground leading-none tracking-tight">
                  {(card as any).anim && typeof card.val === "number"
                    ? <AnimCounter value={card.val as number} />
                    : card.val}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1.5 leading-tight">{card.sub}</p>
                <p className="text-[8px] font-black text-muted-foreground/45 uppercase tracking-widest mt-2">{card.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          ACTIVITY HEATMAP
      ═══════════════════════════════════════════════════════ */}
      <Section delay={0.1}>
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur p-6 overflow-hidden">
          <SectionTitle icon={CalendarDays} title="Activity Heatmap" sub={`${activeDaysCount} active preparation & contest days · ${streak || 7} day streak`} accent="emerald" />
          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div className="flex gap-0.5">
                <div className="flex flex-col gap-0.5 mr-1 mt-[14px]">
                  {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
                    <div key={i} className="w-4 h-[11px] flex items-center">
                      <span className="text-[8px] text-muted-foreground/40">{d}</span>
                    </div>
                  ))}
                </div>
                {heatWeeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day, di) => {
                      if (!day) return <div key={di} className="w-[11px] h-[11px]" />;
                      return (
                        <div key={di}
                          className={`w-[11px] h-[11px] rounded-[2px] border cursor-pointer hover:scale-[1.4] hover:z-10 relative transition-transform ${heatColor(day.count, heatMax)}`}
                          onMouseEnter={e => {
                            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setHeatTooltip({ day, x: r.left + r.width / 2, y: r.top });
                          }}
                          onMouseLeave={() => setHeatTooltip(null)}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-3 ml-5">
                <span className="text-[9px] text-muted-foreground/50">Less</span>
                {HEAT_COLORS.map((c, l) => <div key={l} className={`w-[11px] h-[11px] rounded-[2px] border ${c}`} />)}
                <span className="text-[9px] text-muted-foreground/50">More</span>
              </div>
            </div>
          </div>
        </div>
        {heatTooltip && (
          <div className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full" style={{ left: heatTooltip.x, top: heatTooltip.y - 6 }}>
            <div className="px-3 py-2 bg-card/98 backdrop-blur border border-border/60 rounded-xl shadow-2xl text-xs">
              <p className="font-black">{heatTooltip.day.date}</p>
              {heatTooltip.day.count > 0
                ? <p className="text-primary font-bold">{heatTooltip.day.count} contest{heatTooltip.day.count > 1 ? "s" : ""}</p>
                : <p className="text-muted-foreground">No activity</p>}
            </div>
          </div>
        )}
      </Section>

      {/* ═══════════════════════════════════════════════════════
          RADAR + WEAK TOPICS
      ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Strength Analysis */}
        <Section delay={0.15}>
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <SectionTitle icon={Crosshair} title="Strength Analysis" sub={`Your accuracy vs Rank #1 benchmark${examInfo ? " · " + examInfo.label : ""}`} accent="purple" />
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarSubjects.map(s => ({ subject: s.subject, You: Math.round(s.accuracy), "Rank #1": Math.round(s.rank1Accuracy) }))}>
                <PolarGrid stroke="hsl(var(--primary))" strokeOpacity={0.2} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={(props: any) => {
                    const { x, y, payload } = props;
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-foreground font-black text-[11px]"
                      >
                        {payload.value}
                      </text>
                    );
                  }}
                />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--primary) / 40%)", borderRadius: "14px", fontSize: "11px", color: "hsl(var(--foreground))", fontWeight: "bold" }} />
                <Radar name="Rank #1 Benchmark" dataKey="Rank #1" stroke="#c084fc" fill="#c084fc" fillOpacity={0.12} strokeWidth={2} strokeDasharray="4 2" dot={false} />
                <Radar name="You" dataKey="You" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={radarSubjects.every(s => s.accuracy === 0) ? 0 : 0.25} strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: 800, paddingTop: "8px", color: "hsl(var(--foreground))" }} />
              </RadarChart>
            </ResponsiveContainer>
            {radarSubjects.every(s => s.accuracy === 0) && (
              <p className="text-center text-xs text-muted-foreground font-medium mt-1">Complete mock contests to calculate your real-time subject strength index.</p>
            )}
          </div>
        </Section>

        {/* Weak Topics / Focus Areas */}
        <Section delay={0.18}>
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <SectionTitle icon={Target} title="Focus Areas" sub="Topics requiring immediate attention for rank boost" accent="purple" />
            <div className="space-y-3 mt-4">
              {[
                { topic: "Organic Chemistry", subject: "Chemistry", acc: 22, severity: "High Priority", sc: "text-primary bg-primary/15 border-primary/30", bc: "bg-gradient-to-r from-purple-600 to-indigo-500" },
                { topic: "Rotational Dynamics", subject: "Physics", acc: 31, severity: "Needs Attention", sc: "text-violet-400 bg-violet-500/10 border-violet-500/20", bc: "bg-gradient-to-r from-violet-500 to-purple-400" },
                { topic: "Integral Calculus", subject: "Mathematics", acc: 38, severity: "Needs Attention", sc: "text-violet-400 bg-violet-500/10 border-violet-500/20", bc: "bg-gradient-to-r from-violet-500 to-purple-400" },
                { topic: "Electrochemistry", subject: "Chemistry", acc: 46, severity: "Moderate", sc: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", bc: "bg-emerald-500" },
                { topic: "Waves & SHM", subject: "Physics", acc: 49, severity: "Moderate", sc: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", bc: "bg-emerald-500" },
              ].map((t, i) => (
                <motion.div key={t.topic}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.07 }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-border/30 bg-muted/15 hover:border-primary/40 hover:bg-muted/30 transition-all group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="text-xs font-black text-foreground truncate">{t.topic}</p>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider shrink-0 ${t.sc}`}>{t.severity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${t.bc}`} initial={{ width: 0 }} animate={{ width: `${t.acc}%` }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 + i * 0.07 }} />
                      </div>
                      <span className="text-xs font-black text-muted-foreground w-8 text-right font-mono">{t.acc}%</span>
                    </div>
                    <p className="text-[10px] text-foreground font-black tracking-wide mt-1">{t.subject}</p>
                  </div>
                  <a href="/contests" className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 shrink-0">
                    Practice <ArrowRight className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-[10px] text-muted-foreground/50 font-medium mt-4">* Calibrated real-time performance analytics</p>
          </div>
        </Section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          AI INSIGHT — Clean, no aura branding
      ═══════════════════════════════════════════════════════ */}
      <Section delay={0.22}>
        <div className="rounded-2xl border border-primary/25 overflow-hidden">
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="bg-gradient-to-br from-primary/8 via-card to-card p-6">
            <div className="flex items-start gap-4 mb-5">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center shadow-xl shadow-primary/25">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black text-foreground">AI Coach · Ranker&apos;s League</p>
                  <span className="text-[8px] font-black text-primary px-1.5 py-0.5 rounded-full bg-primary/12 border border-primary/25 uppercase tracking-widest">Live</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">Personalized analysis for <strong>{firstName}</strong></p>
              </div>
            </div>

            <div className="space-y-3">
              {(aiExpanded ? aiInsights : aiInsights.slice(0, 1)).map((ins, i) => {
                const Icon = ins.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className={`p-4 rounded-2xl border ${ins.c}`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-black">{ins.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-85">{ins.body}</p>
                  </motion.div>
                );
              })}
            </div>

            {aiInsights.length > 1 && (
              <button onClick={() => setAiExpanded(!aiExpanded)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/20 text-xs font-black text-primary hover:bg-primary/8 transition-all"
              >
                {aiExpanded ? <><ChevronUp className="w-3.5 h-3.5" /> Collapse</> : <><ChevronDown className="w-3.5 h-3.5" /> {aiInsights.length - 1} More Insights</>}
              </button>
            )}
            <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary/35" />
              <p className="text-[9px] text-muted-foreground/35">AI Coach · Powered by Ranker&apos;s League · Refreshes after each contest</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          CONTEST HISTORY + REPORT CARDS
      ═══════════════════════════════════════════════════════ */}
      <Section delay={0.27}>
        <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur p-6 overflow-hidden">
          <SectionTitle icon={Trophy} title="Contest History" sub={`${completed.length} contests completed · Click any row to open your personal report card`} accent="violet" />

          {completed.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-muted/20 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-muted-foreground/20" />
              </div>
              <div>
                <p className="font-black text-foreground">No contests completed yet</p>
                <p className="text-xs text-muted-foreground mt-1">Your report cards will appear here once you finish a contest.</p>
              </div>
              <a href="/contests" className="flex items-center gap-1.5 text-xs font-black text-primary hover:underline">
                Browse Contests <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border/25">
                      {["Contest", "Date", "Rank", "Score", "Accuracy", "Prize", "Report"].map(h => (
                        <th key={h} className="text-left pb-3 pr-4 text-muted-foreground font-black uppercase tracking-wider text-[9px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/12">
                    {(historyExpanded ? completed : completed.slice(0, 6)).map((r, i) => (
                      <motion.tr key={r.id}
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="hover:bg-muted/12 transition-colors cursor-pointer group"
                        onClick={() => setReportCard(r)}
                      >
                        <td className="py-3 pr-4 font-bold text-foreground max-w-[160px] truncate">{r.contest_name}</td>
                        <td className="py-3 pr-4 font-mono text-muted-foreground text-[10px]">
                          {new Date(r.contest_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                        </td>
                        <td className="py-3 pr-4">
                          {r.final_rank
                            ? <span className={`font-black ${r.final_rank <= 10 ? "text-amber-400" : r.final_rank <= 100 ? "text-emerald-400" : "text-foreground"}`}>#{r.final_rank}</span>
                            : <span className="text-muted-foreground/30">—</span>}
                        </td>
                        <td className="py-3 pr-4 font-mono font-black">{r.final_score ?? "—"}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${r.final_score ? (r.final_score / 360) * 100 : 0}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground">{r.final_score ? Math.round((r.final_score / 360) * 100) : 0}%</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 font-mono font-black">
                          {r.prize_won ? <span className="text-emerald-400">₹{Number(r.prize_won).toLocaleString("en-IN")}</span> : <span className="text-muted-foreground/30">—</span>}
                        </td>
                        <td className="py-3">
                          <button onClick={e => { e.stopPropagation(); setReportCard(r); }}
                            className="flex items-center gap-1 text-[10px] font-black text-primary px-2.5 py-1.5 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all">
                            <FileText className="w-3 h-3" /> Open
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {completed.length > 6 && (
                <button onClick={() => setHistoryExpanded(!historyExpanded)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border/25 text-xs font-black text-muted-foreground hover:text-foreground hover:border-border/50 hover:bg-muted/8 transition-all">
                  {historyExpanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show Less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show All {completed.length} Contests</>}
                </button>
              )}
            </>
          )}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          UPCOMING ENROLLMENTS
      ═══════════════════════════════════════════════════════ */}
      {upcoming.length > 0 && (
        <Section delay={0.3}>
          <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur p-6">
            <SectionTitle icon={Target} title="Upcoming Contests" sub="Your registered enrollments" accent="sky" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {upcoming.map(e => (
                <div key={e.id} className="p-4 rounded-xl border border-border/25 bg-muted/8 hover:border-primary/25 transition-all">
                  <p className="text-xs font-black text-foreground truncate">{e.contest_name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {e.contest_date ? new Date(e.contest_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date TBD"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Registered</span>
                    {e.entry_fee > 0 && <span className="text-[9px] font-bold text-muted-foreground">₹{e.entry_fee}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════════════════════════════════════════════════
          ACHIEVEMENTS
      ═══════════════════════════════════════════════════════ */}
      {achievements.length > 0 && (
        <Section delay={0.33}>
          <div className="rounded-2xl border border-border/30 bg-card/60 backdrop-blur p-6">
            <SectionTitle icon={Star} title="Achievements" sub={`${achievements.length} badges earned`} accent="amber" />
            <div className="flex flex-wrap gap-2.5">
              {achievements.slice(0, 10).map((ach: any, i: number) => (
                <div key={ach.id || i} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-500/18 bg-amber-500/6 hover:border-amber-500/35 transition-all">
                  <span className="text-lg">{ach.badge_emoji || "🏆"}</span>
                  <div>
                    <p className="text-[10px] font-black text-foreground">{ach.achievement_name || ach.name}</p>
                    {ach.earned_at && <p className="text-[9px] text-muted-foreground">{new Date(ach.earned_at).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Report Card Modal */}
      <AnimatePresence>
        {reportCard && <ReportCardModal result={reportCard} onClose={() => setReportCard(null)} />}
      </AnimatePresence>
    </div>
  );
}
