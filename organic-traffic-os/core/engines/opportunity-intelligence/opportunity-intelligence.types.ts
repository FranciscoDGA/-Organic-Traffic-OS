export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  type: 'new_content' | 'update' | 'pillar_page' | 'satellite_article' | 'faq' | 'simulado' | 'checklist' | 'landing' | 'internal_linking' | 'cta_improvement' | 'cluster_expansion';
  topic: string;
  cluster?: string;
  keywords: string[];
  entities: string[];
  source_signals: string[];
  reason: string;
  traffic_potential: number;
  difficulty: number;
  monetization: number;
  freshness: number;
  authority_fit: number;
  content_gap: number;
  strategic_priority: number;
  opportunity_score: number;
  effort: 'baixo' | 'medio' | 'alto';
  impact: 'baixo' | 'medio' | 'alto' | 'critico';
  estimated_time_hours: number;
  related_items: string[];
}

export interface SignalData {
  gsc_data?: any[];
  ga4_data?: any[];
  bing_data?: any[];
  trends_data?: any[];
  rss_data?: any[];
  keywords_data?: any[];
  serp_data?: any[];
  inventory_data?: any[];
  performance_data?: any[];
  competitors_data?: any[];
}

export interface IntelligenceData {
  content_intelligence?: any;
  semantic_intelligence?: any;
  authority_intelligence?: any;
}

export interface OpportunityScores {
  opportunity: number;
  traffic_potential: number;
  difficulty: number;
  monetization: number;
  freshness: number;
  authority_fit: number;
  content_gap: number;
  strategic_priority: number;
}

export interface OpportunityRecommendation {
  id: string;
  type: OpportunityItem['type'];
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reason: string;
  topic: string;
  impact: string;
  effort: string;
  scores: Partial<OpportunityScores>;
}

export interface OpportunityIntelligenceReport {
  timestamp: string;
  total_opportunities: number;
  quick_wins: OpportunityItem[];
  strategic_opportunities: OpportunityItem[];
  refresh_opportunities: OpportunityItem[];
  cluster_opportunities: OpportunityItem[];
  conversion_opportunities: OpportunityItem[];
  all_opportunities: OpportunityItem[];
  ranked_opportunities: OpportunityItem[];
  overall_scores: OpportunityScores;
  signals_analyzed: string[];
  recommendations: OpportunityRecommendation[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
}

export interface AnalysisInput {
  signal_data?: SignalData;
  intelligence_data?: IntelligenceData;
  direct_input?: any;
}
