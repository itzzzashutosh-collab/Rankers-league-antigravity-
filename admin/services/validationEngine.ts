export interface ValidationLog {
  code: string;
  message: string;
  severity: "Warning" | "Critical";
}

export const validationEngine = {
  validate(question: {
    title: string;
    statement: string;
    marks: number;
    negative_marks: number;
    options: { option_index: string; content: string; is_correct: boolean }[];
  }): ValidationLog[] {
    const logs: ValidationLog[] = [];

    // Statement verification
    if (!question.statement || question.statement.trim().length < 5) {
      logs.push({
        code: "EMPTY_STATEMENT",
        message: "Question statement must contain detailed text content.",
        severity: "Critical"
      });
    }

    // Marks verification
    if (question.marks <= 0) {
      logs.push({
        code: "INVALID_MARKS",
        message: "Allocated marks must be greater than zero.",
        severity: "Critical"
      });
    }
    if (question.negative_marks > 0) {
      logs.push({
        code: "POSITIVE_NEGATIVE_MARKS",
        message: "Negative marking penalty should be less than or equal to zero.",
        severity: "Warning"
      });
    }

    // Options verification
    if (question.options.length < 2) {
      logs.push({
        code: "MISSING_OPTIONS",
        message: "At least 2 options are required for standard choice questions.",
        severity: "Critical"
      });
    }

    const correctCount = question.options.filter(o => o.is_correct).length;
    if (correctCount === 0) {
      logs.push({
        code: "MISSING_CORRECT_ANSWER",
        message: "No correct answer has been configured for this question.",
        severity: "Critical"
      });
    }

    // Check for empty option content
    const hasEmptyOption = question.options.some(o => !o.content || o.content.trim() === "");
    if (hasEmptyOption) {
      logs.push({
        code: "EMPTY_OPTION_TEXT",
        message: "All option contents must have text or LaTeX representations.",
        severity: "Critical"
      });
    }

    return logs;
  }
};
