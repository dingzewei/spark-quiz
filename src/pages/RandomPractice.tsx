import { useState } from 'react';
import { useQuestionStore } from '../stores/questionStore';
import Header from '../components/layout/Header';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/common/ProgressBar';

export default function RandomPractice() {
  const { getRandomQuestions } = useQuestionStore();
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<ReturnType<typeof getRandomQuestions>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    const qs = getRandomQuestions(count);
    setQuestions(qs);
    setCurrentIndex(0);
    setStarted(true);
  };

  if (!started) {
    return (
      <div>
        <Header title="随机刷题" />
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">设置抽题数量</h3>
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[10, 20, 30, 50].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`p-3 rounded-lg border transition-colors ${
                  count === n
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {n} 题
              </button>
            ))}
          </div>
          <button
            onClick={handleStart}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            开始刷题
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <div className="text-center py-20 text-gray-500">题库为空</div>;

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <Header
        title="随机刷题"
        backTo="/random"
        actions={
          <button
            onClick={() => { setStarted(false); setQuestions([]); }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            重新抽题
          </button>
        }
      />

      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={questions.length} showText={false} />
        <p className="text-sm text-gray-500 mt-1">{currentIndex + 1} / {questions.length}</p>
      </div>

      <QuestionCard key={currentQuestion.id} question={currentQuestion} />

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
