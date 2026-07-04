import { QualityScores } from './quality.types';
import { calculateQualityScore } from './quality-score';

export function calculateScoresFromIssues(issues: { severity: string; area: string }[]): QualityScores {
  const areaScores: Record<string, number[]> = { content: [], workflow: [], agent: [], engine: [], operational: [], seo: [], ai_readiness: [] };
  issues.forEach(i => { const area = i.area in areaScores ? i.area : 'operational'; const penalty = i.severity === 'critical' ? 25 : i.severity === 'high' ? 15 : i.severity === 'medium' ? 8 : 3; areaScores[area].push(penalty); });
  const calc = (key: string) => Math.max(0, 100 - (areaScores[key] || []).reduce((s, p) => s + p, 0));
  return calculateQualityScore({ content: calc('content'), workflow: calc('workflow'), agent: calc('agent'), engine: calc('engine'), operational: calc('operational'), seo: calc('seo'), ai_readiness: calc('ai_readiness') });
}
