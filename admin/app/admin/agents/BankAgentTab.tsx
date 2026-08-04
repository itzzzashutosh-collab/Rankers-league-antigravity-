"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BookOpen, Database, CheckCircle2, XCircle, RefreshCw,
  Search, ChevronRight, Layers, BarChart3, Filter,
  Sparkles, Eye, ThumbsUp, ThumbsDown, Bot, Send,
  AlertTriangle, TrendingUp, Clock, Zap, Download
} from "lucide-react";
import { bankAgentService, BankStats, TemplateRow } from "@/services/bankAgentService";

interface LogEntry {
  ts: string;
  msg: string;
  type: "info" | "success" | "warn" | "error";
}

interface ChatMsg {
  role: "user" | "agent";
  text: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND PARSER — maps natural language to actions
// ─────────────────────────────────────────────────────────────────────────────
function parseCommand(text: string): { action: string; args: Record<string, string> } | null {
  const t = text.toLowerCase().trim();

  if (t.includes("stats") || t.includes("overview") || t.includes("how many"))
    return { action: "stats", args: {} };

  if (t.includes("review queue") || t.includes("show queue") || t.includes("pending"))
    return { action: "review_queue", args: {} };

  const approveMatch = t.match(/approve all (\w[\w\s]*?) ?(templates|questions)?/);
  if (approveMatch)
    return { action: "bulk_approve", args: { exam: approveMatch[1].trim() } };

  const searchMatch = t.match(/search (?:for )?(.+)/);
  if (searchMatch)
    return { action: "search", args: { query: searchMatch[1].trim() } };

  if (t.includes("fix") && t.includes("options"))
    return { action: "info_fix", args: {} };

  return null;
}

export default function BankAgentTab() {
  const [stats, setStats] = useState<BankStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState<TemplateRow[]>([]);
  const [queueVisible, setQueueVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<TemplateRow[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: "agent",
      text: "👋 Hi! I'm the **Question Bank Agent**. I can help you review templates, fix options, generate new questions, and manage your entire question bank.\n\nTry: *\"show stats\"*, *\"show review queue\"*, or *\"search Newton's laws\"*"
    }
  ]);
  const [input, setInput] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateRow | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const log = useCallback((msg: string, type: LogEntry["type"] = "info") => {
    const entry: LogEntry = {
      ts: new Date().toLocaleTimeString(),
      msg,
      type
    };
    setLogs(prev => [...prev.slice(-80), entry]);
  }, []);

  const agentReply = (text: string) => {
    setChat(prev => [...prev, { role: "agent", text }]);
  };

