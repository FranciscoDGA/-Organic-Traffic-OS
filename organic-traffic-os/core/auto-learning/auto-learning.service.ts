import { LearningRecord, LearningReport, PatternReport } from './auto-learning.types';
import { buildPassaCumaruLessons, buildGarimpeiBrasilLessons } from './learning-data';
import { rankLessons, filterActive } from './learning-ranker';
import { detectPatterns } from './learning-analyzer';

const lessons: Map<string, LearningRecord[]> = new Map();
const reports: LearningReport[] = [];

function init() {
  buildPassaCumaruLessons().forEach(l => {
    const list = lessons.get('passacumaru') || [];
    list.push(l);
    lessons.set('passacumaru', list);
  });
  buildGarimpeiBrasilLessons().forEach(l => {
    const list = lessons.get('garimpeibrasil') || [];
    list.push(l);
    lessons.set('garimpeibrasil', list);
  });
}
init();

export function getAutoLearningService() {
  return {
    getLessons(workspaceId: string): LearningRecord[] {
      return rankLessons(lessons.get(workspaceId) || []);
    },

    getActiveLessons(workspaceId: string): LearningRecord[] {
      return filterActive(lessons.get(workspaceId) || []);
    },

    getSuggestions(workspaceId: string): LearningRecord[] {
      return (lessons.get(workspaceId) || []).filter(l => l.status === 'suggestion');
    },

    getPatterns(workspaceId: string): PatternReport {
      const list = lessons.get(workspaceId) || [];
      const { success, failure, recurring } = detectPatterns(list);
      const opportunities = list.filter(l => l.type === 'repeated_opportunity' || l.type === 'promising_topic').map(l => l.patternDetected);
      return { workspaceId, successPatterns: success, failurePatterns: failure, recurringFailures: recurring, opportunities };
    },

    getReports(workspaceId: string): LearningReport[] {
      return reports.filter(r => r.workspaceId === workspaceId);
    },

    addLesson(record: LearningRecord) {
      const list = lessons.get(record.workspaceId) || [];
      list.push(record);
      lessons.set(record.workspaceId, list);
    },

    generateReport(workspaceId: string): LearningReport {
      const list = lessons.get(workspaceId) || [];
      const active = filterActive(list);
      const { success, failure } = detectPatterns(list);
      const avgConf = active.length > 0 ? active.reduce((s, l) => s + l.confidence, 0) / active.length : 0;
      const recs = active.slice(0, 5).map(l => l.recommendation);

      const report: LearningReport = {
        id: `lr-${workspaceId}-${reports.length + 1}`,
        workspaceId,
        totalLessons: list.length,
        successPatterns: success.length,
        failurePatterns: failure.length,
        avgConfidence: avgConf,
        recommendations: recs,
        createdAt: new Date().toISOString(),
      };
      reports.push(report);
      return report;
    },

    generateRecommendations(workspaceId: string): string[] {
      const list = lessons.get(workspaceId) || [];
      return rankLessons(list).filter(l => l.status === 'active').slice(0, 10).map(l => l.recommendation);
    },
  };
}
