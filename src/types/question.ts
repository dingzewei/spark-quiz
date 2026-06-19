export type QuestionType = 'fill' | 'boolean' | 'single' | 'multiple' | 'essay' | 'code';

export interface Option {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  stem: string;
  options?: Option[];
  answer: string | string[] | boolean | null;
  explanation: string;
}

export interface Chapter {
  id: string;
  name: string;
  questions: Question[];
}

export interface QuizData {
  meta: {
    subject: string;
    version: string;
    totalQuestions: number;
  };
  chapters: Chapter[];
}

export interface AnswerRecord {
  selected: string | string[] | boolean | null;
  correct: boolean;
  timestamp: number;
}

export interface ExamRecord {
  id: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  duration: number;
  answers: Record<string, AnswerRecord>;
}
