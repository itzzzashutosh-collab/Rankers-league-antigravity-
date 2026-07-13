export interface BlueprintRule {
  subject: string;
  target_count: number;
  difficulty_mix: { Easy?: number; Medium?: number; Hard?: number };
}

export interface BlueprintValidationResult {
  is_complete: boolean;
  missing_slots_count: number;
  details: { subject: string; target: number; current: number; status: "Complete" | "Incomplete" }[];
}

export const blueprintEngine = {
  validate(
    rules: BlueprintRule[],
    questions: { subject: string; difficulty: string }[]
  ): BlueprintValidationResult {
    let missing_slots_count = 0;
    const details = rules.map(rule => {
      const current = questions.filter(q => q.subject.toLowerCase() === rule.subject.toLowerCase()).length;
      const status = current >= rule.target_count ? "Complete" : "Incomplete";
      if (status === "Incomplete") {
        missing_slots_count += (rule.target_count - current);
      }
      return {
        subject: rule.subject,
        target: rule.target_count,
        current,
        status: status as any
      };
    });

    return {
      is_complete: missing_slots_count === 0,
      missing_slots_count,
      details
    };
  }
};
