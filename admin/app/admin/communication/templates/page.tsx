"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, RefreshCw, Plus, Edit3, Eye } from "lucide-react";
import { templateService, CommTemplate } from "@/services/templateService";

export default function TemplatesWorkspace() {
  const [templates, setTemplates] = useState<CommTemplate[]>([]);
  const [selected, setSelected] = useState<CommTemplate | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await templateService.getTemplates();
    setTemplates(data);
    if (data.length > 0) {
      setSelected(data[0]);
      setSubject(data[0].subject_template || "");
      setBody(data[0].body_template);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSelect = (t: CommTemplate) => {
    setSelected(t);
    setSubject(t.subject_template || "");
    setBody(t.body_template);
  };

  const handleSave = async () => {
    if (!selected) return;
    await templateService.updateTemplate(selected.id, { subject_template: subject, body_template: body });
    setMsg("✓ Template changes saved and audited.");
    setTemplates(prev => prev.map(t => t.id === selected.id ? { ...t, subject_template: subject, body_template: body } : t));
    setTimeout(() => setMsg(""), 3000);
  };

  const parsePreview = () => {
    if (!selected) return "";
    const vars: Record<string, string> = {
      name: "Amit Sharma",
      username: "amit_sharma_98",
      contest: "JEE Physics Mastery Challenge",
      amount: "₹50,000",
    };
    return templateService.parseTemplate(body, vars);
  };

  const navLinks = [
    { label: "Overview", href: "/admin/communication/automation" },
    { label: "Templates", href: "/admin/communication/templates" },
    { label: "Campaigns", href: "/admin/communication/campaigns" },
    { label: "Workflows", href: "/admin/communication/workflows" },
    { label: "Queue", href: "/admin/communication/queue" },
    { label: "History", href: "/admin/communication/history" },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> Communication Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-sans">Manage all platform outreach — transactional templates, dynamic segments, scheduling campaigns, and queue workers.</p>
        </div>
        <button onClick={load} className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Nav Row */}
      <div className="flex flex-wrap gap-1.5 border-b border-border/30 pb-0.5 font-bold">
        {navLinks.map(({ label, href }) => (
          <Link key={href} href={href}
            className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
              href === "/admin/communication/templates" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Templates directory list */}
        <aside className="lg:col-span-4 space-y-2 overflow-y-auto max-h-[60vh] pr-1">
          {templates.map(t => (
            <button key={t.id} onClick={() => handleSelect(t)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1.5 transition-all ${
                selected?.id === t.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"
              }`}>
              <div className="font-bold text-foreground leading-tight">{t.title}</div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span className="font-mono">{t.id}</span>
                <span className="font-bold text-primary">{t.channel}</span>
              </div>
            </button>
          ))}
        </aside>

        {/* Editor & Previewer */}
        {selected ? (
          <section className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Editor fields */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-sm text-foreground flex items-center gap-1.5"><Edit3 className="w-4 h-4 text-primary" /> Template Editor</h3>
                <button onClick={handleSave}
                  className="h-8 px-4 rounded-xl bg-primary text-primary-foreground font-black text-[10px] hover:opacity-90">
                  Save Changes
                </button>
              </div>
              <div className="space-y-3 font-semibold text-xs">
                {selected.channel === "Email" && (
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1">Subject Header Template</label>
                    <input value={subject} onChange={e => setSubject(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background focus:outline-none" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1">Message Body Template</label>
                  <textarea value={body} onChange={e => setBody(e.target.value)} rows={7}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-background focus:outline-none resize-none font-mono text-[11px] leading-relaxed" />
                </div>
              </div>
            </div>

            {/* Previewer panel */}
            <div className="rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
              <h3 className="font-black text-sm text-foreground flex items-center gap-1.5"><Eye className="w-4 h-4 text-primary" /> Dynamic Preview</h3>
              <div className="p-4 rounded-2xl border border-border/60 bg-background/30 space-y-2 min-h-40 leading-relaxed text-[11px]">
                {selected.channel === "Email" && (
                  <div className="border-b border-border/20 pb-2 mb-2 font-bold text-foreground">
                    Subject: {subject.replace("{{name}}", "Amit Sharma")}
                  </div>
                )}
                <div className="whitespace-pre-wrap text-muted-foreground font-mono text-[10px]">
                  {parsePreview()}
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center text-muted-foreground/40 font-bold">Select a template to configure</div>
        )}
      </div>
    </div>
  );
}
