import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import Header from '../components/layout/Header';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/common/ProgressBar';

export default function ChapterPractice() {
  const { chapterId } = useParams();
  const { quizData } = useQuestionStore();
  const { getChapterStats } = useProgressStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!quizData) return <div className="text-center py-20 text-gray-500">请先导入题库</div>;

  if (!chapterId) {
    return (
      <div>
        <Header title="章节练习" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quizData.chapters.map(ch => {
            const stats = getChapterStats(ch.questions);
            return (
              <Link
                key={ch.id}
                to={`/chapter/${ch.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <h3 className="font-bold text-gray-800 mb-2">{ch.name}</h3>
                <p className="text-sm text-gray-500 mb-3">共 {ch.questions.length} 题</p>
                <ProgressBar current={stats.answered} total={stats.total} color="bg-blue-500" />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const chapter = quizData.chapters.find(c => c.id === chapterId);
  if (!chapter) return <div className="text-center py-20 text-gray-500">章节不存在</div>;

  const questions = chapter.questions;
  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <Header
        title={chapter.name}
        backTo="/chapter"
        actions={
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {questions.length}
          </span>
        }
      />

      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={questions.length} showText={false} />
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
        onCorrect={() => {}}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← 上一题
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
          disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          下一题 →
        </button>
      </div>
    </div>
  );
}
