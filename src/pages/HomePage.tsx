import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import Header from '../components/layout/Header';
import ProgressBar from '../components/common/ProgressBar';

export default function HomePage() {
  const { quizData } = useQuestionStore();
  const { answered, getChapterStats } = useProgressStore();

  useEffect(() => {
    if (!quizData) {
      const saved = localStorage.getItem('quiz-data');
      if (saved) {
        useQuestionStore.getState().setQuizData(JSON.parse(saved));
      }
    }
  }, [quizData]);

  if (!quizData) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg mb-4">请先导入题库</p>
        <p className="text-gray-400 text-sm">将 spark-questions.json 放入 public 目录后刷新页面</p>
      </div>
    );
  }

  const totalQuestions = quizData.meta.totalQuestions;
  const answeredCount = Object.keys(answered).length;
  const correctCount = Object.values(answered).filter(a => a.correct).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <div>
      <Header title="Spark期末复习（bydzw and zjw）" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500">总题数</p>
          <p className="text-3xl font-bold text-gray-800">{totalQuestions}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500">已答题数</p>
          <p className="text-3xl font-bold text-blue-600">{answeredCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500">正确率</p>
          <p className={`text-3xl font-bold ${accuracy >= 60 ? 'text-green-600' : 'text-red-500'}`}>{accuracy}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/chapter" className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-colors">
          <p className="text-lg font-bold">📖 章节练习</p>
          <p className="text-blue-100 text-sm mt-1">按章节系统复习</p>
        </Link>
        <Link to="/random" className="bg-green-600 text-white rounded-xl p-5 hover:bg-green-700 transition-colors">
          <p className="text-lg font-bold">🎲 随机刷题</p>
          <p className="text-green-100 text-sm mt-1">随机抽题练习</p>
        </Link>
        <Link to="/exam" className="bg-purple-600 text-white rounded-xl p-5 hover:bg-purple-700 transition-colors">
          <p className="text-lg font-bold">📝 模拟考试</p>
          <p className="text-purple-100 text-sm mt-1">计时模拟测试</p>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">章节进度</h3>
        <div className="space-y-4">
          {quizData.chapters.map(ch => {
            const stats = getChapterStats(ch.questions);
            return (
              <Link key={ch.id} to={`/chapter/${ch.id}`} className="block hover:bg-gray-50 rounded-lg p-2 -mx-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-700">{ch.name}</span>
                  <span className="text-sm text-gray-500">{stats.answered}/{stats.total}</span>
                </div>
                <ProgressBar current={stats.answered} total={stats.total} showText={false} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
