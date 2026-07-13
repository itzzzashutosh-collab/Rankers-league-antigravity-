"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Settings, RefreshCw, CheckSquare, Square } from "lucide-react";
import { rbacService, Role, Permission } from "@/services/rbacService";

export default function PermissionMatrixPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activePerms, setActivePerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    const [rList, pList] = await Promise.all([
      rbacService.getRoles(),
      rbacService.getPermissions(),
    ]);
    setRoles(rList);
    setPermissions(pList);
    if (rList.length > 0) {
      setSelectedRole(rList[0]);
      const active = await rbacService.getRolePermissions(rList[0].id);
      setActivePerms(active);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleRoleSelect = async (role: Role) => {
    setSelectedRole(role);
    setLoading(true);
    const active = await rbacService.getRolePermissions(role.id);
    setActivePerms(active);
    setLoading(false);
  };

  const handleToggle = (permissionId: string) => {
    setActivePerms(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSave = async () => {
    if (!selectedRole) return;
    setLoading(true);
    await rbacService.saveRolePermissions(selectedRole.id, activePerms);
    setMsg(`✓ Permissions saved for role ${selectedRole.name}.`);
    setLoading(false);
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
              href === "/admin/system/permissions" ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {msg && (
        <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] font-bold">{msg}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Role Selector List */}
        <aside className="lg:col-span-4 space-y-2">
          {roles.map(r => (
            <button key={r.id} onClick={() => handleRoleSelect(r)}
              className={`w-full p-4 rounded-2xl border text-left space-y-1 transition-all ${
                selectedRole?.id === r.id ? "border-primary bg-primary/5" : "border-border/60 bg-card/10 hover:bg-card/20"
              }`}>
              <div className="font-bold text-foreground truncate">{r.name}</div>
              <div className="text-[9px] text-muted-foreground truncate">{r.description || "No description"}</div>
            </button>
          ))}
        </aside>

        {/* Matrix Grid */}
        <section className="lg:col-span-8 rounded-3xl border border-border bg-card/15 p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-black text-sm text-foreground">Permissions for {selectedRole?.name}</h2>
            <button onClick={handleSave}
              className="h-9 px-4 rounded-xl bg-primary text-primary-foreground font-black text-[10px] hover:opacity-90 transition-opacity">
              Save Perms
            </button>
          </div>

          <div className="space-y-2">
            {permissions.map(p => {
              const checked = activePerms.includes(p.id);
              return (
                <button key={p.id} onClick={() => handleToggle(p.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between font-semibold ${
                    checked ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted/10 bg-background/25"
                  }`}>
                  <div className="space-y-0.5">
                    <span className="font-mono text-xs font-bold text-foreground block">{p.id}</span>
                    <span className="text-[10px] text-muted-foreground block">{p.description}</span>
                  </div>
                  {checked ? <CheckSquare className="w-4 h-4 text-primary shrink-0" /> : <Square className="w-4 h-4 text-muted-foreground/40 shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
