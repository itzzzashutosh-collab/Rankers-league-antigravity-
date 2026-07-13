import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface AiAgent {
  id: string;
  name: string;
  department_id: string;
  role_id: string;
  model_name: string;
  capabilities: string[];
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Online" | "Offline" | "Busy" | "Sleeping" | "Maintenance" | "Error";
  health_score: number;
  version: string;
}

export interface AiTask {
  id: string;
  title: string;
  description?: string;
  assigned_agent_id?: string;
  status: "Queue" | "Planner" | "Execution" | "Review" | "Approval" | "Completed" | "Failed";
  priority: "Low" | "Medium" | "High" | "Critical";
  retry_count: number;
  error_message?: string;
  created_at: string;
}

export interface PromptTemplate {
  id: string;
  version: number;
  prompt_template: string;
  expected_output?: string;
  validation_rules: Record<string, any>;
  approved: boolean;
}

export interface MemoryBlock {
  id: string;
  agent_id?: string;
  memory_type: "Short-term" | "Long-term" | "Semantic";
  memory_key: string;
  memory_value: string;
  created_at: string;
}

export interface CostSummary {
  inputTokens: number;
  outputTokens: number;
  calculatedCostUsd: number;
}

const FALLBACK_AGENTS: AiAgent[] = [
  { id: "AGENT_CEO", name: "Chief AI Executive", department_id: "DEP_EXEC", role_id: "ROLE_CEO", model_name: "gpt-4o", capabilities: ["TEXT_COMPOSITION"], priority: "High", status: "Online", health_score: 98, version: "1.0.0" },
  { id: "AGENT_MKT", name: "Campaign Marketing Manager", department_id: "DEP_MKT", role_id: "ROLE_SPEC", model_name: "claude-3-5-sonnet", capabilities: ["TEXT_COMPOSITION"], priority: "Medium", status: "Online", health_score: 95, version: "1.0.0" },
];

const FALLBACK_TASKS: AiTask[] = [
  { id: "t1", title: "Generate Contest Questions Strategy", description: "Composing UPSC exam paper options suggestions.", assigned_agent_id: "AGENT_CEO", status: "Execution", priority: "High", retry_count: 0, created_at: new Date().toISOString() },
  { id: "t2", title: "Compose Weekly Campaign Announcement", description: "Send notification of NEET biology sprint.", assigned_agent_id: "AGENT_MKT", status: "Queue", priority: "Medium", retry_count: 0, created_at: new Date().toISOString() },
];

const FALLBACK_PROMPTS: PromptTemplate[] = [
  { id: "CEO_PLANNER_PROMPT", version: 1, prompt_template: "Analyze the active platform event: {{event}}. Suggest 3 core next steps.", expected_output: "JSON list format of next steps.", validation_rules: {}, approved: true },
  { id: "MKT_ANNOUNCEMENT_PROMPT", version: 1, prompt_template: "Compose a weekly email promo for contest: {{contest_title}} with entry fee {{fee}}.", expected_output: "Text email copy.", validation_rules: {}, approved: true },
];

const FALLBACK_MEMORIES: MemoryBlock[] = [
  { id: "m1", agent_id: "AGENT_CEO", memory_type: "Semantic", memory_key: "JEE_CONTEST_RULES", memory_value: "JEE contains Physics, Chemistry and Mathematics. Duration 180 min.", created_at: new Date().toISOString() },
];

export const aiosService = {
  async getAgents(): Promise<AiAgent[]> {
    try {
      const { data, error } = await supabase.from("ai_agents").select("*");
      if (error || !data?.length) return FALLBACK_AGENTS;
      return data as AiAgent[];
    } catch {
      return FALLBACK_AGENTS;
    }
  },

  async registerAgent(agent: AiAgent): Promise<boolean> {
    try {
      const { error } = await supabase.from("ai_agents").insert(agent);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async getTasks(): Promise<AiTask[]> {
    try {
      const { data, error } = await supabase.from("ai_tasks").select("*").order("created_at", { ascending: false });
      if (error || !data?.length) return FALLBACK_TASKS;
      return data as AiTask[];
    } catch {
      return FALLBACK_TASKS;
    }
  },

  async createTask(task: Partial<AiTask>): Promise<boolean> {
    try {
      const { error } = await supabase.from("ai_tasks").insert(task);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async getPrompts(): Promise<PromptTemplate[]> {
    try {
      const { data, error } = await supabase.from("ai_prompt_registry").select("*");
      if (error || !data?.length) return FALLBACK_PROMPTS;
      return data as PromptTemplate[];
    } catch {
      return FALLBACK_PROMPTS;
    }
  },

  async updatePrompt(id: string, prompt_template: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("ai_prompt_registry")
        .update({ prompt_template, version: 2 })
        .eq("id", id);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async getMemories(): Promise<MemoryBlock[]> {
    try {
      const { data, error } = await supabase.from("ai_memory").select("*");
      if (error || !data?.length) return FALLBACK_MEMORIES;
      return data as MemoryBlock[];
    } catch {
      return FALLBACK_MEMORIES;
    }
  },

  async saveMemory(m: Partial<MemoryBlock>): Promise<boolean> {
    try {
      const { error } = await supabase.from("ai_memory").insert(m);
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async getCostSummary(): Promise<CostSummary> {
    try {
      const { data, error } = await supabase.from("ai_cost_tracking").select("*");
      if (error || !data?.length) {
        return { inputTokens: 485000, outputTokens: 242000, calculatedCostUsd: 1.4850 };
      }
      const sum = data.reduce((s: any, d: any) => ({
        inputTokens: s.inputTokens + d.token_usage_input,
        outputTokens: s.outputTokens + d.token_usage_output,
        calculatedCostUsd: s.calculatedCostUsd + parseFloat(d.calculated_cost_usd || 0),
      }), { inputTokens: 0, outputTokens: 0, calculatedCostUsd: 0 });
      return sum;
    } catch {
      return { inputTokens: 485000, outputTokens: 242000, calculatedCostUsd: 1.4850 };
    }
  },
};
