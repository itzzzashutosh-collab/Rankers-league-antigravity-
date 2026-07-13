"use client";

import React from "react";
import { MessageSquare, CheckCircle2, Circle, Activity, ShieldAlert, Sparkles } from "lucide-react";

export interface TimelineEvent {
  id: string | number;
  label: string;
  date: string;
  actor?: string;
  type?: "info" | "success" | "warning" | "error" | "ai";
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case "warning":
        return <Activity className="w-3.5 h-3.5 text-amber-400" />;
      case "error":
        return <ShieldAlert className="w-3.5 h-3.5 text-destructive" />;
      case "ai":
        return <Sparkles className="w-3.5 h-3.5 text-primary" />;
      default:
        return <Circle className="w-3.5 h-3.5 text-muted-foreground/60" />;
    }
  };

  return (
    <div className="space-y-4 pl-3 border-l border-border/60 ml-2 font-sans text-xs select-text">
      {events.map((evt, idx) => (
        <div key={evt.id || idx} className="relative pl-5 space-y-1">
          {/* Bullet icon */}
          <div className="absolute left-[-11px] top-1.5 w-5 h-5 bg-background flex items-center justify-center">
            {getIcon(evt.type)}
          </div>
          <div className="font-bold text-foreground leading-normal">{evt.label}</div>
          <div className="flex gap-2 text-[9px] text-muted-foreground font-semibold">
            {evt.actor && <span>by @{evt.actor}</span>}
            <span>•</span>
            <span className="font-mono">{evt.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Comments Feed List
export interface CommentItem {
  id: string | number;
  author: string;
  avatar?: string;
  content: string;
  time: string;
}

export function CommentList({ comments }: { comments: CommentItem[] }) {
  return (
    <div className="space-y-4 font-sans text-xs">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3 items-start border-b border-border/20 pb-3 last:border-none last:pb-0">
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary shrink-0">
            {comment.author[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">{comment.author}</span>
              <span className="text-[9px] text-muted-foreground font-mono">{comment.time}</span>
            </div>
            <p className="text-foreground/80 leading-relaxed font-semibold">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
