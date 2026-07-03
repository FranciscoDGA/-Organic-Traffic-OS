import { LearningRecord } from './auto-learning.types';

export function rankLessons(lessons: LearningRecord[]): LearningRecord[] {
  return [...lessons].sort((a, b) => {
    const scoreA = a.confidence * (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1);
    const scoreB = b.confidence * (b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1);
    return scoreB - scoreA;
  });
}

export function filterActive(lessons: LearningRecord[]): LearningRecord[] {
  return lessons.filter(l => l.status === 'active');
}

export function filterSuggestions(lessons: LearningRecord[]): LearningRecord[] {
  return lessons.filter(l => l.status === 'suggestion');
}
