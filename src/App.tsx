import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import HomePage from './pages/HomePage';
import ChapterPractice from './pages/ChapterPractice';
import RandomPractice from './pages/RandomPractice';
import MockExam from './pages/MockExam';
import Favorites from './pages/Favorites';
import StatsPage from './pages/StatsPage';
import { useEffect, useState } from 'react';
import { useQuestionStore } from './stores/questionStore';

function AppContent() {
  const { quizData, setQuizData } = useQuestionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 text-xl">
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <h1 className="text-lg font-bold text-blue-600">Spark期末复习</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex">
        {/* Sidebar overlay on mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:sticky top-0 left-0 h-screen z-50 transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 max-w-4xl w-full">
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
