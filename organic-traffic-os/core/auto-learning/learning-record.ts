import { LearningRecord, LearningType, LearningCategory } from './auto-learning.types';

let counter = 0;

export function createLearningRecord(params: {
  workspaceId: string;
  origin: string;
  type: LearningType;
  category: LearningCategory;
  description: string;
  patternDetected: string;
  evidence: string;
  impact?: 'low' | 'medium' | 'high';
  confidence?: number;
  recommendation: string;
}): LearningRecord {
  const now = new Date().toISOString();
  return {
    id: `learn-${params.workspaceId}-${++counter}`,
    workspaceId: params.workspaceId,
    origin: params.origin,
    type: params.type,
    category: params.category,
    description: params.description,
    patternDetected: params.patternDetected,
    evidence: params.evidence,
    impact: params.impact || 'medium',
    confidence: params.confidence ?? 0.8,
    recommendation: params.recommendation,
    status: (params.confidence ?? 0.8) >= 0.7 ? 'active' : 'suggestion',
    createdAt: now,
    updatedAt: now,
  };
}
