export interface DiscoveryInput {
  blog_id: string;
  topic: string;
  mode: 'manual' | 'mock' | 'pipeline';
  limit: number;
}

export interface DiscoveryOpportunity {
  id: string;
  title: string;
  type: string;
  category: string;
  cluster: string;
  intent: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  reason: string;
  source: string;
  confidence: number;
  next_step: string;
}

export interface DiscoveryOutput {
  agent: string;
  blog_id: string;
  topic: string;
  opportunities: DiscoveryOpportunity[];
  summary: {
    total_found: number;
    high_priority: number;
  };
  warnings: string[];
  created_at: string;
}
