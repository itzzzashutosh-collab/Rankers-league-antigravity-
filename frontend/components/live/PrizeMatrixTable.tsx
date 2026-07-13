"use client";

import * as React from "react";
import { calculatePrizeMatrix } from "@/utils/backend/services/calculatePrizeMatrix";
import { Card, Typography } from "../ui";
import { ShieldCheck, ChevronDown, ChevronUp, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrizeMatrixTableProps {
  entryFee: number;
  filledSeats: number;
}

export function PrizeMatrixTable({ entryFee, filledSeats }: PrizeMatrixTableProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const matrix = React.useMemo(() => {
    return calculatePrizeMatrix(entryFee, filledSeats);
  }, [entryFee, filledSeats]);

  return (
    <Card variant="glass" className="border border-border/60 bg-card/25 rounded-2xl select-none overflow-hidden">
      
      {/* Expandable trigger header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between gap-4 focus:outline-none hover:bg-muted/10 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-foreground tracking-tight">
              Official Prize Distribution Matrix
            </h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
              Mathematically balanced reward pool distribution sheet (Top 50% placement)
            </p>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Accordion panel section */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-border/20 text-xs animate-in slide-in-from-top-1 duration-200">
          
          {/* General metadata parameters stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-[11px] text-muted-foreground border-b border-border/10 mb-4 text-left">
            <div>
              <span className="block font-bold text-[9px] uppercase tracking-widest text-muted-foreground">
                Total Collection
              </span>
              <strong className="text-foreground font-mono text-sm block mt-1">
                ₹{matrix.totalCollection.toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="block font-bold text-[9px] uppercase tracking-widest text-muted-foreground">
                Platform Admin (30%)
              </span>
              <strong className="text-foreground font-mono text-sm block mt-1">
                ₹{matrix.platformRevenue.toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="block font-bold text-[9px] uppercase tracking-widest text-muted-foreground">
                Prize Pool (70%)
              </span>
              <strong className="text-foreground font-mono text-sm block mt-1">
                ₹{matrix.prizePool.toLocaleString()}
              </strong>
            </div>
            <div>
              <span className="block font-bold text-[9px] uppercase tracking-widest text-muted-foreground">
                Total Winners (50%)
              </span>
              <strong className="text-foreground font-mono text-sm block mt-1">
                {matrix.winnerCount} users
              </strong>
            </div>
          </div>

          {/* Ranks Range table */}
          <div className="overflow-x-auto text-left">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-muted-foreground border-b border-border/15 font-bold uppercase tracking-wider text-[9px]">
                  <th className="py-2.5">Rank range</th>
                  <th className="py-2.5">Prize per candidate</th>
                  <th className="py-2.5 text-center">Total winners</th>
                  <th className="py-2.5 text-right">Sum allocation</th>
                  <th className="py-2.5 text-center">Reward type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10 text-foreground">
                {matrix.distribution.map((dist, idx) => (
                  <tr key={idx} className="hover:bg-muted/15 transition-colors">
                    <td className="py-3 font-extrabold font-mono">
                      Rank {dist.rankStart} {dist.rankEnd > dist.rankStart ? ` - ${dist.rankEnd}` : ""}
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-500">
                      ₹{dist.prizePerUser.toLocaleString()}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {dist.totalWinners}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold">
                      ₹{dist.totalAllocation.toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border",
                        dist.isSafeZone
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                          : "bg-secondary border-border text-muted-foreground"
                      )}>
                        {dist.isSafeZone ? "Prize Zone" : "Fee Refund"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </Card>
  );
}
export default PrizeMatrixTable;