  const loadStats = async () => {
    setLoading(true);
    log("Fetching bank statistics from Supabase...");
    try {
      const s = await bankAgentService.getStats();
      setStats(s);
      log(`Stats loaded: ${s.total.toLocaleString()} templates`, "success");
    } catch (e) {
      log("Failed to fetch stats — check Supabase connection", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadQueue = async () => {
    setLoading(true);
    log("Loading review queue (auto_fixed templates)...");
    try {
      const q = await bankAgentService.getReviewQueue(20);
      setQueue(q);
      setQueueVisible(true);
      log(`Queue loaded: ${q.length} templates awaiting review`, "success");
    } catch (e) {
      log("Failed to load queue", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    await bankAgentService.approveTemplate(id);
    setQueue(prev => prev.filter(t => t.template_id !== id));
    log(`✓ Approved template ${id.slice(0, 8)}...`, "success");
    if (stats) setStats({ ...stats, reviewedPct: stats.reviewedPct + 1 });
  };

  const handleReject = async (id: string) => {
    await bankAgentService.rejectTemplate(id);
    setQueue(prev => prev.filter(t => t.template_id !== id));
    log(`✗ Rejected template ${id.slice(0, 8)}...`, "warn");
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    log(`Searching for "${searchQuery}"...`);
    const res = await bankAgentService.searchTemplates(searchQuery);
    setSearchResults(res);
    log(`Found ${res.length} matching templates`, "success");
    setLoading(false);
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setChat(prev => [...prev, { role: "user", text }]);
    setInput("");

    const cmd = parseCommand(text);
    if (!cmd) {
      agentReply("I didn't quite understand that. Try:\n• `show stats`\n• `show review queue`\n• `approve all JEE Main templates`\n• `search Newton's laws`");
      return;
    }

    switch (cmd.action) {
      case "stats":
        await loadStats();
        if (stats) {
          agentReply(
            `📊 **Bank Overview**\n\n` +
            `• Total templates: **${stats.total.toLocaleString()}**\n` +
            `• Reviewed: **${stats.reviewedPct}%**\n` +
            `• Draft/auto_fixed: **${((stats.byStatus["draft"] || 0) + (stats.byStatus["auto_fixed"] || 0)).toLocaleString()}**\n` +
            `• Top exam: **${Object.entries(stats.byExam).sort((a, b) => b[1] - a[1])[0]?.[0] || "—"}**`
          );
        } else {
          agentReply("Couldn't load stats — check Supabase connection.");
        }
        break;

      case "review_queue":
        await loadQueue();
        agentReply(`📋 Loaded **${queue.length}** templates into the review queue below. Click ✓ to approve or ✗ to reject.`);
        break;

      case "bulk_approve":
        const exam = cmd.args.exam || "";
        log(`Bulk approving auto_fixed templates for: ${exam}`);
        const count = await bankAgentService.bulkApprove(exam, 500);
        agentReply(`✅ Approved **${count}** templates for **${exam}**.`);
        log(`Bulk approved ${count} templates for ${exam}`, "success");
        break;

      case "search":
        setSearchQuery(cmd.args.query);
        const results = await bankAgentService.searchTemplates(cmd.args.query);
        setSearchResults(results);
        agentReply(`🔍 Found **${results.length}** templates matching "${cmd.args.query}". Results shown below.`);
        break;

      case "info_fix":
        agentReply(
          `🔧 **How to apply the SQL fixes:**\n\n` +
          `1. The fix script generated **323 patch files** in \`output/fixes/\`\n` +
          `2. Open Supabase → SQL Editor\n` +
          `3. Upload and run \`patch_0001.sql\` through \`patch_0323.sql\`\n` +
          `4. Each file fixes 500 rows (options, variable ranges, subject labels)\n\n` +
          `Fixes applied: **82,748** variable ranges + **32,380** subject labels + all options`
        );
        break;
    }
  };

  useEffect(() => { loadStats(); }, []);
  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const difficultyColors: Record<string, string> = {
    easy: "#22c55e", medium: "#f59e0b", hard: "#f97316",
    pro: "#a855f7", legend: "#ef4444"
  };

  const statusColors: Record<string, string> = {
    reviewed: "#22c55e", auto_fixed: "#f59e0b",
    draft: "#6b7280", rejected: "#ef4444"
  };

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 180px)", minHeight: 600 }}>

      {/* ─── LEFT COLUMN: Stats + Quick Actions ─────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Stats Cards */}
        <div style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
          border: "1px solid rgba(99,102,241,0.25)", borderRadius: 14, padding: 18
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Database size={16} color="#818cf8" />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#c7d2fe" }}>Bank Overview</span>
          </div>

          {stats ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  {stats.total.toLocaleString()}
                </div>
                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>Total Templates</div>
              </div>

              {/* Status breakdown */}
              {Object.entries(stats.byStatus).slice(0, 4).map(([status, count]) => (
                <div key={status} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%",
                      background: statusColors[status] || "#6b7280", display: "inline-block"
                    }} />
                    {status}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>
                    {count.toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Reviewed % bar */}
              <div style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>Review Progress</span>
                  <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>{stats.reviewedPct}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                  <div style={{
                    height: 6, borderRadius: 3, width: `${stats.reviewedPct}%`,
                    background: "linear-gradient(90deg, #22c55e, #16a34a)"
                  }} />
                </div>
              </div>
            </>
          ) : (
            <div style={{ color: "#64748b", fontSize: 13 }}>Loading stats...</div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: 16
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Quick Actions
          </div>
          {[
            { icon: <RefreshCw size={14} />, label: "Refresh Stats", fn: loadStats, color: "#818cf8" },
            { icon: <Eye size={14} />, label: "Load Review Queue", fn: loadQueue, color: "#f59e0b" },
            { icon: <TrendingUp size={14} />, label: "Top Exams", fn: async () => {
              if (stats) agentReply(`📊 Top exams by template count:\n${Object.entries(stats.byExam).sort((a,b) => b[1]-a[1]).slice(0,5).map(([k,v]) => `• ${k}: **${v.toLocaleString()}**`).join('\n')}`);
            }, color: "#22c55e" },
            { icon: <Download size={14} />, label: "How to Apply Fixes", fn: async () => {
              agentReply("📁 Patch files are in `output/fixes/` directory.\n\n**To apply:** Open Supabase → SQL Editor → paste each `patch_XXXX.sql` file and run.\n\n323 files × 500 rows = 161,500 total fixes.");
            }, color: "#06b6d4" },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.fn}
              style={{
                width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8, padding: "9px 12px", marginBottom: 8,
                display: "flex", alignItems: "center", gap: 8,
                color: "#e2e8f0", fontSize: 13, cursor: "pointer",
                transition: "all 0.15s"
              }}
              onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.borderColor = btn.color; (e.target as HTMLElement).closest('button')!.style.background = `${btn.color}15`; }}
              onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.borderColor = "rgba(255,255,255,0.06)"; (e.target as HTMLElement).closest('button')!.style.background = "transparent"; }}
            >
              <span style={{ color: btn.color }}>{btn.icon}</span>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Log Feed */}
        <div style={{
          flex: 1, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 14, padding: 14, overflow: "hidden", display: "flex", flexDirection: "column"
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Activity Log
          </div>
          <div style={{ flex: 1, overflowY: "auto", fontFamily: "monospace", fontSize: 11 }}>
            {logs.map((l, i) => (
              <div key={i} style={{
                color: l.type === "success" ? "#22c55e" : l.type === "error" ? "#f87171"
                  : l.type === "warn" ? "#fbbf24" : "#64748b",
                marginBottom: 3, lineHeight: 1.5
              }}>
                <span style={{ color: "#334155" }}>[{l.ts}]</span> {l.msg}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* ─── MIDDLE COLUMN: Review Queue + Search ─────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>

        {/* Search Bar */}
        <div style={{
          background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10
        }}>
          <Search size={15} color="#64748b" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search templates by concept, chapter, or topic..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#e2e8f0", fontSize: 14, fontFamily: "inherit"
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)",
              color: "#818cf8", borderRadius: 6, padding: "5px 12px", fontSize: 12,
              cursor: "pointer", fontFamily: "inherit"
            }}
          >
            Search
          </button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{
            background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 12, overflow: "hidden"
          }}>
            <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#94a3b8" }}>
              {searchResults.length} results
            </div>
            <div style={{ maxHeight: 200, overflowY: "auto" }}>
              {searchResults.map(t => (
                <div
                  key={t.template_id}
                  onClick={() => setPreviewTemplate(t)}
                  style={{
                    padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer", transition: "background 0.1s"
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(99,102,241,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 4,
                      background: "rgba(99,102,241,0.15)", color: "#818cf8"
                    }}>{t.template_type}</span>
                    <span style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 4,
                      background: `${difficultyColors[t.difficulty_level] || "#6b7280"}20`,
                      color: difficultyColors[t.difficulty_level] || "#6b7280"
                    }}>{t.difficulty_level}</span>
                    <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500 }}>{t.concept_name}</span>
                    <span style={{ fontSize: 11, color: "#64748b", marginLeft: "auto" }}>{t.exam_name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review Queue */}
        {queueVisible && (
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Clock size={14} color="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fbbf24" }}>Review Queue</span>
              <span style={{
                fontSize: 10, background: "rgba(245,158,11,0.15)", color: "#fbbf24",
                padding: "2px 7px", borderRadius: 10
              }}>{queue.length} pending</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {queue.map(t => (
                <div key={t.template_id} style={{
                  background: "rgba(15,23,42,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 10, padding: 14
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 4,
                          background: "rgba(99,102,241,0.15)", color: "#818cf8"
                        }}>{t.template_type}</span>
                        <span style={{
                          fontSize: 10, padding: "2px 6px", borderRadius: 4,
                          background: `${difficultyColors[t.difficulty_level] || "#6b7280"}20`,
                          color: difficultyColors[t.difficulty_level] || "#6b7280"
                        }}>{t.difficulty_level}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>{t.exam_name} · {t.chapter_name}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>
                        {t.concept_name}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                        {t.stem_template.slice(0, 120)}...
                      </div>
                      {t.formula_latex && (
                        <div style={{ fontSize: 11, color: "#818cf8", marginTop: 4 }}>
                          Formula: {t.formula_latex.slice(0, 60)}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <button
                        onClick={() => handleApprove(t.template_id)}
                        style={{
                          background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
                          color: "#22c55e", borderRadius: 6, padding: "5px 10px",
                          cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <ThumbsUp size={11} /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(t.template_id)}
                        style={{
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                          color: "#f87171", borderRadius: 6, padding: "5px 10px",
                          cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <ThumbsDown size={11} /> Reject
                      </button>
                      <button
                        onClick={() => setPreviewTemplate(t)}
                        style={{
                          background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
                          color: "#94a3b8", borderRadius: 6, padding: "5px 10px",
                          cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4
                        }}
                      >
                        <Eye size={11} /> Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {queue.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "#475569" }}>
                  <CheckCircle2 size={32} style={{ marginBottom: 8, display: "block", margin: "0 auto 8px" }} />
                  Queue is empty — all caught up!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Template Preview */}
        {previewTemplate && (
          <div style={{
            background: "rgba(15,23,42,0.8)", border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 12, padding: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#818cf8" }}>Template Preview</span>
              <button onClick={() => setPreviewTemplate(null)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 8, lineHeight: 1.6 }}>
              <strong style={{ color: "#e2e8f0" }}>Stem:</strong> {previewTemplate.stem_template}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                { label: "A (Correct)", text: previewTemplate.option_a, color: "#22c55e" },
                { label: "B", text: previewTemplate.option_b, color: "#f87171" },
                { label: "C", text: previewTemplate.option_c, color: "#f87171" },
                { label: "D", text: previewTemplate.option_d, color: "#f87171" },
              ].map(opt => (
                <div key={opt.label} style={{
                  background: "rgba(0,0,0,0.3)", borderRadius: 6, padding: "6px 10px",
                  border: `1px solid ${opt.color}25`
                }}>
                  <div style={{ fontSize: 10, color: opt.color, fontWeight: 600, marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{opt.text.slice(0, 80)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── RIGHT COLUMN: Agent Chat ────────────────────────────────── */}
      <div style={{
        width: 320, flexShrink: 0, display: "flex", flexDirection: "column",
        background: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14, overflow: "hidden"
      }}>
        <div style={{
          padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Bot size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>Bank Agent</div>
            <div style={{ fontSize: 11, color: "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              Online
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
          {chat.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "90%", padding: "9px 12px", borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.05)",
                fontSize: 12, color: "#e2e8f0", lineHeight: 1.6,
                border: msg.role === "agent" ? "1px solid rgba(255,255,255,0.07)" : "none",
                whiteSpace: "pre-wrap"
              }}>
                {msg.text.replace(/\*\*(.+?)\*\*/g, '$1')}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input */}
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(0,0,0,0.3)", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)", padding: "8px 12px"
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="Ask the bank agent..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: "#e2e8f0", fontSize: 13, fontFamily: "inherit"
              }}
            />
            <button onClick={handleSend} style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1", padding: 2 }}>
              <Send size={15} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {["show stats", "review queue", "search kinematics"].map(s => (
              <button key={s} onClick={() => { setInput(s); }}
                style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 6, cursor: "pointer",
                  background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                  color: "#818cf8", fontFamily: "inherit"
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
