import { useState } from 'react';
import type { Question } from '../../types/question';
import { checkAnswer } from '../../utils/scoring';
import { useProgressStore } from '../../stores/progressStore';

interface Props {
  question: Question;
  onCorrect?: () => void;
}

export default function QuestionCard({ question, onCorrect }: Props) {
  const [selected, setSelected] = useState<string | string[] | boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { setAnswer, answered, toggleFavorite, isFavorited } = useProgressStore();

  const prevAnswer = answered[question.id];
  const showResult = submitted || !!prevAnswer;
  const correct = submitted ? checkAnswer(question, selected) : prevAnswer?.correct ?? false;
  const favorited = isFavorited(question.id);

  const handleSubmit = () => {
    if (selected === null) return;
    const isCorrect = checkAnswer(question, selected);
    setSubmitted(true);
    setAnswer(question.id, { selected, correct: isCorrect, timestamp: Date.now() });
    if (isCorrect && onCorrect) onCorrect();
  };

  const handleReset = () => {
    setSelected(null);
    setSubmitted(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          question.type === 'fill' ? 'bg-purple-100 text-purple-700' :
          question.type === 'boolean' ? 'bg-orange-100 text-orange-700' :
          question.type === 'single' ? 'bg-blue-100 text-blue-700' :
          question.type === 'multiple' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {question.type === 'fill' ? '填空题' :
           question.type === 'boolean' ? '判断题' :
           question.type === 'single' ? '单选题' :
           question.type === 'multiple' ? '多选题' :
           question.type === 'essay' ? '简答题' : '编程题'}
        </span>
        <button
          onClick={() => toggleFavorite(question.id)}
          className={`text-xl ${favorited ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
        >
          {favorited ? '★' : '☆'}
        </button>
      </div>

      <p className="text-gray-800 text-base leading-relaxed mb-4 whitespace-pre-wrap">{question.stem}</p>

      {question.type === 'single' && question.options && (
        <div className="space-y-2 mb-4">
          {question.options.map(opt => (
            <label
              key={opt.label}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                showResult
                  ? opt.label === question.answer
                    ? 'bg-green-50 border-green-300'
                    : selected === opt.label
                    ? 'bg-red-50 border-red-300'
                    : 'border-gray-200'
                  : selected === opt.label
                  ? 'bg-blue-50 border-blue-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.label}
                checked={selected === opt.label}
                onChange={() => !showResult && setSelected(opt.label)}
                disabled={showResult}
                className="mt-0.5"
              />
              <span><strong>{opt.label}.</strong> {opt.text}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'multiple' && question.options && (
        <div className="space-y-2 mb-4">
          {question.options.map(opt => {
            const isChecked = Array.isArray(selected) && selected.includes(opt.label);
            const isCorrectOpt = Array.isArray(question.answer) && question.answer.includes(opt.label);
            return (
              <label
                key={opt.label}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  showResult
                    ? isCorrectOpt
                      ? 'bg-green-50 border-green-300'
                      : isChecked
                      ? 'bg-red-50 border-red-300'
                      : 'border-gray-200'
                    : isChecked
                    ? 'bg-blue-50 border-blue-300'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {
                    if (showResult) return;
                    const current = Array.isArray(selected) ? [...selected] : [];
                    if (current.includes(opt.label)) {
                      setSelected(current.filter(l => l !== opt.label));
                    } else {
                      setSelected([...current, opt.label]);
                    }
                  }}
                  disabled={showResult}
                  className="mt-0.5"
                />
                <span><strong>{opt.label}.</strong> {opt.text}</span>
              </label>
            );
          })}
        </div>
      )}

      {question.type === 'boolean' && (
        <div className="flex gap-4 mb-4">
          {[
            { value: true, label: '对 ✓' },
            { value: false, label: '错 ✗' },
          ].map(opt => (
            <label
              key={String(opt.value)}
              className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                showResult
                  ? opt.value === question.answer
                    ? 'bg-green-50 border-green-300'
                    : selected === opt.value
                    ? 'bg-red-50 border-red-300'
                    : 'border-gray-200'
                  : selected === opt.value
                  ? 'bg-blue-50 border-blue-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                checked={selected === opt.value}
                onChange={() => !showResult && setSelected(opt.value)}
                disabled={showResult}
              />
              <span className="font-medium">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'fill' && (
        <div className="mb-4">
          <input
            type="text"
            value={typeof selected === 'string' ? selected : ''}
            onChange={(e) => !showResult && setSelected(e.target.value)}
            disabled={showResult}
            placeholder="输入答案..."
            className={`w-full p-3 border rounded-lg ${
              showResult
                ? correct
                  ? 'bg-green-50 border-green-300'
                  : 'bg-red-50 border-red-300'
                : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            }`}
          />
          {showResult && !correct && Array.isArray(question.answer) && (
            <p className="mt-2 text-sm text-green-600">正确答案：{question.answer.join(' / ')}</p>
          )}
        </div>
      )}

      {(question.type === 'essay' || question.type === 'code') && (
        <div className="mb-4">
          {showResult && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-600 mb-2">参考答案：</p>
              <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                {typeof question.answer === 'string' ? question.answer : '暂无'}
              </p>
            </div>
          )}
        </div>
      )}

      {showResult && (
        <div className={`p-3 rounded-lg mb-4 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <span className={`font-medium ${correct ? 'text-green-700' : 'text-red-700'}`}>
            {correct ? '✓ 回答正确！' : '✗ 回答错误'}
          </span>
        </div>
      )}

      <div className="flex gap-3">
        {!showResult && question.type !== 'essay' && question.type !== 'code' && (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            提交答案
          </button>
        )}
        {(question.type === 'essay' || question.type === 'code') && !showResult && (
          <button
            onClick={() => setSubmitted(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            查看答案
          </button>
        )}
        {showResult && (
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重新作答
          </button>
        )}
      </div>
    </div>
  );
}
