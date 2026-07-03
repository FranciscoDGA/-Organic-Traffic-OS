export type LearningType = 'content_success' | 'content_failure' | 'promising_topic' | 'strong_cluster' | 'weak_cluster' | 'effective_cta' | 'effective_title' | 'reliable_source' | 'effective_format' | 'recurring_failure' | 'detected_risk' | 'repeated_opportunity';

export type LearningCategory = 'performance' | 'pattern' | 'risk' | 'opportunity' | 'strategy';

export interface LearningRecord {
  id: string;
  workspaceId: string;
  origin: string;
  type: LearningType;
  category: LearningCategory;
  description: string;
  patternDetected: string;
  evidence: string;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  recommendation: string;
  status: 'active' | 'suggestion' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface LearningReport {
  id: string;
  workspaceId: string;
  totalLessons: number;
  successPatterns: number;
  failurePatterns: number;
  avgConfidence: number;
  recommendations: string[];
  createdAt: string;
}

export interface PatternReport {
  workspaceId: string;
  successPatterns: string[];
  failurePatterns: string[];
  recurringFailures: string[];
  opportunities: string[];
}
