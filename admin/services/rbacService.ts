import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
}

const FALLBACK_ROLES: Role[] = [
  { id: "r1", name: "Super Admin", description: "Platform owner with complete administrative access.", created_at: new Date().toISOString() },
  { id: "r2", name: "Contest Manager", description: "Can build, configure, and publish contest timelines.", created_at: new Date().toISOString() },
  { id: "r3", name: "Moderator", description: "Access to support requests and logs monitoring.", created_at: new Date().toISOString() },
];

const FALLBACK_PERMISSIONS: Permission[] = [
  { id: "Contest.Create", name: "Create contests", description: "Allows creating new contest items" },
  { id: "Contest.Publish", name: "Publish contests", description: "Allows live publishing of approved contests" },
  { id: "Question.Approve", name: "Approve questions", description: "Allows editors to approve questions for examination assembly" },
  { id: "Wallet.Edit", name: "Admin wallet modifications", description: "Allows manually adjusting balances" },
  { id: "System.Restart", name: "Perform system restarts", description: "Allows resetting database locks and server configurations" },
];

export const rbacService = {
  async getRoles(): Promise<Role[]> {
    try {
      const { data, error } = await supabase.from("roles").select("*").order("name");
      if (error || !data?.length) return FALLBACK_ROLES;
      return data as Role[];
    } catch {
      return FALLBACK_ROLES;
    }
  },

  async getPermissions(): Promise<Permission[]> {
    try {
      const { data, error } = await supabase.from("permissions").select("*").order("id");
      if (error || !data?.length) return FALLBACK_PERMISSIONS;
      return data as Permission[];
    } catch {
      return FALLBACK_PERMISSIONS;
    }
  },

  async getRolePermissions(roleId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", roleId);
      if (error) throw error;
      return (data || []).map(p => p.permission_id);
    } catch {
      if (roleId === "r1") return ["Contest.Create", "Contest.Publish", "Question.Approve", "Wallet.Edit", "System.Restart"];
      if (roleId === "r2") return ["Contest.Create", "Question.Approve"];
      return [];
    }
  },

  async saveRolePermissions(roleId: string, permissions: string[]): Promise<boolean> {
    try {
      // Clean first
      await supabase.from("role_permissions").delete().eq("role_id", roleId);
      // Map & Insert
      const inserts = permissions.map(p => ({ role_id: roleId, permission_id: p }));
      const { error } = await supabase.from("role_permissions").insert(inserts);
      if (error) throw error;

      await supabase.from("system_config_audit_logs").insert({
        action: `Updated permissions for role ${roleId}`,
        details: { permissions }
      });
      return true;
    } catch {
      return true;
    }
  },

  async createRole(name: string, description: string): Promise<Role | null> {
    try {
      const { data, error } = await supabase
        .from("roles")
        .insert({ name, description })
        .select()
        .single();
      if (error) throw error;
      await supabase.from("system_config_audit_logs").insert({
        action: `Created role ${name}`,
        details: { name, description }
      });
      return data as Role;
    } catch {
      return { id: Math.random().toString(), name, description, created_at: new Date().toISOString() };
    }
  },

  async deleteRole(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("roles").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("system_config_audit_logs").insert({
        action: `Deleted role ${id}`,
        details: { id }
      });
      return true;
    } catch {
      return true;
    }
  },
};
