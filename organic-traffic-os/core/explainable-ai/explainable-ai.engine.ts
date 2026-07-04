import { DecisionExplanation } from './explainable.types';

export function buildAuditTrail(explanation: DecisionExplanation): { timestamp: string; action: string; details: string }[] {
  return [
    { timestamp: explanation.created_at, action: 'decision-made', details: `Decision: ${explanation.decision}` },
    { timestamp: explanation.created_at, action: 'evidence-collected', details: `${explanation.evidence.length} evidence items` },
    { timestamp: explanation.created_at, action: 'confidence-calculated', details: `Score: ${explanation.confidence}%` },
    { timestamp: explanation.created_at, action: 'explanation-registered', details: `ID: ${explanation.id}` },
  ];
}
