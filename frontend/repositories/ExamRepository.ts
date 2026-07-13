import { ExamPaper, ExamSessionState, QuestionStatus } from "../types/exam";
import { examQuestionsContent } from "../content/exam/questions";
import { examSubjectsContent } from "../content/exam/subjects";

export interface ExamRepository {
  getExamPaper(contestSlug: string): Promise<ExamPaper>;
  loadSessionState(contestSlug: string, accessId: string): Promise<ExamSessionState | null>;
  saveSessionState(state: ExamSessionState): Promise<void>;
  clearSessionState(contestSlug: string): Promise<void>;
}

export class MockExamRepository implements ExamRepository {
  async getExamPaper(contestSlug: string): Promise<ExamPaper> {
    // Generate section configuration based on contestSlug
    let sections = examSubjectsContent["default"];
    if (examSubjectsContent[contestSlug]) {
      sections = examSubjectsContent[contestSlug];
    }

    // Filter questions mapped to this contest categories
    const contestQuestions = examQuestionsContent[contestSlug] || examQuestionsContent["default"] || [];

    return {
      contestId: contestSlug,
      sections,
      questions: contestQuestions,
    };
  }

  async loadSessionState(contestSlug: string, accessId: string): Promise<ExamSessionState | null> {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(`exam-session-${contestSlug}`);
    if (!data) return null;

    try {
      const state = JSON.parse(data) as ExamSessionState;
      if (state.accessId === accessId) {
        return state;
      }
      return null;
    } catch {
      return null;
    }
  }

  async saveSessionState(state: ExamSessionState): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.setItem(`exam-session-${state.contestSlug}`, JSON.stringify(state));
  }

  async clearSessionState(contestSlug: string): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`exam-session-${contestSlug}`);
  }
}

export const examRepository: ExamRepository = new MockExamRepository();
export default examRepository;
