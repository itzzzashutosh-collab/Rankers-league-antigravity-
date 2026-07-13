"use client";

import * as React from "react";
import { Trophy, CalendarClock, Ban, Radio } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import ContestCard from "@/components/dashboard/ContestCard";
import SkeletonCard from "@/components/dashboard/SkeletonCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { cn } from "@/lib/utils";

type TabType = "upcoming" | "live" | "completed" | "cancelled";

interface ContestEnrollment {
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

export default function MyContestsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>("upcoming");
  const [enrollments, setEnrollments] = React.useState<ContestEnrollment[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("contest_enrollments")
        .select("*")
        .eq("user_id", user.id);

      setEnrollments(data || []);
      setIsLoading(false);
    };
    load();
  }, []);

  const getFilteredEnrollments = () => {
    switch (activeTab) {
      case "upcoming":
        return enrollments.filter(e => e.status === "registered");
      case "live":
        return enrollments.filter(e => e.status === "live");
      case "completed":
        return enrollments.filter(e => e.status === "completed");
      case "cancelled":
        return enrollments.filter(e => e.status === "cancelled");
      default:
        return [];
    }
  };

  const filtered = getFilteredEnrollments();

  const tabs: { key: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "upcoming", label: "Upcoming", icon: CalendarClock },
    { key: "live", label: "Live Now", icon: Radio },
    { key: "completed", label: "Completed", icon: Trophy },
    { key: "cancelled", label: "Cancelled", icon: Ban },
  ];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">My Enrolled Competitions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and track your registered mock leagues.</p>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-border/30 gap-1 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          const count = enrollments.filter(e => {
            if (tab.key === "upcoming") return e.status === "registered";
            return e.status === tab.key;
          }).length;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={cn(
                "ml-1 text-[10px] px-1.5 py-0.5 rounded-md font-mono",
                isActive ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={
            activeTab === "upcoming" ? CalendarClock :
            activeTab === "live" ? Radio :
            activeTab === "completed" ? Trophy : Ban
          }
          title={`No ${activeTab} contests found`}
          description={
            activeTab === "upcoming" ? "You haven't enrolled in any upcoming leagues yet." :
            activeTab === "live" ? "No live contest workspace is open for you at the moment." :
            activeTab === "completed" ? "Completed contests and final scorecard rankings will appear here." :
            "No cancelled contest logs found."
          }
          actionText={activeTab === "upcoming" ? "Browse Contests" : undefined}
          actionHref={activeTab === "upcoming" ? "/contests" : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((enr) => (
            <ContestCard key={enr.id} enrollment={enr} variant={activeTab} />
          ))}
        </div>
      )}
    </div>
  );
}
