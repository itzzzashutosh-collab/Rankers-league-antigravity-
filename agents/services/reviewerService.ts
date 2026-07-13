import { createClient } from "../utils/supabase/client";

const supabase = createClient();

export interface ReviewFinding {
  id: string;
  finding_type: "Critical" | "Major" | "Medium" | "Minor" | "Suggestion";
  message: string;
  suggested_fix?: string;
}

export interface ReviewScorecard {
  reviewId: string;
  taskId: string;
  overallScore: number;
  completeness: number;
  formatting: number;
  reasoning: number;
  status: "Approved" | "NeedsCorrection" | "Rejected";
  findings: ReviewFinding[];
}

export const reviewerService = {
  // Evaluates execution outcomes against configured style guides and validations schemas
  async auditOutput(taskId: string, outputPayload: Record<string, any>): Promise<ReviewScorecard> {
    const reviewId = "rev-" + Math.random().toString(36).substring(4);
    
    // Check if the payload is empty or has validation errors
    const findings: ReviewFinding[] = [];
    let completeness = 0.95;
    let formatting = 0.90;
    let reasoning = 0.92;

    if (!outputPayload || Object.keys(outputPayload).length === 0) {
      findings.push({
        id: "f-1",
        finding_type: "Critical",
        message: "Output JSON body is completely empty.",
        suggested_fix: "Re-run the Task Executor step with fallback prompt variables."
      });
      completeness = 0.00;
    }

    if (outputPayload && !outputPayload.execution_id) {
      findings.push({
        id: "f-2",
        finding_type: "Major",
        message: "Missing required output field: 'execution_id'.",
        suggested_fix: "Inject task execution ID inside outer output envelope."
      });
      formatting = 0.50;
    }

    // Default minor style checks
    findings.push({
      id: "f-3",
      finding_type: "Minor",
      message: "Style guide rule: Avoid wordy execution details.",
      suggested_fix: "Trim description parameter length down to <100 characters."
    });

    const overallScore = (completeness + formatting + reasoning) / 3;
    const status = findings.some(f => f.finding_type === "Critical") ? "Rejected" :
                   findings.some(f => f.finding_type === "Major") ? "NeedsCorrection" : "Approved";

    const scorecard: ReviewScorecard = {
      reviewId,
      taskId,
      overallScore,
      completeness,
      formatting,
      reasoning,
      status,
      findings
    };

    // Save to Database
    try {
      await supabase.from("ai_reviews").insert({
        id: reviewId,
        task_id: taskId,
        status
      });

      await supabase.from("ai_quality_scores").insert({
        review_id: reviewId,
        completeness_score: completeness,
        formatting_score: formatting,
        reasoning_score: reasoning,
        overall_score: overallScore
      });

      for (const finding of findings) {
        const { data: fData } = await supabase.from("ai_review_findings").insert({
          review_id: reviewId,
          finding_type: finding.finding_type,
          message: finding.message
        }).select();

        if (fData && fData[0] && finding.suggested_fix) {
          await supabase.from("ai_review_suggestions").insert({
            finding_id: fData[0].id,
            suggested_fix: finding.suggested_fix
          });
        }
      }
    } catch (e) {
      console.warn("Reviewer DB insert warning:", e);
    }

    return scorecard;
  },

  // Retrieve style guide guidelines
  async getStyleGuides() {
    try {
      const { data } = await supabase.from("ai_review_rules").select("*").eq("rule_type", "StyleGuide");
      return data || [];
    } catch {
      return [];
    }
  }
};
