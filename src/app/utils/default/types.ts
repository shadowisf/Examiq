export type ExamItem = {
  id: number;
  type: string;
  question: string;
  choices?: string[];
  studentAnswer?: string;
  correctAnswer: string;
};
