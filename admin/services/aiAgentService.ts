import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface AiAgent {
  id: string;
  name: string;
  department_id: string;
  role_id: string;
  model_name: string;
  capabilities: string[];
  priority: string;
  status: string;
  health_score: number;
  version: string;
}

export interface AiTaskPlan {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  estimated_cost_usd: number;
  assigned_agent_id: string;
  created_at: string;
}

export const aiAgentService = {
  async getAgents(): Promise<AiAgent[]> {
    try {
      const { data, error } = await supabase.from("ai_agents").select("*");
      if (error || !data || data.length === 0) {
        return [
          { id: "AGENT_CEO", name: "Chief AI Executive", department_id: "DEP_EXEC", role_id: "ROLE_CEO", model_name: "gpt-4o", capabilities: ["planning", "reasoning"], priority: "High", status: "Online", health_score: 98, version: "1.0.0" },
          { id: "AGENT_EXECUTOR", name: "Universal Task Executor", department_id: "DEP_EXEC", role_id: "ROLE_WRK", model_name: "gpt-4o", capabilities: ["tool-use", "execution"], priority: "High", status: "Online", health_score: 97, version: "1.0.0" },
          { id: "AGENT_REVIEWER", name: "Quality Auditor Reviewer", department_id: "DEP_EXEC", role_id: "ROLE_SPEC", model_name: "gpt-4o", capabilities: ["review", "reflection"], priority: "Medium", status: "Online", health_score: 96, version: "1.0.0" },
          { id: "AGENT_VERIFIER", name: "Trust Fact Verifier", department_id: "DEP_EXEC", role_id: "ROLE_SPEC", model_name: "gpt-4o", capabilities: ["verification", "fact_validation"], priority: "High", status: "Online", health_score: 99, version: "1.0.0" },
          { id: "AGENT_MKT", name: "Campaign Marketing Manager", department_id: "DEP_MKT", role_id: "ROLE_SPEC", model_name: "claude-3-5-sonnet", capabilities: ["marketing", "communication"], priority: "Medium", status: "Online", health_score: 95, version: "1.0.0" }
        ];
      }
      return data as AiAgent[];
    } catch {
      return [
        { id: "AGENT_CEO", name: "Chief AI Executive", department_id: "DEP_EXEC", role_id: "ROLE_CEO", model_name: "gpt-4o", capabilities: ["planning", "reasoning"], priority: "High", status: "Online", health_score: 98, version: "1.0.0" },
        { id: "AGENT_EXECUTOR", name: "Universal Task Executor", department_id: "DEP_EXEC", role_id: "ROLE_WRK", model_name: "gpt-4o", capabilities: ["tool-use", "execution"], priority: "High", status: "Online", health_score: 97, version: "1.0.0" },
        { id: "AGENT_REVIEWER", name: "Quality Auditor Reviewer", department_id: "DEP_EXEC", role_id: "ROLE_SPEC", model_name: "gpt-4o", capabilities: ["review", "reflection"], priority: "Medium", status: "Online", health_score: 96, version: "1.0.0" },
        { id: "AGENT_VERIFIER", name: "Trust Fact Verifier", department_id: "DEP_EXEC", role_id: "ROLE_SPEC", model_name: "gpt-4o", capabilities: ["verification", "fact_validation"], priority: "High", status: "Online", health_score: 99, version: "1.0.0" },
        { id: "AGENT_MKT", name: "Campaign Marketing Manager", department_id: "DEP_MKT", role_id: "ROLE_SPEC", model_name: "claude-3-5-sonnet", capabilities: ["marketing", "communication"], priority: "Medium", status: "Online", health_score: 95, version: "1.0.0" }
      ];
    }
  },

  async getRecentTaskPlans(): Promise<AiTaskPlan[]> {
    try {
      const { data, error } = await supabase.from("ai_tasks").select("*").order("created_at", { ascending: false });
      if (error || !data || data.length === 0) {
        return [
          { id: "p1", title: "JEE Advanced Physics Grandmaster Plan", description: "Retrieve exam rules, calculate candidate counts, draft notification broadcast.", status: "Execution", priority: "High", estimated_cost_usd: 0.125, assigned_agent_id: "AGENT_CEO", created_at: new Date().toISOString() },
          { id: "p2", title: "NEET Biology Promo Campaign Campaign Dispatch", description: "Generate promotional email for NEET Biology Sprint.", status: "Completed", priority: "Medium", estimated_cost_usd: 0.045, assigned_agent_id: "AGENT_MKT", created_at: new Date().toISOString() }
        ];
      }
      
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        status: item.status,
        priority: item.priority || "Medium",
        estimated_cost_usd: item.payload?.estimated_cost_usd || 0.05,
        assigned_agent_id: item.assigned_agent_id || "AGENT_MKT",
        created_at: item.created_at
      }));
    } catch {
      return [
        { id: "p1", title: "JEE Advanced Physics Grandmaster Plan", description: "Retrieve exam rules, calculate candidate counts, draft notification broadcast.", status: "Execution", priority: "High", estimated_cost_usd: 0.125, assigned_agent_id: "AGENT_CEO", created_at: new Date().toISOString() },
        { id: "p2", title: "NEET Biology Promo Campaign Campaign Dispatch", description: "Generate promotional email for NEET Biology Sprint.", status: "Completed", priority: "Medium", estimated_cost_usd: 0.045, assigned_agent_id: "AGENT_MKT", created_at: new Date().toISOString() }
      ];
    }
  },

  async getPrompts() {
    try {
      const { data, error } = await supabase.from("ai_prompt_registry").select("*");
      if (error || !data || data.length === 0) {
        return [
          { id: "CEO_PLANNER_PROMPT", version: 1, prompt_template: "Analyze active event: {{event}}. Suggest next steps.", expected_output: "JSON list" },
          { id: "MKT_ANNOUNCEMENT_PROMPT", version: 1, prompt_template: "Compose promo email for: {{contest_title}}.", expected_output: "Email text copy" }
        ];
      }
      return data;
    } catch {
      return [
        { id: "CEO_PLANNER_PROMPT", version: 1, prompt_template: "Analyze active event: {{event}}. Suggest next steps.", expected_output: "JSON list" },
        { id: "MKT_ANNOUNCEMENT_PROMPT", version: 1, prompt_template: "Compose promo email for: {{contest_title}}.", expected_output: "Email text copy" }
      ];
    }
  }
};
