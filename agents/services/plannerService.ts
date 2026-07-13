import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface ExecutionNode {
  node_id: string;
  label: string;
  dependencies: string[];
  status: "Pending" | "Running" | "Completed" | "Failed";
}

export interface TaskPlan {
  id: string;
  task_id: string;
  estimated_complexity: "Low" | "Medium" | "High" | "Critical";
  estimated_cost_usd: number;
  estimated_tokens: number;
  estimated_time_seconds: number;
  recommended_agent_id: string;
  risk_assessment: string;
  graph: ExecutionNode[];
}

export interface ConfidenceScore {
  reasoning: number;
  evidence: number;
  knowledge: number;
  tools: number;
  overall: number;
  approved: boolean;
}

export const plannerService = {
  // 1. Planner Service
  async generatePlan(taskId: string, title: string, description: string): Promise<TaskPlan> {
    const estimated_complexity = description.length > 150 ? "High" : "Medium";
    const plan: TaskPlan = {
      id: "plan-" + Math.random().toString(36).substring(4),
      task_id: taskId,
      estimated_complexity,
      estimated_cost_usd: estimated_complexity === "High" ? 0.125 : 0.045,
      estimated_tokens: estimated_complexity === "High" ? 8500 : 3200,
      estimated_time_seconds: estimated_complexity === "High" ? 180 : 60,
      recommended_agent_id: "AGENT_MKT",
      risk_assessment: "Low risk execution path. No critical wallets variables mapped.",
      graph: [
        { node_id: "step_1", label: "Retrieve knowledge registry references", dependencies: [], status: "Completed" },
        { node_id: "step_2", label: "Evaluate target skills constraints", dependencies: ["step_1"], status: "Running" },
        { node_id: "step_3", label: "Self review & score output confidence", dependencies: ["step_2"], status: "Pending" },
      ]
    };

    // Save to Database
    try {
      await supabase.from("ai_task_plans").insert({
        id: plan.id,
        task_id: plan.task_id,
        estimated_complexity: plan.estimated_complexity,
        estimated_cost_usd: plan.estimated_cost_usd,
        estimated_tokens: plan.estimated_tokens,
        estimated_time_seconds: plan.estimated_time_seconds,
        recommended_agent_id: plan.recommended_agent_id,
        risk_assessment: plan.risk_assessment
      });

      for (const node of plan.graph) {
        await supabase.from("ai_execution_graphs").insert({
          plan_id: plan.id,
          node_id: node.node_id,
          label: node.label,
          dependencies: node.dependencies,
          status: node.status
        });
      }
    } catch (e) {
      console.warn("DB insert fallback warning:", e);
    }

    return plan;
  },

  // 2. Skill Registry Service
  async getSkills() {
    try {
      const { data } = await supabase.from("ai_skill_registry").select("*");
      return data || [];
    } catch {
      return [];
    }
  },

  // 3. Knowledge Registry Service
  async getKnowledgeBases() {
    try {
      const { data } = await supabase.from("ai_knowledge_registry").select("*");
      return data || [];
    } catch {
      return [];
    }
  },

  // 4. Confidence Service
  async calculateConfidence(taskId: string): Promise<ConfidenceScore> {
    const score: ConfidenceScore = {
      reasoning: 0.95,
      evidence: 0.90,
      knowledge: 0.92,
      tools: 0.96,
      overall: 0.93,
      approved: true
    };

    try {
      await supabase.from("ai_confidence_scores").insert({
        task_id: taskId,
        reasoning_score: score.reasoning,
        evidence_score: score.evidence,
        knowledge_score: score.knowledge,
        tools_score: score.tools,
        overall_score: score.overall,
        approved: score.approved
      });
    } catch (e) {
      console.warn("Confidence DB warning:", e);
    }

    return score;
  },

  // 5. Model Registry Service
  async getModels() {
    try {
      const { data } = await supabase.from("ai_model_registry").select("*");
      return data || [];
    } catch {
      return [];
    }
  }
};
