export interface ContentItem {
  id: string;
  url: string;
  title: string;
  type: 'post' | 'page' | 'category' | 'other';
  pubDate?: string;
  updatedDate?: string;
  source: 'gsc' | 'ga4' | 'bing' | 'rss' | 'wordpress' | 'inventory';
}

export interface ContentMetrics {
  content_id: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  sessions: number;
  pageviews: number;
  bounce_rate: number;
  avg_time_on_page: number;
}

export interface ContentScores {
  health: number;
  opportunity: number;
  risk: number;
  freshness: number;
  authority: number;
  potential: number;
  growth: number;
}

export interface ContentRecommendation {
  id: string;
  type: 'update' | 'create' | 'optimize' | 'cluster' | 'fix' | 'monitor';
  priority: 'critical' | 'high' | 'medium' | 'low';
  content_id?: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  scores: Partial<ContentScores>;
}

export interface ContentIntelligenceReport {
  timestamp: string;
  total_content: number;
  total_analyzed: number;
  overall_scores: ContentScores;
  content_items: ContentItem[];
  content_with_scores: { item: ContentItem; metrics: ContentMetrics; scores: ContentScores }[];
  recommendations: ContentRecommendation[];
  critical_content: { item: ContentItem; scores: ContentScores; reason: string }[];
  promising_content: { item: ContentItem; scores: ContentScores; reason: string }[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
}

export interface AnalysisInput {
  gsc_data?: any[];
  ga4_data?: any[];
  bing_data?: any[];
  trends_data?: any[];
  rss_data?: any[];
  inventory_data?: any[];
}
