import type { Question } from '../types/question';

export function checkAnswer(question: Question, selected: string | string[] | boolean | null): boolean {
  const answer = question.answer;

  if (question.type === 'boolean') {
    return selected === answer;
  }

  if (question.type === 'single') {
    return selected === answer;
  }

  if (question.type === 'multiple') {
    if (!Array.isArray(selected) || !Array.isArray(answer)) return false;
    const sortedSelected = [...selected].sort();
    const sortedAnswer = [...answer].sort();
    return sortedSelected.length === sortedAnswer.length &&
      sortedSelected.every((v, i) => v === sortedAnswer[i]);
  }

  if (question.type === 'fill') {
    if (!Array.isArray(answer) || typeof selected !== 'string') return false;
    const normalized = selected.trim().toLowerCase();
    return answer.some(a => a.trim().toLowerCase() === normalized);
  }

  return false;
}
