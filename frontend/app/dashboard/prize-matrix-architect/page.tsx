"use client";

import React, { useState } from "react";
import { Header } from "@/components/header";
import { Section, Typography, Card, Badge } from "@/components/ui";
import { Calculator, ShieldAlert, Check, Copy, RefreshCw, Layers } from "lucide-react";

interface Bracket {
  rank_start: number;
  rank_end: number;
  prize_amount: number;
  winner_count: number;
  total_allocation: number;
  percentage_of_pool: number;
}

export default function PrizeMatrixArchitectPage() {
  // Input states
  const [seats, setSeats] = useState<number>(5000);
  const [fee, setFee] = useState<number>(99);
  const [margin, setMargin] = useState<number>(25);

  // Status & calculation states
  const [calculated, setCalculated] = useState(false);
  const [approved, setApproved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Financial breakdown outputs
  const [financials, setFinancials] = useState({
    seats: 0,
    entry_fee: 0,
    total_collection: 0,
    margin_percentage: 0,
    platform_profit: 0,
    prize_pool: 0,
    tier: ""
  });

  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [jsonOutput, setJsonOutput] = useState("");

  const calculateMatrix = () => {
    // Basic Ingest & Tier Calculations
    let tier = "Tier 1 (Pro/Micro)";
    if (seats >= 10000) {
      tier = "Tier 3 (Mega)";
    } else if (seats >= 2500) {
      tier = "Tier 2 (Mid-Tier)";
    }

    const total_collection = seats * fee;
    const platform_profit = Math.round(total_collection * (margin / 100));
    const prize_pool = total_collection - platform_profit;
    const total_winners = Math.floor(seats * 0.5);

    let tempBrackets: Bracket[] = [];

    if (seats >= 10000) {
      // Tier 3
      // Rank 1: 7%
      const r1 = Math.round(prize_pool * 0.07);
      tempBrackets.push({
        rank_start: 1,
        rank_end: 1,
        prize_amount: r1,
        winner_count: 1,
        total_allocation: r1,
        percentage_of_pool: 7
      });

      // Rank 2-10: 10% total
      const r2_10_total = Math.round(prize_pool * 0.10);
      const r2_10_per = Math.round(r2_10_total / 9);
      tempBrackets.push({
        rank_start: 2,
        rank_end: 10,
        prize_amount: r2_10_per,
        winner_count: 9,
        total_allocation: r2_10_per * 9,
        percentage_of_pool: 10
      });

      // Bottom 60% of winners: get entry fee back
      const bottom_winners_count = Math.floor(total_winners * 0.60);
      const bottom_start = total_winners - bottom_winners_count + 1;
      tempBrackets.push({
        rank_start: bottom_start,
        rank_end: total_winners,
        prize_amount: fee,
        winner_count: bottom_winners_count,
        total_allocation: fee * bottom_winners_count,
        percentage_of_pool: Math.round(((fee * bottom_winners_count) / prize_pool) * 100)
      });

      // Middle Ranks
      const mid_winners_count = total_winners - 1 - 9 - bottom_winners_count;
      const countA = Math.floor(mid_winners_count * 0.15);
      const countB = Math.floor(mid_winners_count * 0.35);
      const countC = mid_winners_count - countA - countB;

      const prizeA = Math.round(fee * 3.5);
      const prizeB = Math.round(fee * 2);

      const remaining_pool = prize_pool - r1 - (r2_10_per * 9) - (fee * bottom_winners_count);
      const spent_so_far = (prizeA * countA) + (prizeB * countB);
      const residual = remaining_pool - spent_so_far;
      const prizeC = Math.max(fee, Math.round(residual / countC));

      tempBrackets.push({
        rank_start: 11,
        rank_end: 10 + countA,
        prize_amount: prizeA,
        winner_count: countA,
        total_allocation: prizeA * countA,
        percentage_of_pool: Math.round(((prizeA * countA) / prize_pool) * 100)
      });

      tempBrackets.push({
        rank_start: 11 + countA,
        rank_end: 10 + countA + countB,
        prize_amount: prizeB,
        winner_count: countB,
        total_allocation: prizeB * countB,
        percentage_of_pool: Math.round(((prizeB * countB) / prize_pool) * 100)
      });

      // Adjust leftover variance on C
      const current_allocated = tempBrackets.reduce((acc, curr) => acc + curr.total_allocation, 0);
      const left_for_C = prize_pool - current_allocated;
      const final_prize_C = Math.max(fee, Math.round(left_for_C / countC));
      const C_allocated = final_prize_C * countC;
      const difference = left_for_C - C_allocated;

      tempBrackets.push({
        rank_start: 11 + countA + countB,
        rank_end: bottom_start - 1,
        prize_amount: final_prize_C,
        winner_count: countC,
        total_allocation: C_allocated + difference,
        percentage_of_pool: Math.round(((C_allocated + difference) / prize_pool) * 100)
      });

    } else if (seats >= 2500) {
      // Tier 2
      // Rank 1: 11%
      const r1 = Math.round(prize_pool * 0.11);
      tempBrackets.push({
        rank_start: 1,
        rank_end: 1,
        prize_amount: r1,
        winner_count: 1,
        total_allocation: r1,
        percentage_of_pool: 11
      });

      // Rank 2-5: 8% total
      const r2_5_total = Math.round(prize_pool * 0.08);
      const r2_5_per = Math.round(r2_5_total / 4);
      tempBrackets.push({
        rank_start: 2,
        rank_end: 5,
        prize_amount: r2_5_per,
        winner_count: 4,
        total_allocation: r2_5_per * 4,
        percentage_of_pool: 8
      });

      // Bottom 50% of winners: get entry fee back
      const bottom_winners_count = Math.floor(total_winners * 0.50);
      const bottom_start = total_winners - bottom_winners_count + 1;
      tempBrackets.push({
        rank_start: bottom_start,
        rank_end: total_winners,
        prize_amount: fee,
        winner_count: bottom_winners_count,
        total_allocation: fee * bottom_winners_count,
        percentage_of_pool: Math.round(((fee * bottom_winners_count) / prize_pool) * 100)
      });

      // Middle Ranks
      const mid_winners_count = total_winners - 1 - 4 - bottom_winners_count;
      const countA = Math.floor(mid_winners_count * 0.3);
      const countB = mid_winners_count - countA;

      const prizeA = Math.round(fee * 2.5);
      const remaining_pool = prize_pool - r1 - (r2_5_per * 4) - (fee * bottom_winners_count);
      const spent_so_far = (prizeA * countA);
      const residual = remaining_pool - spent_so_far;
      const prizeB = Math.max(fee, Math.round(residual / countB));

      tempBrackets.push({
        rank_start: 6,
        rank_end: 5 + countA,
        prize_amount: prizeA,
        winner_count: countA,
        total_allocation: prizeA * countA,
        percentage_of_pool: Math.round(((prizeA * countA) / prize_pool) * 100)
      });

      const current_allocated = tempBrackets.reduce((acc, curr) => acc + curr.total_allocation, 0);
      const left_for_B = prize_pool - current_allocated;
      const final_prize_B = Math.max(fee, Math.round(left_for_B / countB));
      const B_allocated = final_prize_B * countB;
      const difference = left_for_B - B_allocated;

      tempBrackets.push({
        rank_start: 6 + countA,
        rank_end: bottom_start - 1,
        prize_amount: final_prize_B,
        winner_count: countB,
        total_allocation: B_allocated + difference,
        percentage_of_pool: Math.round(((B_allocated + difference) / prize_pool) * 100)
      });

    } else {
      // Tier 1
      // Rank 1: 18%
      const r1 = Math.round(prize_pool * 0.18);
      tempBrackets.push({
        rank_start: 1,
        rank_end: 1,
        prize_amount: r1,
        winner_count: 1,
        total_allocation: r1,
        percentage_of_pool: 18
      });

      // Rank 2-3: 10% total
      const r2_3_total = Math.round(prize_pool * 0.10);
      const r2_3_per = Math.round(r2_3_total / 2);
      tempBrackets.push({
        rank_start: 2,
        rank_end: 3,
        prize_amount: r2_3_per,
        winner_count: 2,
        total_allocation: r2_3_per * 2,
        percentage_of_pool: 10
      });

      // Bottom 45% of winners: get entry fee back
      const bottom_winners_count = Math.floor(total_winners * 0.45);
      const bottom_start = total_winners - bottom_winners_count + 1;
      tempBrackets.push({
        rank_start: bottom_start,
        rank_end: total_winners,
        prize_amount: fee,
        winner_count: bottom_winners_count,
        total_allocation: fee * bottom_winners_count,
        percentage_of_pool: Math.round(((fee * bottom_winners_count) / prize_pool) * 100)
      });

      // Middle Ranks
      const mid_winners_count = total_winners - 1 - 2 - bottom_winners_count;
      const prize_mid = Math.round(fee * 1.8);

      tempBrackets.push({
        rank_start: 4,
        rank_end: bottom_start - 1,
        prize_amount: prize_mid,
        winner_count: mid_winners_count,
        total_allocation: prize_mid * mid_winners_count,
        percentage_of_pool: Math.round(((prize_mid * mid_winners_count) / prize_pool) * 100)
      });

      // Adjust leftover variance on the middle bracket
      const current_allocated = tempBrackets.reduce((acc, curr) => acc + curr.total_allocation, 0);
      const variance = prize_pool - current_allocated;
      tempBrackets[tempBrackets.length - 1].total_allocation += variance;
      tempBrackets[tempBrackets.length - 1].prize_amount = Math.round(tempBrackets[tempBrackets.length - 1].total_allocation / mid_winners_count);
    }

    tempBrackets.sort((a, b) => a.rank_start - b.rank_start);

    // Update state
    setFinancials({
      seats,
      entry_fee: fee,
      total_collection,
      margin_percentage: margin,
      platform_profit,
      prize_pool,
      tier
    });

    setBrackets(tempBrackets);
    setCalculated(true);
    setApproved(false);
  };

  const approveAndGenerateJson = () => {
    const output = {
      contest_details: {
        seats: financials.seats,
        entry_fee: financials.entry_fee,
        total_collection: financials.total_collection,
        margin_percentage: financials.margin_percentage,
        platform_profit: financials.platform_profit,
        prize_pool: financials.prize_pool
      },
      prize_matrix: brackets.map((b) => ({
        rank_start: b.rank_start,
        rank_end: b.rank_end,
        prize_amount: b.prize_amount,
        winner_count: b.winner_count,
        total_allocation: b.total_allocation
      }))
    };

    setJsonOutput(JSON.stringify(output, null, 2));
    setApproved(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setCalculated(false);
    setApproved(false);
    setBrackets([]);
    setJsonOutput("");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-fade-in text-foreground">
      {/* Header heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Calculator className="w-6 h-6 text-primary" />
            Prize Distribution Architect
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Calculate dynamic, mathematically balanced percentage-based prize allocations for scheduled leagues.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input form */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 rounded-2xl border border-border bg-card/25 backdrop-blur-md space-y-5">
            <Typography variant="h3" className="tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Contest Parameters
            </Typography>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground block">Total Capacity (Seats) *</label>
                <input
                  type="number"
                  min={500}
                  max={500000}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  disabled={calculated}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-50"
                />
                <span className="text-[10px] text-muted-foreground">Accepts values from 500 to 500,000.</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground block">Entry Fee (INR) *</label>
                <input
                  type="number"
                  min={1}
                  value={fee}
                  onChange={(e) => setFee(Number(e.target.value))}
                  disabled={calculated}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-muted-foreground block">Platform Margin (%) *</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value))}
                  disabled={calculated}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary disabled:opacity-50"
                />
              </div>

              {!calculated ? (
                <button
                  onClick={calculateMatrix}
                  className="w-full h-10 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-4 h-4" />
                  Generate Draft Matrix
                </button>
              ) : (
                <button
                  onClick={resetAll}
                  className="w-full h-10 rounded-lg border border-border bg-background hover:bg-card/45 text-foreground font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Adjust Parameters
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Right Output details */}
        <div className="lg:col-span-8 space-y-6">
          {calculated ? (
            <div className="space-y-6">
              {/* Financials Overview */}
              <Card className="p-6 rounded-2xl border border-border bg-card/25 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-4 mb-4">
                  <div>
                    <span className="text-[9px] font-bold text-primary tracking-wider uppercase block">
                      Financials Breakdown
                    </span>
                    <Typography variant="h3" className="tracking-tight">
                      {financials.tier}
                    </Typography>
                  </div>
                  <Badge variant="national" className="uppercase py-0.5 px-3">
                    Active Matrix
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground font-semibold block">Total Collection</span>
                    <span className="text-foreground font-bold text-sm block mt-0.5">
                      {formatCurrency(financials.total_collection)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block">Platform Margin</span>
                    <span className="text-foreground font-bold text-sm block mt-0.5">
                      {financials.margin_percentage}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block">Platform profit</span>
                    <span className="text-emerald-400 font-bold text-sm block mt-0.5">
                      {formatCurrency(financials.platform_profit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-semibold block">Live Prize Pool</span>
                    <span className="text-primary font-bold text-sm block mt-0.5">
                      {formatCurrency(financials.prize_pool)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Draft Matrix Table */}
              <Card className="p-6 rounded-2xl border border-border bg-card/10 overflow-hidden">
                <Typography variant="h3" className="mb-4 tracking-tight">
                  Draft Distribution Matrix
                </Typography>
                <div className="overflow-x-auto border border-border/60 rounded-xl">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border/80 text-[10px] font-bold tracking-wider uppercase text-foreground/80">
                        <th className="p-4">Rank Range</th>
                        <th className="p-4">Prize Per Winner</th>
                        <th className="p-4 text-center">Total Winners</th>
                        <th className="p-4 text-right">Total Bracket Amount</th>
                        <th className="p-4 text-right">% of Pool</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {brackets.map((b, idx) => (
                        <tr key={idx} className="hover:bg-card/10 transition-colors">
                          <td className="p-4 font-bold text-foreground">
                            {b.rank_start === b.rank_end ? `Rank ${b.rank_start}` : `Rank ${b.rank_start} - ${b.rank_end}`}
                          </td>
                          <td className="p-4 font-semibold text-emerald-400">
                            {formatCurrency(b.prize_amount)}
                          </td>
                          <td className="p-4 text-center text-muted-foreground">
                            {b.winner_count.toLocaleString()}
                          </td>
                          <td className="p-4 text-right text-foreground font-bold">
                            {formatCurrency(b.total_allocation)}
                          </td>
                          <td className="p-4 text-right text-muted-foreground/95 font-semibold">
                            {b.percentage_of_pool}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total check validators */}
                <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4 text-[10px] text-muted-foreground font-bold tracking-wider uppercase">
                  <span>Winners: {brackets.reduce((a, b) => a + b.winner_count, 0).toLocaleString()} (50% of seats)</span>
                  <span className="text-primary">Prize Sum: {formatCurrency(brackets.reduce((a, b) => a + b.total_allocation, 0))}</span>
                </div>
              </Card>

              {/* Approval Step */}
              {!approved ? (
                <Card className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-pulse">
                  <div className="space-y-1">
                    <Typography variant="h4" className="text-xs font-bold flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-primary" />
                      Critical Review Required
                    </Typography>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Does this matrix look good, or should I adjust the Rank 1 hook / Retention brackets?
                    </p>
                  </div>
                  <button
                    onClick={approveAndGenerateJson}
                    className="h-10 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs px-6 transition-colors shrink-0"
                  >
                    Approve & Generate JSON
                  </button>
                </Card>
              ) : (
                <Card className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography variant="h4" className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" />
                      Matrix Finalized & Approved
                    </Typography>
                    <button
                      onClick={copyToClipboard}
                      className="h-8 px-3 rounded-lg border border-border bg-background hover:bg-card/45 text-[10px] font-bold text-foreground flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy JSON"}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-border/80 bg-black/60 font-mono text-[10px] text-emerald-400/90 shadow-inner overflow-x-auto max-h-72 leading-relaxed">
                    <pre>{jsonOutput}</pre>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-12 text-center border border-border border-dashed rounded-3xl text-muted-foreground/60 space-y-4">
              <Calculator className="w-12 h-12 text-muted-foreground/20 mx-auto" />
              <div className="space-y-1">
                <span className="text-xs font-bold block">Engine Idle</span>
                <span className="text-[11px] text-muted-foreground/50 block leading-normal max-w-sm mx-auto">
                  Provide the seats capacity, entry fees, and margin percentage on the left panel to execute calculations.
                </span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
