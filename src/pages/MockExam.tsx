import { useState, useEffect, useRef } from 'react';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import Header from '../components/layout/Header';
import QuestionCard from '../components/quiz/QuestionCard';
import ProgressBar from '../components/common/ProgressBar';
import { checkAnswer } from '../utils/scoring';

export default function MockExam() {
  const { getRandomQuestions } = useQuestionStore();
  const { addExamRecord, setAnswer } = useProgressStore();
  const [count, setCount] = useState(20);
  const [minutes, setMinutes] = useState(30);
  const [questions, setQuestions] = useState<ReturnType<typeof getRandomQuestions>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string | string[] | boolean | null>>({});
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, finished]);

  const handleStart = () => {
    const qs = getRandomQuestions(count);
    setQuestions(qs);
    setCurrentIndex(0);
    setStarted(true);
    setFinished(false);
    setTimeLeft(minutes * 60);
    setExamAnswers({});
  };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);

    let correctCount = 0;
    const answers: Record<string, { selected: string | string[] | boolean | null; correct: boolean; timestamp: number }> = {};

    for (const q of questions) {
      const selected = examAnswers[q.id] ?? null;
      const isCorrect = checkAnswer(q, selected);
      if (isCorrect) correctCount++;
      answers[q.id] = { selected, correct: isCorrect, timestamp: Date.now() };
      setAnswer(q.id, { selected, correct: isCorrect, timestamp: Date.now() });
    }

    addExamRecord({
      id: `exam-${Date.now()}`,
      date: new Date().toLocaleString('zh-CN'),
      totalQuestions: questions.length,
      correctCount,
      duration: minutes * 60 - timeLeft,
      answers,
    });
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div>
        <Header title="模拟考试" />
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto">
          <h3 className="text-lg font-bold mb-4">考试设置</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">题目数量</label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 50].map(n => (
                <button key={n} onClick={() => setCount(n)}
                  className={`p-2 rounded-lg border text-sm ${count === n ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-2">考试时间（分钟）</label>
            <div className="grid grid-cols-4 gap-2">
              {[15, 30, 45, 60].map(n => (
                <button key={n} onClick={() => setMinutes(n)}
                  className={`p-2 rounded-lg border text-sm ${minutes === n ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200'}`}>
                  {n}分钟
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleStart}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
            开始考试
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    let correctCount = 0;
    for (const q of questions) {
      if (checkAnswer(q, examAnswers[q.id] ?? null)) correctCount++;
    }
    const accuracy = Math.round((correctCount / questions.length) * 100);

    return (
      <div>
        <Header title="考试结果" backTo="/exam" />
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md mx-auto mb-8">
          <div className="text-center">
            <p className={`text-5xl font-bold mb-2 ${accuracy >= 60 ? 'text-green-600' : 'text-red-500'}`}>
              {accuracy}%
            </p>
            <p className="text-gray-500">正确率</p>
            <div className="flex justify-center gap-8 mt-4">
              <div><p className="text-2xl font-bold text-gray-800">{correctCount}</p><p className="text-sm text-gray-500">正确</p></div>
              <div><p className="text-2xl font-bold text-gray-800">{questions.length - correctCount}</p><p className="text-sm text-gray-500">错误</p></div>
              <div><p className="text-2xl font-bold text-gray-800">{formatTime(minutes * 60 - timeLeft)}</p><p className="text-sm text-gray-500">用时</p></div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-4">答题详情</h3>
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div>
      <Header
        title="模拟考试"
        backTo="/exam"
        actions={
          <div className="flex items-center gap-4">
            <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
            <button onClick={handleFinish}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors">
              交卷
            </button>
          </div>
        }
      />

      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={questions.length} showText={false} />
      </div>

      <QuestionCard
        key={currentQuestion.id}
        question={currentQuestion}
      />

      <div className="flex justify-between mt-6">
        <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors">
          ← 上一题
        </button>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded text-xs ${i === currentIndex ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} disabled={currentIndex === questions.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
          下一题 →
        </button>
      </div>
    </div>
  );
}
