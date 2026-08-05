"use client";

import * as React from "react";
import Link from "next/link";
import { Share2, Bookmark, Calendar, Award, Clock, Users, ArrowRight, ShieldAlert, Check, Wallet } from "lucide-react";
import { ContestDetail } from "../../types/contests";
import { ContestCountdown } from "./ContestCountdown";
import { ContestBadge } from "./ContestBadge";
import { Card, Typography, Button } from "../ui";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

interface ContestSidebarProps {
  contest: ContestDetail;
  className?: string;
}

export function ContestSidebar({ contest, className }: ContestSidebarProps) {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [registered, setRegistered] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkRegistration = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const dbContestId = contest.id === "upsc-elite" ? "upsc-elite-live" : contest.id === "jee-advanced" ? "jee-advanced-live" : `${contest.id}-live`;
        const { data, error } = await supabase
          .from("contest_registrations")
          .select("id")
          .eq("user_id", user.id)
          .eq("contest_id", dbContestId)
          .maybeSingle();
        if (data && !error) {
          setRegistered(true);
        }
      }
      setLoading(false);
    };
    checkRegistration();
  }, [contest.id]);

  const fillPercent = Math.min(
    100,
    Math.round((contest.participants / contest.maxParticipants) * 100)
  );

  const handleShare = () => {
    setCopied(true);
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("sticky top-24 flex flex-col gap-6", className)}>
      <div className="bg-gradient-to-br from-card/90 via-card/70 to-card/90 backdrop-blur-xl border border-border/40 p-6 sm:p-7 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        {/* Banner highlight */}
        <div className={cn("h-2 bg-gradient-to-r -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-6", contest.bannerGradient)} />

        {/* Dynamic Countdown */}
        {contest.status !== "completed" && (
          <div className="mb-6 bg-destructive/5 border border-destructive/10 rounded-xl p-4 flex flex-col gap-2">
            <span className="text-[10px] font-bold text-destructive/80 uppercase tracking-widest block">
              Registration Window Closes In:
            </span>
            <ContestCountdown targetDate={contest.registrationDeadline} size="lg" className="w-full justify-start" />
          </div>
        )}

        {/* Pricing/Status board */}
        <div className="flex flex-col gap-4 border-b border-border/30 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <Typography variant="body-large" className="text-muted-foreground font-medium">
              Championship Entrance
            </Typography>
            <ContestBadge status={contest.status} />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">
              {contest.entryFee === 0 ? "FREE" : `₹${contest.entryFee}`}
            </span>
            {contest.entryFee > 0 && (
              <span className="text-xs text-muted-foreground font-medium">INR Inclusive of tax</span>
            )}
          </div>
        </div>

        {/* Parameter Details Grid */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary shrink-0" />
            <div>
              <strong className="text-foreground block">{contest.date}</strong>
              <span>Championship Date & Time ({contest.time})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Award className="w-4 h-4 text-primary shrink-0" />
            <div>
              <strong className="text-foreground block">
                {contest.prizePool === 0 ? "Recognition Only" : `₹${contest.prizePool.toLocaleString("en-IN")}`}
              </strong>
              <span>Up To Prize Pool</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Clock className="w-4 h-4 text-primary shrink-0" />
            <div>
              <strong className="text-foreground block">{contest.duration}</strong>
              <span>Calibration Session Duration</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Users className="w-4 h-4 text-primary shrink-0" />
            <div className="w-full">
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-foreground">
                  {contest.participants.toLocaleString("en-IN")} registered
                </span>
                <span className="text-muted-foreground">
                  {contest.seatsAvailable === 0 ? "0 seats remaining" : `${contest.seatsAvailable.toLocaleString("en-IN")} left`}
                </span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <Button
              className="w-full py-6 text-sm font-bold uppercase tracking-wider rounded-xl cursor-not-allowed bg-muted hover:bg-muted text-muted-foreground border border-border/80"
              disabled
            >
              Auditing status...
            </Button>
          ) : registered ? (
            <Link href={`/contests/${contest.slug}/admit-card`} className="w-full">
              <Button
                className="w-full py-6 text-sm font-bold uppercase tracking-wider rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white gap-2"
              >
                View Admit Card
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/contests/${contest.slug}/register`} className="w-full">
              <Button
                className="w-full py-6 text-sm font-bold uppercase tracking-wider rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground gap-2 shadow-lg shadow-primary/10"
              >
                {contest.entryFee > 0 ? `Enroll & Pay ₹${contest.entryFee}` : "Enroll & Register (Free)"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}

          <span className="text-[10px] text-center text-muted-foreground/80 flex items-center justify-center gap-1.5 leading-normal">
            <ShieldAlert className="w-3.5 h-3.5 text-primary" />
            <span>Reservations secure your seat index and proctor credentials instantly.</span>
          </span>
        </div>
      </div>

      {/* Utility Panel */}
      <div className="flex gap-2.5">
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2",
            bookmarked
              ? "bg-primary/10 border-primary/20 text-primary"
              : "bg-card border-border/60 hover:bg-muted text-foreground"
          )}
        >
          <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </button>

        <button
          onClick={handleShare}
          className={cn(
            "flex-1 py-3 px-4 rounded-xl border bg-card border-border/60 hover:bg-muted font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2",
            copied && "bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5"
          )}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Link Copied
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share League
            </>
          )}
        </button>
      </div>
    </div>
  );
}
export default ContestSidebar;
