"use client";

import Link from "next/link";
import { Trophy, Calendar, Award, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultData {
  id: string;
  contest_slug: string;
  contest_name: string;
  exam_category: string;
  contest_date: string;
  final_rank: number;
  final_score: number;
  aura_earned: number;
  prize_won: number;
}

interface ResultCardProps {
  result: ResultData;
}

export function ResultCard({ result }: ResultCardProps) {
  const formattedDate = new Date(result.contest_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-5 hover:border-primary/20 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Trophy className="w-5 h-5" />
        </div>
        <div>
          <span className="px-2 py-0.5 bg-muted/40 border border-border/55 rounded-full text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            {result.exam_category.replace("_", " ")}
          </span>
          <h4 className="text-sm font-black text-foreground mt-1.5 tracking-tight line-clamp-1">{result.contest_name}</h4>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            Completed on {formattedDate}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t md:border-t-0 pt-4 md:pt-0 border-border/20">
        <div className="text-center md:text-right">
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Rank</p>
          <p className="text-sm font-black text-foreground mt-0.5">#{result.final_rank}</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Score</p>
          <p className="text-sm font-black text-foreground mt-0.5">{result.final_score}</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Aura Points</p>
          <p className="text-sm font-black text-primary mt-0.5">+{result.aura_earned}</p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[9px] text-muted-foreground font-semibold uppercase">Prize Won</p>
          <p className="text-sm font-black text-emerald-500 mt-0.5">
            {result.prize_won > 0 ? `₹${Number(result.prize_won).toLocaleString()}` : "—"}
          </p>
        </div>

        <Link href={`/results/${result.contest_slug}`}>
          <Button variant="outline" className="text-xs font-bold border-border/50 hover:bg-muted/30 rounded-lg h-9 px-4 flex items-center gap-1">
            Result Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default ResultCard;
