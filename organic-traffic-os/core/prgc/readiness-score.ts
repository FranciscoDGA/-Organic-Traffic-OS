import { ReadinessScore, ReadinessLevel } from './go-live.types';

function determineLevel(score: number): ReadinessLevel {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'ready';
  if (score >= 50) return 'partial';
  return 'not_ready';
}

export function calculateReadiness(scores: {
  infrastructure: number;
  security: number;
  runtime: number;
  publishing: number;
  business: number;
  ai: number;
  workspace: number;
}): ReadinessScore {
  const overall = Math.round(
    (scores.infrastructure * 0.2) +
    (scores.security * 0.15) +
    (scores.runtime * 0.2) +
    (scores.publishing * 0.15) +
    (scores.business * 0.1) +
    (scores.ai * 0.1) +
    (scores.workspace * 0.1)
  );
  return { ...scores, overall, level: determineLevel(overall) };
}
