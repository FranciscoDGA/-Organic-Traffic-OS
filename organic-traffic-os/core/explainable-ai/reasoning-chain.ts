import { ReasoningStep, Evidence } from './explainable.types';

let stepCounter = 0;

export function generateReasoning(params: { decision: string; evidence: Evidence[]; context?: string }): ReasoningStep[] {
  const { evidence } = params;
  const steps: ReasoningStep[] = [];
  steps.push({ step: ++stepCounter, description: 'Coleta de evidencias iniciais', evidence_ids: evidence.slice(0, 3).map(e => e.id), conclusion: `${evidence.length} evidencias coletadas` });
  if (params.context) steps.push({ step: ++stepCounter, description: 'Analise de contexto', evidence_ids: evidence.filter(e => e.source === 'context').map(e => e.id), conclusion: `Contexto: ${params.context}` });
  const highWeight = evidence.filter(e => e.weight >= 0.8);
  if (highWeight.length > 0) steps.push({ step: ++stepCounter, description: 'Evidencias de alto peso', evidence_ids: highWeight.map(e => e.id), conclusion: `${highWeight.length} evidencias de alto peso identificadas` });
  steps.push({ step: ++stepCounter, description: 'Construcao da justificativa', evidence_ids: evidence.map(e => e.id), conclusion: params.decision });
  return steps;
}
