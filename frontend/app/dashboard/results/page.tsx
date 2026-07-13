"use client";

import * as React from "react";
import { Award, Trophy, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ResultCard from "@/components/dashboard/ResultCard";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import EmptyState from "@/components/dashboard/EmptyState";

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

export default function ResultsPage() {
  const [results, setResults] = React.useState<ResultData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("contest_enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("contest_date", { ascending: false });

      setResults((data || []) as ResultData[]);
      setIsLoading(false);
    };
    load();
  }, []);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Official Contest Results</h1>
        <p className="text-sm text-muted-foreground mt-1">Scorecards, rankings and prize distribution logs.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No results published yet"
          description="Your official scorecards and rankings will appear here once contests are graded."
          actionText="Practice Now"
          actionHref="/contests"
        />
      ) : (
        <div className="space-y-4">
          {results.map((res) => (
            <ResultCard key={res.id} result={res} />
          ))}
        </div>
      )}
    </div>
  );
}
