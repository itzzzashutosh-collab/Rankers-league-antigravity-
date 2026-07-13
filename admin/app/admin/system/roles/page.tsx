"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, Plus, Users, Trash } from "lucide-react";
import { rbacService, Role } from "@/services/rbacService";

export default function RoleBuilderPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const data = await rbacService.getRoles();
    setRoles(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!name.trim()) { setMsg("❌ Role name is required."); return; }
    await rbacService.createRole(name, desc);
    setMsg(`✓ Role "${name}" created successfully.`);
    setName("");
    setDesc("");
    await load();
    setTimeout(() => setMsg(""), 3000);
  };

  const handleDelete = async (id: string, roleName: string) => {
    if (!confirm(`Delete role "${roleName}"? This action cannot be undone.`)) return;
    await rbacService.deleteRole(id);
    setRoles(prev => prev.filter(r => r.id !== id));
    setMsg(`✓ Role "${roleName}" deleted.`);
    setTimeout(() => setMsg(""), 3000);
  };

  const navLinks = [
    { label: "General", href: "/admin/system/general" },
    { label: "Platform Rules", href: "/admin/system/platform" },
    { label: "Security", href: "/admin/system/security" },
    { label: "Role Builder", href: "/admin/system/roles" },
    { label: "Permission Matrix", href: "/admin/system/permissions" },
    { label: "Storage", href: "/admin/system/storage" },
    { label: "Background Workers", href: "/admin/system/jobs" },
    { label: "Logs Console", href: "/admin/system/logs" },
    { label: "Backup Control", href: "/admin/system/backups" },
    { label: "Env Context", href: "/admin/system/environment" },
    { label: "Maintenance", href: "/admin/system/maintenance" },
  ];

  return (
    <div className="space-y-6 text-foreground animate-fade-in pb-12 font-semibold text-xs">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <h1 className="text-lg font-black flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Platform Operating Center
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Control the complete Ranker's League system without altering any source code files.</p>
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
              href === "/admin/system/roles" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
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
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card/15 p-6 space-y-4">
          <h2 className="font-black text-sm text-foreground flex items-center gap-1.5"><Plus className="w-4 h-4 text-primary" /> Create Custom Role</h2>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Role Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Content Reviewer"
                className="w-full h-10 px-3 rounded-xl border border-border bg-background/50 focus:outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground uppercase font-black block mb-1.5">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                placeholder="Scope and purpose of this security role..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background/50 focus:outline-none resize-none" />
            </div>
            <button onClick={handleCreate}
              className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-black hover:opacity-90 transition-opacity">
              Add New Role
            </button>
          </div>
        </div>

        {/* Directory list */}
        <div className="lg:col-span-7 rounded-3xl border border-border bg-card/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-border/40 flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-black text-sm text-foreground">Role Directory</h2>
          </div>
          <div className="divide-y divide-border/40">
            {roles.map(r => (
              <div key={r.id} className="p-4 flex items-center justify-between gap-4 hover:bg-card/10 transition-colors">
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground block">{r.name}</span>
                  <span className="text-[10px] text-muted-foreground block">{r.description || "No description provided."}</span>
                </div>
                {!["Super Admin", "Contest Manager", "Moderator"].includes(r.name) && (
                  <button onClick={() => handleDelete(r.id, r.name)}
                    className="p-2 rounded-lg border border-destructive/20 bg-destructive/5 hover:bg-destructive/15 text-destructive">
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
