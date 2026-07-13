"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, RefreshCw, Send, Users } from "lucide-react";
import { campaignService, Campaign, AudienceSegment } from "@/services/campaignService";
import { templateService, CommTemplate } from "@/services/templateService";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [audiences, setAudiences] = useState<AudienceSegment[]>([]);
  const [templates, setTemplates] = useState<CommTemplate[]>([]);
  const [title, setTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const [camps, auds, tpls] = await Promise.all([
      campaignService.getCampaigns(),
      campaignService.getAudiences(),
      templateService.getTemplates(),
    ]);
    setCampaigns(camps);
    setAudiences(auds);
    setTemplates(tpls);
    if (tpls.length > 0) setSelectedTemplate(tpls[0].id);
    if (auds.length > 0) setSelectedAudience(auds[0].id);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreateCampaign = async () => {
    if (!title.trim()) { setMsg("❌ Campaign title is required."); return; }
    setLoading(true);
    await campaignService.createCampaign({
      title,
      template_id: selectedTemplate,
      audience_segment_id: selectedAudience,
      schedule_type: "Immediate",
      status: "Completed",
    });
    setMsg("✓ Campaign created and dispatched to message queue.");
    setTitle("");
    await load();
    setTimeout(() => setMsg(""), 3000);
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
              href === "/admin/communication/campaigns" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creator */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4 font-sans">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Send className="w-4 h-4 text-primary" /> Launch Campaign</h2>
          <div className="space-y-3 font-semibold text-xs">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Campaign Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Festival Championship Promo"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Select Template</label>
              <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
                {templates.map(t => <option key={t.id} value={t.id}>{t.title} ({t.channel})</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Target Audience Segment</label>
              <select value={selectedAudience} onChange={e => setSelectedAudience(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none">
                {audiences.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <button onClick={handleCreateCampaign}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black text-xs hover:opacity-90 transition-opacity">
              Dispatch Campaign Immediately
            </button>
          </div>
        </div>

        {/* Campaign Lists */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-black text-sm text-foreground">Campaign Audit Logs</h2>
          </div>
          <div className="overflow-x-auto text-[10px]">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/30 text-[9px] font-black uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="p-3">Campaign</th>
                  <th className="p-3">Audience Segment</th>
                  <th className="p-3">Schedule</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {campaigns.map(c => {
                  const targetAud = audiences.find(a => a.id === c.audience_segment_id)?.name || "Target Audience";
                  return (
                    <tr key={c.id} className="hover:bg-card/25 transition-colors">
                      <td className="p-3 font-bold text-foreground truncate max-w-xs">{c.title}</td>
                      <td className="p-3 text-muted-foreground">{targetAud}</td>
                      <td className="p-3 text-muted-foreground">{c.schedule_type}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[8px] font-black border px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          c.status === "Completed" ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" : "text-amber-400 border-amber-500/20 bg-amber-500/5"
                        }`}>{c.status}</span>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
