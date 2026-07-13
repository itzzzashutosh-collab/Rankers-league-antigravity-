"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, ArrowLeft, CheckCircle2, AlertOctagon } from "lucide-react";
import { participantService } from "@/services/participantService";
import { supportService } from "@/services/supportService";

export default function SupportDesk() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await participantService.getAllSupportTickets();
      setTickets(data);
      if (data.length > 0) setSelected(data[0]);
      setLoading(false);
    }
    load();
  }, []);

  const handleReply = async () => {
    if (!selected || !reply.trim()) return;
    await supportService.appendReply(selected.id, "admin", reply);
    const newMsg = { from: "admin", text: reply, at: new Date().toISOString() };
    const updated = { ...selected, messages: [...(selected.messages || []), newMsg] };
    setSelected(updated);
    setTickets(prev => prev.map(t => t.id === selected.id ? updated : t));
    setReply("");
  };

  const handleResolve = async () => {
    if (!selected) return;
    await supportService.updateTicketStatus(selected.id, "Resolved");
    const updated = { ...selected, status: "Resolved" };
    setSelected(updated);
    setTickets(prev => prev.map(t => t.id === selected.id ? updated : t));
  };

  const priorityColor = (p: string) => {
    switch (p) {
      case "Critical": return "text-destructive border-destructive/20 bg-destructive/5";
      case "High": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      default: return "text-muted-foreground border-border/60 bg-muted/5";
    }
  };

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12">
      <div className="flex items-center gap-3 border-b border-border/30 pb-4">
        <Link href="/admin/participants" className="p-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-muted-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-lg font-black flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary" /> Support Desk</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage participant support tickets, reply inline, and escalate issues.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">Loading Support Tickets...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-260px)]">
          {/* Ticket List */}
          <div className="lg:col-span-4 overflow-y-auto space-y-2 text-xs font-semibold pr-1">
            {tickets.map(t => (
              <button key={t.id} onClick={() => setSelected(t)}
                className={`w-full p-4 rounded-2xl border text-left transition-all space-y-1.5 ${selected?.id === t.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-foreground truncate flex-1">{t.subject}</span>
                  <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${priorityColor(t.priority)}`}>{t.priority}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>@{t.participant_username}</span>
                  <span>·</span>
                  <span className={t.status === "Resolved" ? "text-emerald-400" : t.status === "Escalated" ? "text-destructive" : "text-amber-400"}>{t.status}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Thread Viewer */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {selected ? (
              <>
                <div className="rounded-3xl border border-border bg-card/15 p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-sm text-foreground">{selected.subject}</h3>
                    <span className="text-[10px] text-muted-foreground">@{selected.participant_username} · {selected.status}</span>
                  </div>
                  {selected.status !== "Resolved" && (
                    <button onClick={handleResolve}
                      className="h-8 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] hover:bg-emerald-500/25 transition-all flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 text-xs px-1">
                  {(selected.messages || []).map((msg: any, i: number) => (
                    <div key={i} className={`p-3.5 rounded-2xl text-[11px] max-w-[85%] ${msg.from === "admin" ? "bg-primary/5 border border-primary/10 ml-auto" : "bg-background/50 border border-border/60"}`}>
                      <span className="text-[9px] text-muted-foreground/60 font-bold block mb-1">{msg.from === "admin" ? "You (Admin)" : `@${selected.participant_username}`} · {new Date(msg.at).toLocaleString("en-IN")}</span>
                      <p className="text-foreground leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {selected.status !== "Resolved" && (
                  <div className="flex gap-2">
                    <input value={reply} onChange={e => setReply(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleReply()}
                      placeholder="Type your reply..."
                      className="flex-1 h-10 px-4 text-xs rounded-xl border border-border bg-background/50 focus:outline-none" />
                    <button onClick={handleReply}
                      className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-colors">Send</button>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground/40 text-xs">Select a ticket to view the thread</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
