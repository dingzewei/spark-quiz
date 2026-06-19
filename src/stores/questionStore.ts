import { create } from 'zustand';
import type { QuizData, Question } from '../types/question';

interface QuestionState {
  quizData: QuizData | null;
  setQuizData: (data: QuizData) => void;
  getChapterQuestions: (chapterId: string) => Question[];
  getAllQuestions: () => Question[];
  getRandomQuestions: (count: number) => Question[];
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  quizData: null,

  setQuizData: (data) => {
    set({ quizData: data });
    localStorage.setItem('quiz-data', JSON.stringify(data));
  },

  getChapterQuestions: (chapterId) => {
    const { quizData } = get();
    if (!quizData) return [];
    const chapter = quizData.chapters.find(c => c.id === chapterId);
    return chapter ? chapter.questions : [];
  },

  getAllQuestions: () => {
    const { quizData } = get();
    if (!quizData) return [];
    return quizData.chapters.flatMap(c => c.questions);
  },

  getRandomQuestions: (count) => {
    const all = get().getAllQuestions();
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },
}));
