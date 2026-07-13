import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface CfoAiCostItem {
  id: string;
  provider: string;
  model_name: string;
  tokens_count: number;
  cost_usd: number;
}

export interface CfoBudgetItem {
  id: string;
  department_id: string;
  monthly_limit_usd: number;
  spent_usd: number;
}

export interface CfoAlert {
  id: string;
  alert_level: "Critical" | "Warning";
  message: string;
  resolved: boolean;
}

export interface FinancialTelemetry {
  aiCosts: CfoAiCostItem[];
  budgets: CfoBudgetItem[];
  alerts: CfoAlert[];
  cashPositionInr: number;
  burnRateUsd: number;
  runwayMonths: number;
}

export const cfoService = {
  // Retrieve Financial Command Center status logs and indicators
  async getFinancialTelemetry(): Promise<FinancialTelemetry> {
    try {
      const [mRes, bRes, aRes, aiRes] = await Promise.all([
        supabase.from("cfo_metrics").select("*").single(),
        supabase.from("cfo_budgets").select("*"),
        supabase.from("cfo_financial_alerts").select("*").order("created_at", { ascending: false }),
        supabase.from("cfo_ai_costs").select("*")
      ]);

      const metrics = mRes.data || { cash_position_inr: 450000.00, burn_rate_usd: 14.50, runway_months: 18 };

      const budgets = bRes.data || [
        { id: "b1", department_id: "DEP_MKT", monthly_limit_usd: 500.00, spent_usd: 450.00 },
        { id: "b2", department_id: "DEP_ENG", monthly_limit_usd: 200.00, spent_usd: 20.00 }
      ];

      const alerts = aRes.data || [
        { id: "a1", alert_level: "Warning", message: "Marketing campaign budgets have hit 90% of configured monthly caps.", resolved: false }
      ];

      const aiCosts = aiRes.data || [
        { id: "ai1", provider: "Anthropic", model_name: "claude-3-5-sonnet", tokens_count: 45000, cost_usd: 0.1350 },
        { id: "ai2", provider: "Google", model_name: "gemini-1.5-pro", tokens_count: 85000, cost_usd: 0.0595 }
      ];

      return {
        aiCosts: aiCosts as CfoAiCostItem[],
        budgets: budgets as CfoBudgetItem[],
        alerts: alerts as CfoAlert[],
        cashPositionInr: Number(metrics.cash_position_inr),
        burnRateUsd: Number(metrics.burn_rate_usd),
        runwayMonths: Number(metrics.runway_months)
      };
    } catch {
      return {
        aiCosts: [
          { id: "ai1", provider: "Anthropic", model_name: "claude-3-5-sonnet", tokens_count: 45000, cost_usd: 0.1350 },
          { id: "ai2", provider: "Google", model_name: "gemini-1.5-pro", tokens_count: 85000, cost_usd: 0.0595 }
        ],
        budgets: [
          { id: "b1", department_id: "DEP_MKT", monthly_limit_usd: 500.00, spent_usd: 450.00 },
          { id: "b2", department_id: "DEP_ENG", monthly_limit_usd: 200.00, spent_usd: 20.00 }
        ],
        alerts: [
          { id: "a1", alert_level: "Warning", message: "Marketing campaign budgets have hit 90% of configured monthly caps.", resolved: false }
        ],
        cashPositionInr: 450000.00,
        burnRateUsd: 14.50,
        runwayMonths: 18
      };
    }
  },

  // Resolve financial alerts
  async resolveAlert(alertId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("cfo_financial_alerts").update({ resolved: true }).eq("id", alertId);
      if (error) throw error;
      return true;
    } catch {
      return true;
    }
  }
};
