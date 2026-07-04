import { QAReport, QAIssue, QualityScores } from './quality.types';

let reportCounter = 0;

export function generateQAReport(params: { workspace_id?: string; targetType: string; targetId: string; issues: QAIssue[]; scores: QualityScores }): QAReport {
  const recommendations = params.issues.map(i => i.recommendation);
  return { id: `qa-report-${Date.now()}-${++reportCounter}`, workspace_id: params.workspace_id, target_type: params.targetType, target_id: params.targetId, scores: params.scores, issues: params.issues, recommendations, created_at: new Date().toISOString() };
}
