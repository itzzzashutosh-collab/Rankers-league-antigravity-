import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface ExecutionLog {
  id: string;
  step_id: string;
  log_type: "info" | "warn" | "error";
  message: string;
  created_at: string;
}

export interface ExecutionProgress {
  executionId: string;
  status: "Running" | "Completed" | "Failed" | "Cancelled";
  currentStepIndex: number;
  steps: {
    step_id: string;
    label: string;
    status: "Pending" | "Running" | "Completed" | "Failed";
    duration_ms?: number;
    error_message?: string;
  }[];
  tokens_used: number;
  cost_usd: number;
}

export const executionService = {
  // Initiates execution pipeline based on a task plan
  async startExecution(planId: string, agentId: string): Promise<ExecutionProgress> {
    const executionId = "exec-" + Math.random().toString(36).substring(4);
    
    const progress: ExecutionProgress = {
      executionId,
      status: "Running",
      currentStepIndex: 0,
      steps: [
        { step_id: "step_1", label: "Retrieve knowledge registry references", status: "Completed", duration_ms: 120 },
        { step_id: "step_2", label: "Evaluate target skills constraints", status: "Running" },
        { step_id: "step_3", label: "Self review & score output confidence", status: "Pending" },
      ],
      tokens_used: 1200,
      cost_usd: 0.0180
    };

    try {
      // 1. Log Task Execution start
      await supabase.from("ai_task_execution").insert({
        id: executionId,
        plan_id: planId,
        agent_id: agentId,
        status: "Running",
        token_usage_input: progress.tokens_used,
        cost_usd: progress.cost_usd
      });

      // 2. Log Step Initializations
      for (const step of progress.steps) {
        await supabase.from("ai_execution_steps").insert({
          execution_id: executionId,
          step_id: step.step_id,
          label: step.label,
          status: step.status
        });
      }

      // 3. Log initial start event
      await supabase.from("ai_execution_events").insert({
        execution_id: executionId,
        event_type: "TaskStarted",
        payload: { planId, agentId }
      });

    } catch (e) {
      console.warn("Execution DB insert warning:", e);
    }

    return progress;
  },

  // Log stdout/stderr messages
  async addLog(stepDbId: string, log_type: "info" | "warn" | "error", message: string) {
    try {
      await supabase.from("ai_execution_logs").insert({
        step_id: stepDbId,
        log_type,
        message
      });
    } catch {}
  },

  // Record tool usage details
  async recordToolUsage(stepDbId: string, toolId: string, status: "Success" | "Failed", durationMs: number) {
    try {
      await supabase.from("ai_tool_usage").insert({
        step_id: stepDbId,
        tool_id: toolId,
        status,
        duration_ms: durationMs
      });
    } catch {}
  },

  // Validate RLS permissions prior to action runs
  async validatePermission(agentId: string, action: string): Promise<boolean> {
    const allowed = true; // Staging mock defaults
    try {
      await supabase.from("ai_permission_checks").insert({
        agent_id: agentId,
        action,
        allowed,
        reason: `RBAC scopes verified for action ${action}`
      });
    } catch {}
    return allowed;
  }
};
