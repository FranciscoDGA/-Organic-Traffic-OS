import { DecisionExplanation, Evidence, EvidenceSource } from './explainable.types';

let evidenceCounter = 0;

export function buildEvidence(params: { source: EvidenceSource; source_id: string; description: string; weight: number; value: unknown }): Evidence {
  return { id: `ev-${Date.now()}-${++evidenceCounter}`, source: params.source, source_id: params.source_id, description: params.description, weight: params.weight, value: params.value };
}

export function collectEvidence(params: { engine?: string; agent?: string; connectors?: string[]; kpis?: Record<string, number>; memory?: string[]; knowledge_graph?: string[]; context?: string; opportunity_score?: number; growth_score?: number; risk_score?: number }): Evidence[] {
  const evidence: Evidence[] = [];
  if (params.engine) evidence.push(buildEvidence({ source: 'engine', source_id: params.engine, description: `Engine ${params.engine} utilized`, weight: 0.9, value: params.engine }));
  if (params.agent) evidence.push(buildEvidence({ source: 'agent', source_id: params.agent, description: `Agent ${params.agent} responsible`, weight: 0.8, value: params.agent }));
  if (params.connectors) params.connectors.forEach(c => evidence.push(buildEvidence({ source: 'connector', source_id: c, description: `Connector ${c} used`, weight: 0.7, value: c })));
  if (params.kpis) Object.entries(params.kpis).forEach(([k, v]) => evidence.push(buildEvidence({ source: 'kpi', source_id: k, description: `KPI ${k}: ${v}`, weight: 0.85, value: v })));
  if (params.memory) params.memory.forEach(m => evidence.push(buildEvidence({ source: 'memory', source_id: m, description: `Memory: ${m}`, weight: 0.75, value: m })));
  if (params.knowledge_graph) params.knowledge_graph.forEach(kg => evidence.push(buildEvidence({ source: 'knowledge-graph', source_id: kg, description: `Knowledge Graph: ${kg}`, weight: 0.8, value: kg })));
  if (params.context) evidence.push(buildEvidence({ source: 'context', source_id: 'context-package', description: `Context: ${params.context}`, weight: 0.7, value: params.context }));
  if (params.opportunity_score !== undefined) evidence.push(buildEvidence({ source: 'opportunity-score', source_id: 'opp-score', description: `Opportunity Score: ${params.opportunity_score}`, weight: 0.85, value: params.opportunity_score }));
  if (params.growth_score !== undefined) evidence.push(buildEvidence({ source: 'growth-score', source_id: 'growth-score', description: `Growth Score: ${params.growth_score}`, weight: 0.8, value: params.growth_score }));
  if (params.risk_score !== undefined) evidence.push(buildEvidence({ source: 'risk-score', source_id: 'risk-score', description: `Risk Score: ${params.risk_score}`, weight: 0.9, value: params.risk_score }));
  return evidence;
}
