"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Award, Clock, Users, ArrowRight, Share2, Bookmark, Globe, Languages, Check } from "lucide-react";
import { Contest } from "../../types/contests";
import { ContestBadge } from "./ContestBadge";
import { ContestCountdown } from "./ContestCountdown";
import { Card, Typography, Button } from "../ui";
import { cn } from "@/lib/utils";

interface ContestCardProps {
  contest: Contest;
  className?: string;
}

export function ContestCard({ contest, className }: ContestCardProps) {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const fillPercent = Math.min(
    100,
    Math.round((contest.participants / contest.maxParticipants) * 100)
  );

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCopied(true);
    // Copy mockup URL to clipboard
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}/contests/${contest.slug}` : "";
    navigator.clipboard.writeText(fullUrl).catch(() => {});
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card
      variant="glass"
      hoverEffect="lift-glow"
      padding="none"
      className={cn("flex flex-col h-full border border-border/40 relative group", className)}
    >
      {/* Premium Banner Gradient with noise texture overlay */}
      <div className={cn("h-36 relative overflow-hidden bg-gradient-to-r", contest.bannerGradient)}>
        <div className="absolute inset-0 bg-noise opacity-20" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Badges row inside banner */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 items-start">
            <div className="flex items-center gap-1.5">
              {contest.level && (
                <span className="text-[9px] font-black text-amber-400 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/30 uppercase tracking-wider">
                  LEVEL {contest.level}
                </span>
              )}
              {contest.tagline && (
                <span className="text-[9px] font-black text-foreground bg-primary/20 backdrop-blur-md px-2 py-0.5 rounded border border-primary/30 uppercase tracking-wider">
                  {contest.tagline}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold text-foreground bg-background/80 backdrop-blur-md px-2 py-0.5 rounded border border-border/40 uppercase tracking-widest">
              {contest.exam}
            </span>
          </div>

          <div className="flex gap-1.5 items-center pointer-events-auto">
            <button
              onClick={handleBookmark}
              className={cn(
                "p-1.5 rounded-full backdrop-blur-md transition-all border",
                bookmarked
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-background/40 hover:bg-background/80 text-foreground border-border/40"
              )}
              title="Bookmark Contest"
            >
              <Bookmark className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className={cn(
                "p-1.5 rounded-full backdrop-blur-md transition-all border bg-background/40 hover:bg-background/80 text-foreground border-border/40",
                copied && "border-emerald-500/50 text-emerald-500 bg-emerald-500/5"
              )}
              title="Copy Contest Link"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Mini parameter columns */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4 pb-4 border-b border-border/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">{contest.date}</span>
              <span className="text-[10px]">{contest.time}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <div>
              <span className="block font-bold text-foreground">
                {contest.maxParticipants ? contest.maxParticipants.toLocaleString("en-IN") : "10,000"} Seats
              </span>
              <span className="text-[10px] text-muted-foreground">Total Capacity</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">{contest.duration}</span>
              <span className="text-[10px]">Championship Duration</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
            <div>
              <span className="block font-semibold text-foreground">{contest.country}</span>
              <span className="text-[10px] flex items-center gap-1">
                <Languages className="w-3 h-3 text-muted-foreground/80" /> {contest.language}
              </span>
            </div>
          </div>
        </div>

        {/* Seat occupancy bar with total capacity */}
        <div className="mb-5 bg-muted/20 p-2.5 rounded-xl border border-border/30">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5 font-bold">
            <span className="flex items-center gap-1.5 text-foreground">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{contest.participants.toLocaleString("en-IN")} Registered</span>
            </span>
            <span className="text-emerald-400 font-extrabold">
              {contest.seatsAvailable === 0 ? "Full Capacity" : `${contest.seatsAvailable.toLocaleString("en-IN")} Seats Left`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted/60 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                fillPercent >= 90
                  ? "bg-destructive"
                  : fillPercent >= 70
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              )}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/20 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
              Entry Fee
            </span>
            <span className="text-sm font-bold text-foreground">
              {contest.entryFee === 0 ? (
                <span className="text-emerald-500 font-extrabold">FREE</span>
              ) : (
                `₹${contest.entryFee}`
              )}
            </span>
          </div>

          <Link href={`/contests/${contest.slug}`}>
            <Button size="sm" className="rounded-lg text-xs font-semibold gap-1 group-hover:bg-primary/95 transition-all">
              View Details
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
export default ContestCard;
