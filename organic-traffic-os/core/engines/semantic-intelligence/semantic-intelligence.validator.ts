import { SemanticItem, SemanticMetrics, SemanticScores } from './semantic-intelligence.types';

export function validateAnalysisInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Input must be an object' };
  return { valid: true };
}

export function calculateCoverageScore(metrics: SemanticMetrics): number {
  let score = 0;

  if (metrics.word_count > 1500) score += 20;
  else if (metrics.word_count > 800) score += 15;
  else if (metrics.word_count > 300) score += 10;
  else score += 5;

  if (metrics.keyword_count > 10) score += 15;
  else if (metrics.keyword_count > 5) score += 10;
  else if (metrics.keyword_count > 2) score += 5;

  if (metrics.entity_count > 5) score += 15;
  else if (metrics.entity_count > 2) score += 10;
  else if (metrics.entity_count > 0) score += 5;

  if (metrics.topic_count > 3) score += 15;
  else if (metrics.topic_count > 1) score += 10;
  else if (metrics.topic_count > 0) score += 5;

  if (metrics.headings > 5) score += 10;
  else if (metrics.headings > 2) score += 5;

  if (metrics.internal_links > 3) score += 10;
  else if (metrics.internal_links > 0) score += 5;

  if (metrics.external_links > 2) score += 5;
  else if (metrics.external_links > 0) score += 3;

  if (metrics.readability_score > 60) score += 10;
  else if (metrics.readability_score > 40) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function calculateEntityCoverageScore(items: SemanticItem[], totalEntities: number): number {
  if (items.length === 0 || totalEntities === 0) return 0;

  const itemsWithEntities = items.filter(i => i.entities && i.entities.length > 0).length;
  const ratio = itemsWithEntities / items.length;

  let score = Math.round(ratio * 60);
  if (totalEntities > 20) score += 20;
  else if (totalEntities > 10) score += 15;
  else if (totalEntities > 5) score += 10;

  const avgEntitiesPerItem = totalEntities / items.length;
  if (avgEntitiesPerItem > 3) score += 20;
  else if (avgEntitiesPerItem > 1) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateTopicDepthScore(topics: { depth: number; coverage_score: number }[]): number {
  if (topics.length === 0) return 0;

  const avgDepth = topics.reduce((sum, t) => sum + t.depth, 0) / topics.length;
  const avgCoverage = topics.reduce((sum, t) => sum + t.coverage_score, 0) / topics.length;

  let score = Math.round(avgDepth * 15 + avgCoverage * 0.5);
  if (topics.length > 10) score += 15;
  else if (topics.length > 5) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateQuestionAnsweringScore(questions: { answer_coverage: number }[]): number {
  if (questions.length === 0) return 0;

  const avgCoverage = questions.reduce((sum, q) => sum + q.answer_coverage, 0) / questions.length;
  const wellAnswered = questions.filter(q => q.answer_coverage > 60).length;
  const ratio = wellAnswered / questions.length;

  let score = Math.round(avgCoverage * 0.6 + ratio * 40);
  if (questions.length > 10) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateTopicalAuthorityScore(
  items: SemanticItem[],
  topics: { frequency: number; items_referenced: string[] }[],
  totalKeywords: number
): number {
  if (items.length === 0 || topics.length === 0) return 0;

  const topicFrequency = topics.reduce((sum, t) => sum + t.frequency, 0);
  const uniqueItemsCovered = new Set(topics.flatMap(t => t.items_referenced)).size;
  const coverageRatio = uniqueItemsCovered / items.length;

  let score = 0;
  if (coverageRatio > 0.8) score += 30;
  else if (coverageRatio > 0.5) score += 20;
  else if (coverageRatio > 0.2) score += 10;

  if (totalKeywords > 50) score += 25;
  else if (totalKeywords > 20) score += 20;
  else if (totalKeywords > 10) score += 15;

  if (topics.length > 15) score += 25;
  else if (topics.length > 8) score += 20;
  else if (topics.length > 3) score += 10;

  const avgFrequency = topicFrequency / topics.length;
  if (avgFrequency > 5) score += 20;
  else if (avgFrequency > 2) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateCompletenessScore(metrics: SemanticMetrics[]): number {
  if (metrics.length === 0) return 0;

  const avg = (fn: (m: SemanticMetrics) => number) =>
    metrics.reduce((sum, m) => sum + fn(m), 0) / metrics.length;

  const wordScore = Math.min(100, avg(m => Math.min(m.word_count / 15, 100)) * 0.2);
  const linkScore = Math.min(100, avg(m => Math.min((m.internal_links + m.external_links) * 10, 100)) * 0.15);
  const headingScore = Math.min(100, avg(m => Math.min(m.headings * 10, 100)) * 0.15);
  const readabilityScore = avg(m => m.readability_score) * 0.2;
  const keywordScore = Math.min(100, avg(m => Math.min(m.keyword_count * 8, 100)) * 0.15);
  const entityScore = Math.min(100, avg(m => Math.min(m.entity_count * 12, 100)) * 0.15);

  return Math.max(0, Math.min(100, Math.round(wordScore + linkScore + headingScore + readabilityScore + keywordScore + entityScore)));
}
