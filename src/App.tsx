import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import ChapterPractice from './pages/ChapterPractice';
import RandomPractice from './pages/RandomPractice';
import MockExam from './pages/MockExam';
import Favorites from './pages/Favorites';
import StatsPage from './pages/StatsPage';
import { useEffect } from 'react';
import { useQuestionStore } from './stores/questionStore';

function AppContent() {
  const { quizData, setQuizData } = useQuestionStore();

  useEffect(() => {
    if (!quizData) {
      fetch('/spark-questions.json')
        .then(r => r.json())
        .then(data => setQuizData(data))
        .catch(() => {
          const saved = localStorage.getItem('quiz-data');
          if (saved) setQuizData(JSON.parse(saved));
        });
    }
  }, [quizData, setQuizData]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chapter" element={<ChapterPractice />} />
          <Route path="/chapter/:chapterId" element={<ChapterPractice />} />
          <Route path="/random" element={<RandomPractice />} />
          <Route path="/exam" element={<MockExam />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
