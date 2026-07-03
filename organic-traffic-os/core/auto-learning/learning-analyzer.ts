import { LearningRecord } from './auto-learning.types';

export function analyzeResults(workspaceId: string, data: { type: string; value: number; label: string }[]): LearningRecord[] {
  const lessons: LearningRecord[] = [];
  const highPerformers = data.filter(d => d.value > 80);
  const lowPerformers = data.filter(d => d.value < 40);

  highPerformers.forEach(d => {
    lessons.push({
      id: `analyze-${workspaceId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      workspaceId, origin: 'learning-analyzer', type: 'content_success', category: 'performance',
      description: `${d.label} teve desempenho alto (${d.value})`,
      patternDetected: `${d.label} e um padrao de sucesso`,
      evidence: `Score: ${d.value}`,
      impact: d.value > 90 ? 'high' : 'medium',
      confidence: d.value / 100,
      recommendation: `Replicar estrategia de ${d.label}`,
      status: d.value >= 70 ? 'active' : 'suggestion',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  });

  lowPerformers.forEach(d => {
    lessons.push({
      id: `analyze-${workspaceId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      workspaceId, origin: 'learning-analyzer', type: 'content_failure', category: 'performance',
      description: `${d.label} teve desempenho baixo (${d.value})`,
      patternDetected: `${d.label} e um padrao de falha`,
      evidence: `Score: ${d.value}`,
      impact: d.value < 20 ? 'high' : 'medium',
      confidence: (100 - d.value) / 100,
      recommendation: `Revisar estrategia de ${d.label}`,
      status: (100 - d.value) >= 70 ? 'active' : 'suggestion',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
  });

  return lessons;
}

export function detectPatterns(lessons: LearningRecord[]): { success: string[]; failure: string[]; recurring: string[] } {
  const success = lessons.filter(l => l.type.includes('success') || l.type === 'strong_cluster' || l.type === 'effective_title').map(l => l.patternDetected);
  const failure = lessons.filter(l => l.type.includes('failure') || l.type === 'weak_cluster').map(l => l.patternDetected);
  const recurring = lessons.filter(l => l.type === 'recurring_failure').map(l => l.patternDetected);
  return { success, failure, recurring };
}
