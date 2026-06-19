import { useQuestionStore } from '../stores/questionStore';
import { useProgressStore } from '../stores/progressStore';
import Header from '../components/layout/Header';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function StatsPage() {
  const { quizData } = useQuestionStore();
  const { answered, examHistory, clearProgress } = useProgressStore();

  if (!quizData) return <div className="text-center py-20 text-gray-500">请先导入题库</div>;

  const answeredCount = Object.keys(answered).length;
  const correctCount = Object.values(answered).filter(a => a.correct).length;
  const wrongCount = answeredCount - correctCount;
  const unanswered = quizData.meta.totalQuestions - answeredCount;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const chapterData = quizData.chapters.map(ch => {
    let correct = 0;
    let total = 0;
    for (const q of ch.questions) {
      if (answered[q.id]) {
        total++;
        if (answered[q.id].correct) correct++;
      }
    }
    return { name: ch.name, total, correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
  });

  const barData = {
    labels: chapterData.map(d => d.name.length > 6 ? d.name.slice(0, 6) + '...' : d.name),
    datasets: [
      {
        label: '正确率 (%)',
        data: chapterData.map(d => d.accuracy),
        backgroundColor: chapterData.map(d => d.accuracy >= 80 ? '#22c55e' : d.accuracy >= 60 ? '#f59e0b' : '#ef4444'),
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ['正确', '错误', '未答'],
    datasets: [{
      data: [correctCount, wrongCount, unanswered],
      backgroundColor: ['#22c55e', '#ef4444', '#e5e7eb'],
      borderWidth: 0,
    }],
  };

  return (
    <div>
      <Header title="答题统计" actions={
        <button onClick={() => { if (confirm('确定清除所有答题记录？')) clearProgress(); }}
          className="text-sm text-red-500 hover:text-red-700">清除记录</button>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">总体概览</h3>
          <div className="flex items-center gap-6">
            <div className="w-40 h-40">
              <Doughnut data={doughnutData} options={{ cutout: '65%', plugins: { legend: { display: false } } }} />
            </div>
            <div className="space-y-2">
              <p className="text-sm"><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>正确 {correctCount}</p>
              <p className="text-sm"><span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>错误 {wrongCount}</p>
              <p className="text-sm"><span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-2"></span>未答 {unanswered}</p>
              <p className="text-lg font-bold mt-2">正确率 {accuracy}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">章节正确率</h3>
          <div className="h-48">
            <Bar data={barData} options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: { y: { beginAtZero: true, max: 100 } },
              plugins: { legend: { display: false } },
            }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4">薄弱知识点</h3>
        {chapterData.filter(d => d.accuracy < 60 && d.total > 0).length === 0 ? (
          <p className="text-gray-500">暂无薄弱知识点（正确率均 ≥ 60%）</p>
        ) : (
          <div className="space-y-2">
            {chapterData.filter(d => d.accuracy < 60 && d.total > 0).map(d => (
              <div key={d.name} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-red-800">{d.name}</span>
                <span className="text-red-600 font-medium">{d.accuracy}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {examHistory.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">考试历史</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b">
                <th className="pb-2">时间</th><th className="pb-2">题数</th><th className="pb-2">正确</th><th className="pb-2">正确率</th>
              </tr></thead>
              <tbody>
                {examHistory.slice().reverse().map(exam => (
                  <tr key={exam.id} className="border-b last:border-0">
                    <td className="py-2">{exam.date}</td>
                    <td>{exam.totalQuestions}</td>
                    <td>{exam.correctCount}</td>
                    <td className={exam.correctCount / exam.totalQuestions >= 0.6 ? 'text-green-600' : 'text-red-600'}>
                      {Math.round((exam.correctCount / exam.totalQuestions) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
