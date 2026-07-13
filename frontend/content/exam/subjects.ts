import { ExamSection } from "../../types/exam";

export const examSubjectsContent: Record<string, ExamSection[]> = {
  "upsc-elite-live": [
    {
      id: "gs-1",
      name: "General Studies",
      questionIds: ["upsc-q1", "upsc-q2", "upsc-q3", "upsc-q4", "upsc-q5"]
    },
    {
      id: "csat-1",
      name: "Aspirant Aptitude (CSAT)",
      questionIds: ["upsc-q6", "upsc-q7", "upsc-q8"]
    }
  ],
  "jee-advanced-live": [
    {
      id: "physics-1",
      name: "Physics Section",
      questionIds: ["jee-q1", "jee-q2", "jee-q3"]
    },
    {
      id: "chemistry-1",
      name: "Chemistry Section",
      questionIds: ["jee-q4", "jee-q5"]
    },
    {
      id: "maths-1",
      name: "Mathematics Section",
      questionIds: ["jee-q6", "jee-q7"]
    }
  ],
  "default": [
    {
      id: "section-a",
      name: "General Knowledge",
      questionIds: ["default-q1", "default-q2"]
    }
  ]
};
export default examSubjectsContent;
