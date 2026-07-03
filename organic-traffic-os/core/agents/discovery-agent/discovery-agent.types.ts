export type DiscoveryMode = 'manual' | 'mock' | 'pipeline';
export type OpportunityType = 'article' | 'faq' | 'guide' | 'landing-page' | 'checklist' | 'glossary' | 'timeline' | 'comparison' | 'ebook' | 'newsletter';
export type OpportunityPriority = 'critical' | 'high' | 'medium' | 'low';

export interface DiscoveryInput {
  blog_id: string;
  topic: string;
  mode: DiscoveryMode;
  limit: number;
}

export interface DiscoveryOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  category: string;
  cluster: string;
  intent: string;
  priority: OpportunityPriority;
  score: number;
  reason: string;
  source: string;
  confidence: number;
  next_step: string;
}

export interface DiscoverySummary {
  total_found: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  avg_score: number;
  top_cluster: string;
}

export interface DiscoveryReport {
  agent: string;
  blog_id: string;
  topic: string;
  opportunities: DiscoveryOpportunity[];
  summary: DiscoverySummary;
  warnings: string[];
  created_at: string;
}
