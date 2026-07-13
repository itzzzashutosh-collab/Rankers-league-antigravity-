"use client";

import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  event_type: string;
  title: string;
  description: string;
  icon?: string;
  created_at: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-6 shadow-xl space-y-4">
      <h3 className="text-xs font-black text-foreground uppercase tracking-wider">
        Timeline Activity Feed
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/30">
        {activities.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No activity logged yet.
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Timeline marker */}
              <span className="absolute -left-[27px] top-0.5 w-[14px] h-[14px] rounded-full border border-border bg-card flex items-center justify-center text-[8px] z-10">
                {act.icon || "📌"}
              </span>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {act.title}
                  </h4>
                  <span className="text-[9px] text-muted-foreground/60 font-mono">
                    {new Date(act.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                {act.description && (
                  <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">
                    {act.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default ActivityTimeline;
