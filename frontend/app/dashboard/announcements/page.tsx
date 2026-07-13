import React from "react";
import Link from "next/link";
import { Megaphone, Calendar, Clock, AlertCircle, ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/auth/notificationService";

export default async function PublicAnnouncementsPage() {
  const announcements = await notificationService.getAnnouncements();

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return "border-rose-500/30 bg-rose-500/5 text-rose-400";
      case "high":
        return "border-amber-500/30 bg-amber-500/5 text-amber-400";
      default:
        return "border-border/40 bg-card/30 text-muted-foreground";
    }
  };

  const getCategoryLabel = (catId: string) => {
    switch (catId) {
      case "new_categories":
        return "New Categories";
      case "upcoming_features":
        return "Platform Features";
      case "maintenance":
        return "Maintenance Window";
      case "policy_updates":
        return "Policy Update";
      case "special_events":
        return "Special Event";
      default:
        return "Announcement";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-16 space-y-10">
        {/* Navigation back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <Megaphone className="w-8 h-8 text-primary" />
            Platform Announcements & Broadcasts
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Read official communications, schedule logs, updates, and upcoming features transparently.
          </p>
        </div>

        {announcements.length === 0 ? (
          <div className="border border-dashed border-border/40 bg-card/10 rounded-2xl p-16 text-center text-xs text-muted-foreground">
            <Megaphone className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="font-bold text-foreground">No active announcements</p>
            <p className="text-[10px] mt-1">Check back later for official broadcasts.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className={`border rounded-2xl p-6 space-y-4 backdrop-blur-sm shadow-md transition-all duration-200 hover:border-border/80 ${getPriorityStyle(
                  ann.priority
                )}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border border-current">
                      {getCategoryLabel(ann.category_id)}
                    </span>
                    {ann.priority === "critical" && (
                      <span className="inline-flex items-center gap-1 text-[8px] font-black uppercase px-2 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                        <AlertCircle className="w-2.5 h-2.5" /> Urgent
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[9px] font-semibold text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(ann.publish_date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-black text-foreground">{ann.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export const dynamic = "force-dynamic";
