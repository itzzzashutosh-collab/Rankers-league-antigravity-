"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Trophy, Calendar, Users, Zap, Play, Clock,
  Plus, Copy, BarChart3, Send, Bot, CheckCircle2,
  Target, DollarSign, AlertCircle, RefreshCw, ArrowRight
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bgsdovlumtjwvcwzjnnn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnc2Rvdmx1bXRqd3Zjd3pqbm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzOTU0ODMsImV4cCI6MjA5ODk3MTQ4M30.OVEd9g1sqM8hRj4n_Q8jZ-4uGJ5T5kkW-GX7cVjjKrI";
const supabase = createClient(supabaseUrl, supabaseKey);

interface Contest {
  id: string;
  title: string;
  exam_name: string;
  status: string;
  entry_fee: number;
  total_seats: number;
  participants_count: number;
  start_time: string;
  end_time: string;
}

interface ChatMsg { role: "user" | "agent"; text: string; }
interface LogEntry { ts: string; msg: string; type: "info" | "success" | "warn" | "error"; }

// Contest agent command parser
function parseContestCommand(text: string): { action: string; args: Record<string, string> } | null {
  const t = text.toLowerCase().trim();
  if (t.includes("active") || t.includes("live") || t.includes("running"))
    return { action: "list_active", args: {} };
  if (t.includes("upcoming") || t.includes("scheduled"))
    return { action: "list_upcoming", args: {} };
  if (t.includes("create") || t.includes("new contest") || t.includes("schedule"))
    return { action: "open_creator", args: {} };
  const populateMatch = t.match(/populate (?:paper for )?([a-z\s]+)/);
  if (populateMatch)
    return { action: "populate_paper", args: { exam: populateMatch[1].trim() } };
  if (t.includes("stats") || t.includes("overview"))
    return { action: "contest_stats", args: {} };
  return null;
}

