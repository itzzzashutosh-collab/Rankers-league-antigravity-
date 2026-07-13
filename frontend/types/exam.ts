export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "numerical"
  | "matrix_match"
  | "assertion_reason"
  | "subjective"
  | "programming"
  | "paragraph";

export type QuestionStatus = "not_visited" | "visited" | "answered" | "marked" | "answered_marked";

export interface ExamOption {
  id: string;
  text: Record<string, string>; // Language mapping, e.g. { English: "Option text", Hindi: "विकल्प पाठ" }
}

export interface MatrixItem {
  id: string;
  text: Record<string, string>;
}

export interface ExamQuestion {
  id: string;
  number: number;
  type: QuestionType;
  questionText: Record<string, string>;
  options?: ExamOption[];
  matrixLeft?: MatrixItem[]; // For Matrix Match (Column I)
  matrixRight?: MatrixItem[]; // For Matrix Match (Column II)
  supportingImage?: string;
  paragraph?: Record<string, string>; // For case study/paragraph questions
  equation?: string; // LaTeX or math markup string
}

export interface ExamSection {
  id: string;
  name: string; // e.g. "Physics", "General Studies"
  questionIds: string[];
}

export interface ExamPaper {
  contestId: string;
  sections: ExamSection[];
  questions: ExamQuestion[];
}

export interface CandidateResponse {
  questionId: string;
  answer: string | string[] | Record<string, string>; // string, string[], or Record<string, string>
  status: QuestionStatus;
  timeSpentSeconds: number;
}

export interface ExamSessionState {
  contestSlug: string;
  accessId: string;
  candidateName: string;
  selectedLanguage: string;
  currentQuestionId: string;
  currentSectionId: string;
  timeLeftSeconds: number;
  responses: Record<string, string | string[] | Record<string, string>>; // questionId -> answer
  statuses: Record<string, QuestionStatus>; // questionId -> status
  timeSpent: Record<string, number>; // questionId -> seconds
  connectionStatus: "connected" | "reconnecting" | "offline";
  cheatLogs: { timestamp: string; event: string; details: string }[];
}
