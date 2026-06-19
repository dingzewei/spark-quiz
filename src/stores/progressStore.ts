import { create } from 'zustand';
import type { AnswerRecord, ExamRecord } from '../types/question';

interface ProgressState {
  answered: Record<string, AnswerRecord>;
  favorites: string[];
  examHistory: ExamRecord[];

  setAnswer: (questionId: string, record: AnswerRecord) => void;
  toggleFavorite: (questionId: string) => void;
  addExamRecord: (record: ExamRecord) => void;
  clearProgress: () => void;
  isFavorited: (questionId: string) => boolean;
  getChapterStats: (chapterQuestions: { id: string }[]) => { total: number; correct: number; answered: number };
}

const loadProgress = () => {
  try {
    const raw = localStorage.getItem('quiz-progress');
    if (raw) return JSON.parse(raw);
  } catch {}
  return { answered: {}, favorites: [], examHistory: [] };
};

const saveProgress = (state: Partial<ProgressState>) => {
  localStorage.setItem('quiz-progress', JSON.stringify({
    answered: state.answered,
    favorites: state.favorites,
    examHistory: state.examHistory,
  }));
};

export const useProgressStore = create<ProgressState>((set, get) => {
  const initial = loadProgress();
  return {
    answered: initial.answered || {},
    favorites: initial.favorites || [],
    examHistory: initial.examHistory || [],

    setAnswer: (questionId, record) => {
      set((state) => {
        const newState = { ...state, answered: { ...state.answered, [questionId]: record } };
        saveProgress(newState);
        return { answered: newState.answered };
      });
    },

    toggleFavorite: (questionId) => {
      set((state) => {
        const favs = state.favorites.includes(questionId)
          ? state.favorites.filter(id => id !== questionId)
          : [...state.favorites, questionId];
        saveProgress({ ...state, favorites: favs });
        return { favorites: favs };
      });
    },

    addExamRecord: (record) => {
      set((state) => {
        const history = [...state.examHistory, record];
        saveProgress({ ...state, examHistory: history });
        return { examHistory: history };
      });
    },

    clearProgress: () => {
      set({ answered: {}, favorites: [], examHistory: [] });
      localStorage.removeItem('quiz-progress');
    },

    isFavorited: (questionId) => {
      return get().favorites.includes(questionId);
    },

    getChapterStats: (chapterQuestions) => {
      const { answered } = get();
      const total = chapterQuestions.length;
      let correct = 0;
      let answeredCount = 0;
      for (const q of chapterQuestions) {
        if (answered[q.id]) {
          answeredCount++;
          if (answered[q.id].correct) correct++;
        }
      }
      return { total, correct, answered: answeredCount };
    },
  };
});
