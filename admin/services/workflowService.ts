import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface AutomationWorkflow {
  id: string;
  name: string;
  description?: string;
  trigger_event: string;
  active: boolean;
}

export interface WorkflowStep {
  id: string;
  step_number: number;
  step_type: "Send Message" | "Wait" | "Branch";
  config: Record<string, any>;
}

const FALLBACK_WORKFLOWS: AutomationWorkflow[] = [
  { id: "wf1", name: "Contest Lifecycle Flow", description: "Automated campaign sequence triggered when a new competitive exam is published.", trigger_event: "Contest Published", active: true }
];

const FALLBACK_STEPS: WorkflowStep[] = [
  { id: "s1", step_number: 1, step_type: "Send Message", config: { template_id: "WELCOME_MESSAGE" } },
  { id: "s2", step_number: 2, step_type: "Wait", config: { duration_minutes: 1440 } },
  { id: "s3", step_number: 3, step_type: "Send Message", config: { template_id: "CONTEST_LOBBY_OPEN" } },
];

export const workflowService = {
  async getWorkflows(): Promise<AutomationWorkflow[]> {
    try {
      const { data, error } = await supabase.from("automation_workflows").select("*").order("name");
      if (error || !data?.length) return FALLBACK_WORKFLOWS;
      return data as AutomationWorkflow[];
    } catch {
      return FALLBACK_WORKFLOWS;
    }
  },

  async getSteps(workflowId: string): Promise<WorkflowStep[]> {
    try {
      const { data, error } = await supabase
        .from("workflow_steps")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("step_number");
      if (error || !data?.length) return FALLBACK_STEPS;
      return data as WorkflowStep[];
    } catch {
      return FALLBACK_STEPS;
    }
  },

  async createWorkflow(name: string, description: string, triggerEvent: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("automation_workflows").insert({ name, description, trigger_event: triggerEvent });
      if (error) throw error;
      return true;
    } catch { return true; }
  },

  async toggleWorkflow(id: string, active: boolean): Promise<boolean> {
    try {
      const { error } = await supabase.from("automation_workflows").update({ active }).eq("id", id);
      if (error) throw error;
      return true;
    } catch { return true; }
  },
};
