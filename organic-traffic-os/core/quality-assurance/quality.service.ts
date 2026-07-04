import { QAIssue, QualityScores, QAReport, QAArea } from './quality.types';
import { validateMission, validateWorkflow, validateAgent, validateContent, validateEngine } from './quality-checker';
import { calculateScoresFromIssues } from './quality-validator';
import { generateQAReport } from './quality-report';

const reports: QAReport[] = [];

export function getQualityService() { return {
  analyze(params: { type: string; data: Record<string, unknown>; workspace_id?: string }) {
    let issues: QAIssue[] = [];
    switch (params.type) {
      case 'mission': issues = validateMission(params.data as Parameters<typeof validateMission>[0]); break;
      case 'workflow': issues = validateWorkflow(params.data as Parameters<typeof validateWorkflow>[0]); break;
      case 'agent': issues = validateAgent(params.data as Parameters<typeof validateAgent>[0]); break;
      case 'content': issues = validateContent(params.data as Parameters<typeof validateContent>[0]); break;
      case 'engine': issues = validateEngine(params.data as Parameters<typeof validateEngine>[0]); break;
      default: issues = [];
    }
    const scores = calculateScoresFromIssues(issues);
    const report = generateQAReport({ workspace_id: params.workspace_id, targetType: params.type, targetId: (params.data.id as string) || 'unknown', issues, scores });
    reports.push(report);
    return report;
  },
  getReports(limit = 50) { return reports.slice(-limit); },
  getIssues() { return reports.flatMap(r => r.issues); },
  getScores() { return reports.length > 0 ? reports[reports.length - 1].scores : null; },
}; }
