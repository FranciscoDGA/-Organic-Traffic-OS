import { ConfidenceScores, ConfidenceLevel } from './explainable.types';

export function calculateConfidence(evidence: { weight: number }[], dataCompleteness: number): ConfidenceScores {
  const avgWeight = evidence.length > 0 ? evidence.reduce((s, e) => s + e.weight, 0) / evidence.length : 0;
  const evidenceStrength = Math.round(avgWeight * 100);
  const dataQuality = Math.round(dataCompleteness * 100);
  const decision_confidence = Math.round((evidenceStrength * 0.4 + dataQuality * 0.3 + Math.min(evidence.length * 10, 30)));
  const prediction_confidence = Math.round(decision_confidence * 0.85);
  const recommendation_confidence = Math.round(decision_confidence * 0.9);
  const overall_explainability = Math.round((decision_confidence + evidenceStrength + dataQuality + prediction_confidence + recommendation_confidence) / 5);
  return { decision_confidence: Math.min(100, decision_confidence), evidence_strength: Math.min(100, evidenceStrength), data_quality: Math.min(100, dataQuality), prediction_confidence: Math.min(100, prediction_confidence), recommendation_confidence: Math.min(100, recommendation_confidence), overall_explainability: Math.min(100, overall_explainability) };
}

export function getConfidenceLevel(score: number): ConfidenceLevel {
  return score >= 90 ? 'very-high' : score >= 75 ? 'high' : score >= 50 ? 'medium' : score >= 25 ? 'low' : 'very-low';
}