export default function ContestAgentTab() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "create">("active");
  const [chat, setChat] = useState<ChatMsg[]>([{
    role: "agent",
    text: "🏆 I'm the **Contest Agent**. I can help you schedule contests, populate question papers, monitor live sessions, and announce results.\n\nTry: *\"show active contests\"*, *\"create new contest\"*, or *\"populate paper for JEE Advanced\"*"
  }]);
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Create contest form state
  const [form, setForm] = useState({
    title: "", exam_name: "JEE Advanced", entry_fee: "49",
    total_seats: "500", start_time: "", duration_mins: "180"
  });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");

  const log = (msg: string, type: LogEntry["type"] = "info") => {
    setLogs(prev => [...prev.slice(-50), { ts: new Date().toLocaleTimeString(), msg, type }]);
  };

  const agentReply = (text: string) => {
    setChat(prev => [...prev, { role: "agent", text }]);
  };

  const loadContests = async (filter: "active" | "upcoming" = "active") => {
    setLoading(true);
    log(`Loading ${filter} contests...`);
    const status = filter === "active" ? "live" : "scheduled";
    const { data, error } = await supabase
      .from("contests")
      .select("id,title,exam_name,status,entry_fee,total_seats,participants_count,start_time,end_time")
      .eq("status", status)
      .order("start_time", { ascending: true })
      .limit(20);

    if (error) {
      // Try alternate table name
      const { data: d2 } = await supabase
        .from("contest")
        .select("id,title,exam_name,status,entry_fee,total_seats,participants_count,start_time,end_time")
        .limit(20);
      setContests((d2 || []) as Contest[]);
      log(`Loaded ${(d2 || []).length} contests`, "success");
    } else {
      setContests((data || []) as Contest[]);
      log(`Loaded ${(data || []).length} ${filter} contests`, "success");
    }
    setLoading(false);
  };

  const handleCreateContest = async () => {
    if (!form.title || !form.start_time) {
      setCreateMsg("❌ Title and start time are required.");
      return;
    }
    setCreating(true);
    log(`Creating contest: "${form.title}"...`);

    const startDt = new Date(form.start_time);
    const endDt = new Date(startDt.getTime() + parseInt(form.duration_mins) * 60 * 1000);

    const { error } = await supabase.from("contests").insert({
      title: form.title,
      exam_name: form.exam_name,
      entry_fee: parseFloat(form.entry_fee),
      total_seats: parseInt(form.total_seats),
      start_time: startDt.toISOString(),
      end_time: endDt.toISOString(),
      status: "scheduled",
      participants_count: 0,
    });

    if (error) {
      setCreateMsg(`❌ Error: ${error.message}`);
      log(`Failed to create contest: ${error.message}`, "error");
    } else {
      setCreateMsg("✅ Contest created and scheduled!");
      log(`Created contest: "${form.title}"`, "success");
      agentReply(`✅ Contest **"${form.title}"** scheduled for **${new Date(form.start_time).toLocaleString()}**!\n\n• Exam: ${form.exam_name}\n• Entry fee: ₹${form.entry_fee}\n• Seats: ${form.total_seats}`);
      setForm({ title: "", exam_name: "JEE Advanced", entry_fee: "49", total_seats: "500", start_time: "", duration_mins: "180" });
    }
    setCreating(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setChat(prev => [...prev, { role: "user", text }]);
    setInput("");

    const cmd = parseContestCommand(text);
    if (!cmd) {
      agentReply("Try:\n• `show active contests`\n• `show upcoming contests`\n• `create new contest`\n• `populate paper for JEE Main`\n• `contest stats`");
      return;
    }

    switch (cmd.action) {
      case "list_active":
        await loadContests("active");
        setActiveTab("active");
        agentReply(`📡 Loaded **${contests.length}** live contests. See the panel on the left.`);
        break;
      case "list_upcoming":
        await loadContests("upcoming");
        setActiveTab("upcoming");
        agentReply(`📅 Loaded upcoming scheduled contests. See the panel.`);
        break;
      case "open_creator":
        setActiveTab("create");
        agentReply("📝 Contest creator is now open. Fill in the details and click **Create Contest**.");
        break;
      case "populate_paper":
        agentReply(
          `📚 To populate a paper for **${cmd.args.exam}**:\n\n` +
          `1. Go to **Paper Builder** in the sidebar\n` +
          `2. Select exam: ${cmd.args.exam}\n` +
          `3. Set difficulty distribution (e.g., 30% easy, 40% medium, 30% hard)\n` +
          `4. Click "Auto-Select from Bank"\n\n` +
          `The system will pull questions from your **167K template bank** matching the criteria.`
        );
        break;
      case "contest_stats":
        agentReply(
          `📊 **Contest Overview**\n\n` +
          `• Active contests loaded: **${contests.length}**\n` +
          `• Use "show active" or "show upcoming" to refresh\n` +
          `• Use "create new contest" to schedule a new one`
        );
        break;
    }
  };

  useEffect(() => { loadContests("active"); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const statusColor: Record<string, string> = {
    live: "#22c55e", scheduled: "#f59e0b",
    completed: "#6b7280", cancelled: "#ef4444"
  };

  const exams = ["JEE Advanced", "JEE Main", "NEET", "BITSAT", "CUET UG", "GATE"];

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 180px)", minHeight: 600 }}>

      {/* ─── LEFT: Contest List + Creator ──────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 6 }}>
          {(["active", "upcoming", "create"] as const).map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); if (tab !== "create") loadContests(tab === "active" ? "active" : "upcoming"); }}
              style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                background: activeTab === tab ? "rgba(99,102,241,0.2)" : "transparent",
                border: activeTab === tab ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.07)",
                color: activeTab === tab ? "#818cf8" : "#64748b"
              }}>
              {tab === "active" ? "🔴 Live" : tab === "upcoming" ? "📅 Scheduled" : "＋ Create"}
            </button>
          ))}
          <button onClick={() => loadContests(activeTab === "create" ? "active" : activeTab)}
            style={{ marginLeft: "auto", background: "none", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#64748b" }}>
            <RefreshCw size={13} />
          </button>
        </div>

        {/* Contest List */}
        {activeTab !== "create" && (
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {loading && <div style={{ color: "#64748b", fontSize: 13, textAlign: "center", padding: 30 }}>Loading...</div>}
            {!loading && contests.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                <Trophy size={32} style={{ marginBottom: 8, display: "block", margin: "0 auto 8px", opacity: 0.4 }} />
                No {activeTab} contests found.
              </div>
            )}
            {contests.map(c => (
              <div key={c.id} style={{
                background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12, padding: 16, position: "relative", overflow: "hidden"
              }}>
                {c.status === "live" && (
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: "linear-gradient(90deg, #22c55e, #16a34a)"
                  }} />
                )}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 10,
                        background: `${statusColor[c.status] || "#6b7280"}20`,
                        color: statusColor[c.status] || "#6b7280", fontWeight: 600
                      }}>{c.status?.toUpperCase()}</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{c.exam_name}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>
                      {c.title || "Untitled Contest"}
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94a3b8" }}>
                        <Users size={12} /> {c.participants_count || 0}/{c.total_seats || "—"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94a3b8" }}>
                        <DollarSign size={12} /> ₹{c.entry_fee || 0}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94a3b8" }}>
                        <Clock size={12} /> {c.start_time ? new Date(c.start_time).toLocaleString() : "TBD"}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {c.status === "scheduled" && (
                      <button style={{
                        background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                        color: "#22c55e", borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                        fontSize: 12, display: "flex", alignItems: "center", gap: 4
                      }}>
                        <Play size={11} /> Go Live
                      </button>
                    )}
                    <button style={{
                      background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                      color: "#818cf8", borderRadius: 8, padding: "6px 12px", cursor: "pointer",
                      fontSize: 12, display: "flex", alignItems: "center", gap: 4
                    }}>
                      <Copy size={11} /> Clone
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contest Creator */}
        {activeTab === "create" && (
          <div style={{
            background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: 24, flex: 1, overflowY: "auto"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Trophy size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>Create New Contest</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Schedule a live competitive exam session</div>
              </div>
            </div>

            {[
              { key: "title", label: "Contest Title", type: "text", placeholder: "e.g. JEE Advanced Sunday Challenge #12" },
              { key: "entry_fee", label: "Entry Fee (₹)", type: "number", placeholder: "49" },
              { key: "total_seats", label: "Total Seats", type: "number", placeholder: "500" },
              { key: "start_time", label: "Start Date & Time", type: "datetime-local", placeholder: "" },
              { key: "duration_mins", label: "Duration (minutes)", type: "number", placeholder: "180" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                    fontFamily: "inherit", outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", display: "block", marginBottom: 6 }}>
                Exam
              </label>
              <select
                value={form.exam_name}
                onChange={e => setForm(f => ({ ...f, exam_name: e.target.value }))}
                style={{
                  width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13,
                  fontFamily: "inherit", outline: "none"
                }}
              >
                {exams.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {createMsg && (
              <div style={{
                padding: "10px 14px", borderRadius: 8, marginBottom: 14, fontSize: 13,
                background: createMsg.includes("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${createMsg.includes("✅") ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: createMsg.includes("✅") ? "#22c55e" : "#f87171"
              }}>{createMsg}</div>
            )}

            <button
              onClick={handleCreateContest}
              disabled={creating}
              style={{
                width: "100%", padding: "12px 20px", borderRadius: 10, cursor: creating ? "not-allowed" : "pointer",
                background: creating ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none", color: "#fff", fontSize: 14, fontWeight: 600,
                fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {creating ? <RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Trophy size={15} />}
              {creating ? "Creating..." : "Create Contest"}
            </button>
          </div>
        )}
      </div>

      {/* ─── RIGHT: Agent Chat + Stats ──────────────────────────────── */}
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Quick Stats */}
        <div style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08))",
          border: "1px solid rgba(245,158,11,0.25)", borderRadius: 14, padding: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <BarChart3 size={15} color="#fbbf24" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#fde68a" }}>Contest Stats</span>
          </div>
          {[
            { label: "Active Now", value: contests.filter(c => c.status === "live").length, color: "#22c55e" },
            { label: "Scheduled", value: contests.filter(c => c.status === "scheduled").length, color: "#f59e0b" },
            { label: "Total Participants", value: contests.reduce((s, c) => s + (c.participants_count || 0), 0), color: "#818cf8" },
          ].map(stat => (
            <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{stat.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: stat.color }}>{stat.value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Agent Chat */}
        <div style={{
          flex: 1, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column"
        }}>
          <div style={{
            padding: "12px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 10
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Trophy size={13} color="#fff" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Contest Agent</span>
            <span style={{ marginLeft: "auto", fontSize: 10, color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Online
            </span>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {chat.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "92%", padding: "8px 12px",
                  borderRadius: msg.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                  background: msg.role === "user" ? "linear-gradient(135deg, #f59e0b, #d97706)" : "rgba(255,255,255,0.05)",
                  fontSize: 12, color: "#e2e8f0", lineHeight: 1.55,
                  border: msg.role === "agent" ? "1px solid rgba(255,255,255,0.07)" : "none",
                  whiteSpace: "pre-wrap"
                }}>
                  {msg.text.replace(/\*\*(.+?)\*\*/g, '$1')}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: 10, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "rgba(0,0,0,0.3)", borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)", padding: "7px 10px"
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder="Ask contest agent..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: "#e2e8f0", fontSize: 12, fontFamily: "inherit"
                }}
              />
              <button onClick={handleSend} style={{ background: "none", border: "none", cursor: "pointer", color: "#f59e0b" }}>
                <Send size={13} />
              </button>
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
              {["active contests", "create contest", "upcoming"].map(s => (
                <button key={s} onClick={() => setInput(s)}
                  style={{
                    fontSize: 10, padding: "3px 7px", borderRadius: 5, cursor: "pointer",
                    background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)",
                    color: "#fbbf24", fontFamily: "inherit"
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
