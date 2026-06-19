import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import Header from '../components/layout/Header';
import QuestionCard from '../components/quiz/QuestionCard';

export default function Favorites() {
  const { getAllQuestions } = useQuestionStore();
  const { favorites } = useProgressStore();

  const allQuestions = getAllQuestions();
  const favoriteQuestions = allQuestions.filter(q => favorites.includes(q.id));

  return (
    <div>
      <Header title="收藏题目" actions={<span className="text-sm text-gray-500">{favoriteQuestions.length} 题</span>} />

      {favoriteQuestions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">暂无收藏题目</p>
          <p className="text-gray-400 text-sm mt-2">在刷题时点击 ☆ 即可收藏</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteQuestions.map(q => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
