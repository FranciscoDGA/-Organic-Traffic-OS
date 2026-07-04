export type DecisionType = 'mission-selection' | 'workflow-priority' | 'content-strategy' | 'resource-allocation' | 'risk-assessment' | 'opportunity-prioritization' | 'growth-recommendation' | 'experiment-selection' | 'learning-application' | 'publishing-timing';
export type ConfidenceLevel = 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
export type EvidenceSource = 'engine' | 'agent' | 'connector' | 'kpi' | 'memory' | 'knowledge-graph' | 'context' | 'opportunity-score' | 'growth-score' | 'risk-score';

export interface Evidence {
  id: string;
  source: EvidenceSource;
  source_id: string;
  description: string;
  weight: number;
  value: unknown;
}

export interface ReasoningStep {
  step: number;
  description: string;
  evidence_ids: string[];
  conclusion: string;
}

export interface DecisionExplanation {
  id: string;
  workspace_id: string;
  origin: string;
  component: string;
  type: DecisionType;
  decision: string;
  justificativa: string;
  evidence: Evidence[];
  data_used: Record<string, unknown>;
  score: number;
  confidence: number;
  confidence_level: ConfidenceLevel;
  limitations: string[];
  reasoning_chain: ReasoningStep[];
  created_at: string;
}

export interface ConfidenceScores {
  decision_confidence: number;
  evidence_strength: number;
  data_quality: number;
  prediction_confidence: number;
  recommendation_confidence: number;
  overall_explainability: number;
}
