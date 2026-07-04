import { QualityScores } from './quality.types';

export function calculateQualityScore(scores: Omit<QualityScores, 'overall'>): QualityScores {
  const overall = Math.round((scores.content + scores.workflow + scores.agent + scores.engine + scores.operational + scores.seo + scores.ai_readiness) / 7);
  return { ...scores, overall };
}

export function getScoreColor(score: number): string { return score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444'; }
