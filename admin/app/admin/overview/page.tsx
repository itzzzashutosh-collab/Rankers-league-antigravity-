"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertTriangle, RefreshCw, Users, Database, 
  Wallet, Layers, ArrowUpRight, LayoutGrid, RotateCcw,
  CheckCircle, Radio, Clock, Eye, Info, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { operationsService, PlatformStat, PlatformTimelineEvent, SystemAlert, WidgetLayout } from "@/services/operationsService";
import { monitoringService, ServiceHealth, ContestMonitorItem, RegistrationFeedItem } from "@/services/monitoringService";
import { useInspector } from "@/utils/InspectorContext";

export default function AdminOverviewPage() {
  const { inspect } = useInspector();
  const [loading, setLoading] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  
  // Data states
  const [stats, setStats] = useState<PlatformStat[]>([]);
  const [health, setHealth] = useState<ServiceHealth[]>([]);
  const [contests, setContests] = useState<ContestMonitorItem[]>([]);
  const [registrations, setRegistrations] = useState<RegistrationFeedItem[]>([]);
  const [timeline, setTimeline] = useState<PlatformTimelineEvent[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [layout, setLayout] = useState<WidgetLayout[]>([]);

  // Local actions lists
  const [actionQueue, setActionQueue] = useState([
    { id: "act-1", title: "Approve Subham Pandey Bank Payout", type: "Withdrawal", amount: "₹4,500", priority: "High", deadline: "Today 6 PM", owner: "Finance Manager" },
    { id: "act-2", title: "Verify UPSC Elite Section 3 Keys", type: "Evaluation", amount: "18.4K scripts", priority: "Critical", deadline: "Within 2h", owner: "Contest Manager" },
    { id: "act-3", title: "Approve JEE Chemistry Question Set", type: "Verification", amount: "90 MCQs", priority: "Medium", deadline: "Tomorrow", owner: "Question Manager" }
  ]);

  const loadData = async () => {
    setLoading(true);
    const [fetchedStats, fetchedHealth, fetchedContests, fetchedRegs, fetchedTimeline, fetchedAlerts, fetchedLayout] = await Promise.all([
      operationsService.getPlatformStats(),
      monitoringService.getSystemHealth(),
      monitoringService.getLiveContests(),
      monitoringService.getRegistrationFeed(),
      operationsService.getTimelineEvents(),
      operationsService.getSystemAlerts(),
      operationsService.getAdminLayout("ashutosh-admin-id")
    ]);

    setStats(fetchedStats);
    setHealth(fetchedHealth);
    setContests(fetchedContests);
    setRegistrations(fetchedRegs);
    setTimeline(fetchedTimeline);
    setAlerts(fetchedAlerts);

    const sortedLayout = [...fetchedLayout].sort((a, b) => a.row_order - b.row_order);
    setLayout(sortedLayout);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Simulates telemetry variations
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => prev.map(s => {
        if (s.key === "users_online") {
          const delta = Math.floor(Math.random() * 21) - 10;
          return { ...s, value: Math.max(1200, s.value + delta) };
        }
        return s;
      }));

      setHealth(prev => prev.map(h => {
        if (h.status === "Healthy" && h.latency_ms > 0) {
          const variance = Math.floor(Math.random() * 5) - 2;
          return { ...h, latency_ms: Math.max(2, h.latency_ms + variance) };
        }
        return h;
      }));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const toggleVisibility = (widgetId: string) => {
    setLayout(prev => prev.map(l => l.widget_id === widgetId ? { ...l, is_visible: !l.is_visible } : l));
  };

  const saveLayout = async () => {
    setLoading(true);
    await operationsService.saveAdminLayout("ashutosh-admin-id", layout);
    setCustomizing(false);
    setLoading(false);
    alert("Dashboard layout saved.");
  };

  const resetLayout = () => {
    setLayout([
      { widget_id: "status_ribbon", col_span: 12, row_order: 0, is_visible: true, is_pinned: true },
      { widget_id: "snapshot_ribbon", col_span: 12, row_order: 1, is_visible: true, is_pinned: true },
      { widget_id: "contest_monitor", col_span: 8, row_order: 2, is_visible: true, is_pinned: false },
      { widget_id: "action_center", col_span: 4, row_order: 3, is_visible: true, is_pinned: false },
      { widget_id: "registration_feed", col_span: 4, row_order: 4, is_visible: true, is_pinned: false },
      { widget_id: "platform_timeline", col_span: 4, row_order: 5, is_visible: true, is_pinned: false },
      { widget_id: "admin_activity", col_span: 4, row_order: 6, is_visible: true, is_pinned: false }
    ]);
  };

  const resolveAction = (id: string) => {
    setActionQueue(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 pb-12 text-foreground font-sans text-xs">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
            Operations Workspace Overview
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black border border-primary/20 bg-primary/5 uppercase tracking-widest text-primary">
              <Radio className="w-2.5 h-2.5 animate-pulse inline" /> Telemetry Live
            </span>
          </h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Personal executive cockpit console. Inspect active contests, transactions desk and pipeline runs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!customizing ? (
            <button
              onClick={() => setCustomizing(true)}
              className="h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/40 font-bold text-foreground flex items-center gap-1.5 transition-colors"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Customize Layout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={saveLayout}
                className="h-8 px-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 font-bold flex items-center gap-1 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Save Layout
              </button>
              <button
                onClick={resetLayout}
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted/40"
                title="Restore default grid"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCustomizing(false)}
                className="h-8 px-3 rounded-lg border border-border bg-card hover:bg-muted/40 font-bold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {alerts.map((al) => (
        <div key={al.id} className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-500 font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{al.message}</span>
        </div>
      ))}

      {/* Widgets list */}
      <div className="grid grid-cols-12 gap-6">
        {layout
          .filter((item) => item.is_visible)
          .map((item) => {
            const spanClass =
              item.col_span === 12 ? "col-span-12" :
              item.col_span === 8 ? "col-span-12 lg:col-span-8" :
              item.col_span === 6 ? "col-span-12 lg:col-span-6" :
              "col-span-12 lg:col-span-4";

            return (
              <div key={item.widget_id} className={`${spanClass} rounded-2xl border border-border bg-card/10 p-6 space-y-4`}>
                {customizing && (
                  <div className="flex items-center justify-between pb-2 border-b border-border/40 shrink-0">
                    <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">
                      Panel: {item.widget_id}
                    </span>
                    <button
                      onClick={() => toggleVisibility(item.widget_id)}
                      className="p-1 rounded text-destructive hover:bg-destructive/10"
                    >
                      Hide widget
                    </button>
                  </div>
                )}

                {/* 1. Status Ribbon */}
                {item.widget_id === "status_ribbon" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Service Health Telemetry</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {health.map((srv, i) => (
                        <div key={i} className="p-3 rounded-xl border border-border bg-background flex flex-col justify-between h-20">
                          <span className="font-bold text-foreground text-[10px] truncate">{srv.service_name}</span>
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase ${
                              srv.status === "Healthy" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-amber-400 border-amber-500/20 bg-amber-500/5"
                            }`}>{srv.status}</span>
                            {srv.latency_ms > 0 && <span className="font-mono text-[9px] text-muted-foreground">{srv.latency_ms}ms</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Snapshot metrics */}
                {item.widget_id === "snapshot_ribbon" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Platform Snapshots</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {stats.map((st) => (
                        <div key={st.key} className="p-4 rounded-xl border border-border bg-background space-y-1">
                          <span className="text-[9px] text-muted-foreground font-bold block">{st.label}</span>
                          <span className="text-lg font-black text-foreground block font-mono">{st.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Contests monitor */}
                {item.widget_id === "contest_monitor" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Live Contests Pipeline</span>
                    <div className="overflow-x-auto border border-border rounded-xl bg-background/50">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-border/80 text-[9px] font-black uppercase tracking-wider text-muted-foreground bg-muted/20">
                            <th className="p-3">Contest</th>
                            <th className="p-3">Status</th>
                            <th className="p-3 text-center">Seats</th>
                            <th className="p-3">Phase</th>
                            <th className="p-3">Time Left</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                          {contests.map((cm) => (
                            <tr
                              key={cm.id}
                              onClick={() => inspect({
                                type: "contest",
                                title: cm.name,
                                subtitle: cm.current_phase,
                                metadata: { id: cm.id, status: cm.status, participants: cm.participants, remaining_time: cm.remaining_time }
                              })}
                              className="hover:bg-muted/40 transition-colors cursor-pointer"
                            >
                              <td className="p-3 font-bold text-foreground">{cm.name}</td>
                              <td className="p-3">
                                <span className="text-[8px] font-black border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase">{cm.status}</span>
                              </td>
                              <td className="p-3 text-center text-muted-foreground font-mono">{cm.participants.toLocaleString()}</td>
                              <td className="p-3 font-bold text-foreground/80">{cm.current_phase}</td>
                              <td className="p-3 font-mono text-muted-foreground">{cm.remaining_time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Action center */}
                {item.widget_id === "action_center" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Priority Action Center</span>
                    <div className="space-y-2">
                      {actionQueue.map((act) => (
                        <div key={act.id} className="p-3 rounded-xl border border-border bg-background flex items-center justify-between gap-4">
                          <div className="space-y-0.5">
                            <h4 className="font-bold text-foreground">{act.title}</h4>
                            <span className="text-[9px] text-muted-foreground block">{act.type} • {act.owner}</span>
                          </div>
                          <button
                            onClick={() => resolveAction(act.id)}
                            className="px-2.5 py-1 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                          >
                            Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Live Registration Feed */}
                {item.widget_id === "registration_feed" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Live Enrollments</span>
                    <div className="space-y-3">
                      {registrations.slice(0, 4).map((reg) => (
                        <div key={reg.id} className="flex justify-between items-center border-b border-border/20 pb-2 last:border-none">
                          <div>
                            <span className="font-bold text-foreground block">{reg.candidate_name}</span>
                            <span className="text-[9px] text-muted-foreground block">{reg.contest_name}</span>
                          </div>
                          <span className="text-[8px] font-black uppercase border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 px-1.5 py-0.5 rounded-full">{reg.verification_status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Timeline */}
                {item.widget_id === "platform_timeline" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Platform Events Log</span>
                    <div className="space-y-3">
                      {timeline.slice(0, 4).map((evt) => (
                        <div key={evt.id} className="flex gap-2">
                          <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-[10px]">
                              <span className="font-bold text-foreground truncate block flex-1">{evt.action}</span>
                              <span className="text-muted-foreground font-mono text-[8px] shrink-0">{evt.time_label}</span>
                            </div>
                            <span className="text-[9px] text-muted-foreground block truncate">{evt.entity} by @{evt.actor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Recent admin activity */}
                {item.widget_id === "admin_activity" && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider block">Recent Admin Traces</span>
                    <div className="space-y-2">
                      {[
                        { time: "10m ago", admin: "Ashutosh Admin", action: "Updated dashboard layouts config" },
                        { time: "1h ago", admin: "Super Admin", action: "Configured Platform telemetry status" }
                      ].map((act, i) => (
                        <div key={i} className="flex justify-between items-start text-[10px] border-b border-border/25 pb-2 last:border-none">
                          <div>
                            <span className="font-bold text-foreground">@{act.admin}</span>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{act.action}</p>
                          </div>
                          <span className="text-[8px] text-muted-foreground font-mono">{act.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
      </div>
    </div>
  );
}
