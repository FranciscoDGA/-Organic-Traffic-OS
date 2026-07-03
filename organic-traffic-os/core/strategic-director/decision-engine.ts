import { StrategicDecision } from './strategic.types';

let decCounter = 100;

export function generateDecision(params: { workspaceId: string; missionId: string; type: StrategicDecision['type']; reason: string; impact: StrategicDecision['impact']; confidence: number }): StrategicDecision {
  return {
    id: `dec-${++decCounter}`,
    workspaceId: params.workspaceId,
    missionId: params.missionId,
    type: params.type,
    origin: 'Decision Engine',
    reason: params.reason,
    impact: params.impact,
    confidence: params.confidence,
    priority: params.impact === 'high' ? 'high' : params.impact === 'medium' ? 'medium' : 'low',
    recommendation: params.reason,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function approveDecision(decision: StrategicDecision): StrategicDecision {
  return { ...decision, status: 'approved' };
}

export function rejectDecision(decision: StrategicDecision): StrategicDecision {
  return { ...decision, status: 'rejected' };
}
