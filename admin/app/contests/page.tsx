"use client";

import * as React from "react";
import { Trophy, Plus, ShieldCheck, Calculator, AlertCircle, PlayCircle, CheckCircle2 } from "lucide-react";
import { adminService, ContestAdminItem } from "@/services/adminService";

export default function ContestsAdminPage() {
  const [contests, setContests] = React.useState<ContestAdminItem[]>([]);
  const [showMatrixModal, setShowMatrixModal] = React.useState(false);
  const [showLaunchModal, setShowLaunchModal] = React.useState(false);

  // Matrix Calculator Inputs
  const [calcSeats, setCalcSeats] = React.useState(2500);
  const [calcFee, setCalcFee] = React.useState(49);
  const [calcMargin, setCalcMargin] = React.useState(30);

  // Launch Form State
  const [newTitle, setNewTitle] = React.useState("");
  const [newExam, setNewExam] = React.useState("JEE_MAIN");
  const [newSeats, setNewSeats] = React.useState(2500);
  const [newFee, setNewFee] = React.useState(49);

  React.useEffect(() => {
    setContests(adminService.getContests());
  }, []);

  const matrixResult = adminService.calculatePrizeMatrix(calcSeats, calcFee, calcMargin);

  const handleLaunchContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const calc = adminService.calculatePrizeMatrix(newSeats, newFee, 30);
    const newContestItem: ContestAdminItem = {
      id: `c_${Date.now()}`,
      title: newTitle,
      examCategory: newExam,
      entryFee: newFee,
      maxSeats: newSeats,
      filledSeats: Math.round(newSeats * 0.75), // Initial fill demonstration
      prizePool: calc.prizePool,
      scheduledStart: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      status: "guaranteed_live",
    };

    setContests([newContestItem, ...contests]);
    setNewTitle("");
    setShowLaunchModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span>Contest Engine & Championship Creator</span>
          </h1>
          <p className="text-xs text-muted-foreground">
            Schedule live contests, configure seat thresholds (70% auto-refund rule), and compute mathematically balanced prize pools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMatrixModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-card border border-border/50 hover:bg-card/80 transition-all text-emerald-400"
          >
            <Calculator className="w-4 h-4" />
            <span>Prize Matrix Calculator</span>
          </button>
          <button
            onClick={() => setShowLaunchModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Contest</span>
          </button>
        </div>
      </div>

      {/* Contests List */}
      <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black font-heading">Scheduled & Live Contests Directory</h2>
          <span className="text-xs font-bold text-muted-foreground">Total: {contests.length} Leagues</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map((c) => {
            const fillPercentage = Math.round((c.filledSeats / c.maxSeats) * 100);
            const isGuaranteed = fillPercentage >= 70;

            return (
              <div
                key={c.id}
                className="bg-background/60 border border-border/40 rounded-2xl p-5 space-y-4 relative overflow-hidden group hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-md border border-primary/20">
                      {c.examCategory}
                    </span>
                    <h3 className="text-base font-black font-heading text-foreground pt-1.5 leading-snug">
                      {c.title}
                    </h3>
                  </div>
                  {isGuaranteed ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      🔴 Guaranteed Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                      <AlertCircle className="w-3 h-3" />
                      70% Pending
                    </span>
                  )}
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-3 gap-2 bg-card/50 border border-border/30 rounded-xl p-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground">Entry Fee</span>
                    <span className="font-mono font-bold text-foreground">₹{c.entryFee}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground">Total Capacity</span>
                    <span className="font-mono font-bold text-foreground">{c.maxSeats.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-muted-foreground">Prize Pool</span>
                    <span className="font-mono font-black text-emerald-400">Up To ₹{c.prizePool.toLocaleString()}</span>
                  </div>
                </div>

                {/* Seat Fill Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-foreground">Seats Filled: {c.filledSeats} / {c.maxSeats}</span>
                    <span className={isGuaranteed ? "font-black text-emerald-400" : "font-bold text-amber-400"}>
                      {fillPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isGuaranteed ? "bg-emerald-500" : "bg-amber-500"}`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prize Matrix Calculator Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-xl space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black font-heading flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <span>Prize Distribution Matrix Architect</span>
              </h2>
              <button
                onClick={() => setShowMatrixModal(false)}
                className="text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                ✕ Close
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Seat Capacity</label>
                <input
                  type="number"
                  value={calcSeats}
                  onChange={(e) => setCalcSeats(Number(e.target.value))}
                  className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Entry Fee (₹)</label>
                <input
                  type="number"
                  value={calcFee}
                  onChange={(e) => setCalcFee(Number(e.target.value))}
                  className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Platform Margin (%)</label>
                <input
                  type="number"
                  value={calcMargin}
                  onChange={(e) => setCalcMargin(Number(e.target.value))}
                  className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>
            </div>

            {/* Financial Summary Box */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-emerald-400/80">Total Collection</span>
                <span className="font-mono font-black text-foreground text-sm">₹{matrixResult.totalCollection.toLocaleString()}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-emerald-400/80">Platform Revenue</span>
                <span className="font-mono font-black text-emerald-400 text-sm">₹{matrixResult.platformProfit.toLocaleString()} ({calcMargin}%)</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-emerald-400/80">Up To Prize Pool</span>
                <span className="font-mono font-black text-violet-400 text-sm">₹{matrixResult.prizePool.toLocaleString()}</span>
              </div>
            </div>

            {/* Generated Matrix Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-foreground">Calculated Rank Distribution Table:</span>
              <table className="w-full text-left text-xs border border-border/40 rounded-xl overflow-hidden">
                <thead className="bg-muted/30 text-[10px] uppercase font-bold text-muted-foreground">
                  <tr>
                    <th className="p-2.5">Rank Bracket</th>
                    <th className="p-2.5">Prize / Winner</th>
                    <th className="p-2.5">Winners</th>
                    <th className="p-2.5">Total Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {matrixResult.matrix.map((row) => (
                    <tr key={row.rank} className="hover:bg-muted/20">
                      <td className="p-2.5 font-bold text-foreground">{row.rank}</td>
                      <td className="p-2.5 font-mono text-emerald-400 font-bold">₹{row.prizePerWinner.toLocaleString()}</td>
                      <td className="p-2.5 font-mono">{row.winners}</td>
                      <td className="p-2.5 font-mono font-black text-foreground">₹{row.totalAllocation.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Launch New Contest Modal */}
      {showLaunchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h2 className="text-lg font-black font-heading flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span>Launch New Championship League</span>
            </h2>

            <form onSubmit={handleLaunchContest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Contest Title *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. JEE Main Speed & Accuracy Grand Sprint"
                  required
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Exam Target *</label>
                <select
                  value={newExam}
                  onChange={(e) => setNewExam(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-xs font-bold font-mono outline-none focus:border-primary cursor-pointer"
                >
                  <option value="JEE_MAIN">JEE Main</option>
                  <option value="JEE_ADVANCED">JEE Advanced</option>
                  <option value="NEET_UG">NEET UG</option>
                  <option value="NEET_PG">NEET PG</option>
                  <option value="UPSC_CSE">UPSC CSE</option>
                  <option value="CUET_UG">CUET UG</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Seat Capacity</label>
                  <input
                    type="number"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">Entry Fee (₹)</label>
                  <input
                    type="number"
                    value={newFee}
                    onChange={(e) => setNewFee(Number(e.target.value))}
                    className="w-full bg-background border border-border/50 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-xs flex justify-between font-mono font-bold">
                <span className="text-muted-foreground">Calculated Prize Pool:</span>
                <span className="text-emerald-400">Up To ₹{adminService.calculatePrizeMatrix(newSeats, newFee, 30).prizePool.toLocaleString()}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLaunchModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border/50 text-xs font-bold text-muted-foreground hover:bg-muted/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 shadow-md shadow-primary/25"
                >
                  🚀 Publish Championship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
