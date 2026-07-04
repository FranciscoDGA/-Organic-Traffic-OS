import { DecisionExplanation, DecisionType, ConfidenceScores, ConfidenceLevel } from './explainable.types';
import { collectEvidence } from './evidence-builder';
import { calculateConfidence, getConfidenceLevel } from './confidence-calculator';
import { generateReasoning } from './reasoning-chain';
import { addToHistory, getHistory, getById, getByWorkspace } from './decision-history';
import { validateExplanation } from './explainable-validator';
import { buildAuditTrail } from './explainable-ai.engine';

let decisionCounter = 0;

export function getExplainableService() {
  return {
    explain(params: { workspace_id: string; origin: string; component: string; type: DecisionType; decision: string; justificativa: string; data_used: Record<string, unknown>; score: number; limitations?: string[] }) {
      const evidence = collectEvidence({ engine: params.component, kpis: params.data_used as Record<string, number> });
      const confidenceScores = calculateConfidence(evidence, 0.8);
      const reasoning = generateReasoning({ decision: params.decision, evidence, context: params.component });
      const explanation: DecisionExplanation = {
        id: `xai-${Date.now()}-${++decisionCounter}`, workspace_id: params.workspace_id, origin: params.origin, component: params.component, type: params.type, decision: params.decision, justificativa: params.justificativa, evidence, data_used: params.data_used, score: params.score, confidence: confidenceScores.overall_explainability, confidence_level: getConfidenceLevel(confidenceScores.overall_explainability), limitations: params.limitations || [], reasoning_chain: reasoning, created_at: new Date().toISOString(),
      };
      addToHistory(explanation);
      return { explanation, confidence_scores: confidenceScores, audit_trail: buildAuditTrail(explanation) };
    },
    getHistory(limit?: number) { return getHistory(limit); },
    getById(id: string) { return getById(id); },
    getByWorkspace(workspaceId: string) { return getByWorkspace(workspaceId); },
  };
}
