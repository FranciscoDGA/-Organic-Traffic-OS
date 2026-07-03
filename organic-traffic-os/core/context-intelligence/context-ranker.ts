import { ContextSource, RankWeights } from './context.types';

const DEFAULT_WEIGHTS: RankWeights = {
  relevance: 0.3,
  recency: 0.2,
  frequency: 0.15,
  confidence: 0.15,
  authority: 0.1,
  objectiveRelation: 0.1,
};

export function rankSources(sources: ContextSource[], objective: string, weights: RankWeights = DEFAULT_WEIGHTS): ContextSource[] {
  const scored = sources.map(s => {
    let score = 0;
    score += s.relevance * weights.relevance;
    score += (1 - Math.min(1, (Date.now() - new Date(s.data.split('|')[1] || Date.now().toString()).getTime()) / (7 * 24 * 60 * 60 * 1000))) * weights.recency;
    score += s.confidence * weights.confidence;
    score += (objective.toLowerCase().split(' ').filter(w => s.data.toLowerCase().includes(w)).length / Math.max(1, objective.split(' ').length)) * weights.objectiveRelation;
    return { ...s, score };
  });
  return scored.sort((a, b) => b.score - a.score);
}
