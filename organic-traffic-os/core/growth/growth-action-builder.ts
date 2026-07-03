import { GrowthAction, GrowthActionType, GrowthRisk } from './growth.types';

let counter = 0;

export function createGrowthAction(params: {
  workspaceId: string;
  type: GrowthActionType;
  title: string;
  description: string;
  expectedImpact?: number;
  effort?: number;
  confidence?: number;
  risk?: GrowthRisk;
  dependencies?: string[];
  origin: string;
  recommendedWorkflow?: string;
  contentId?: string;
}): GrowthAction {
  const now = new Date().toISOString();
  const impact = params.expectedImpact ?? Math.floor(Math.random() * 40 + 60);
  const effort = params.effort ?? Math.floor(Math.random() * 50 + 20);
  const confidence = params.confidence ?? (Math.random() * 0.3 + 0.7);
  const riskScore = params.risk === 'high' ? 30 : params.risk === 'medium' ? 15 : 5;
  const priority = Math.max(0, Math.min(100, impact - effort + confidence * 20 - riskScore));

  return {
    id: `growth-${params.workspaceId}-${++counter}`,
    workspaceId: params.workspaceId,
    contentId: params.contentId,
    type: params.type,
    title: params.title,
    description: params.description,
    expectedImpact: impact,
    effort,
    priority: Math.round(priority),
    confidence,
    risk: params.risk || 'low',
    dependencies: params.dependencies || [],
    status: 'pending_approval',
    recommendedWorkflow: params.recommendedWorkflow,
    origin: params.origin,
    createdAt: now,
    updatedAt: now,
  };
}
