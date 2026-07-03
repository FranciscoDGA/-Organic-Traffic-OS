export interface HistoricalDataPoint {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  sessions: number;
  pageviews: number;
  bounce_rate: number;
  avg_time_on_page: number;
}

export interface ContentHistory {
  id: string;
  url: string;
  title: string;
  cluster?: string;
  pubDate: string;
  lastUpdate?: string;
  data_points: HistoricalDataPoint[];
  current_clicks: number;
  current_impressions: number;
  current_ctr: number;
  current_position: number;
  word_count: number;
  internal_links_in: number;
  internal_links_out: number;
}

export interface TrafficForecast {
  content_id: string;
  current_traffic: number;
  predicted_30d: number;
  predicted_90d: number;
  predicted_180d: number;
  growth_rate: number;
  confidence: number;
}

export interface RankingForecast {
  content_id: string;
  current_position: number;
  predicted_position_30d: number;
  predicted_position_90d: number;
  improvement_probability: number;
  decline_probability: number;
  confidence: number;
}

export interface GrowthForecast {
  content_id: string;
  current_growth_rate: number;
  predicted_growth_rate: number;
  acceleration: number;
  potential: 'high' | 'medium' | 'low';
  confidence: number;
}

export interface RiskForecast {
  content_id: string;
  risk_type: 'decay' | 'obsolescence' | 'competition' | 'algorithm' | 'seasonal';
  probability: number;
  severity: 'high' | 'medium' | 'low';
  timeframe: '30d' | '90d' | '180d';
  mitigation: string;
  confidence: number;
}

export interface RefreshForecast {
  content_id: string;
  refresh_needed: boolean;
  probability: number;
  recommended_date: string;
  reason: string;
  impact_if_refreshed: number;
  confidence: number;
}

export interface Scenario {
  name: 'conservative' | 'probable' | 'optimistic';
  description: string;
  assumptions: string[];
  indicators: { metric: string; value: number }[];
  risks: string[];
  opportunities: string[];
  confidence: number;
  traffic_multiplier: number;
  ranking_improvement: number;
}

export interface PredictionScores {
  confidence: number;
  growth_potential: number;
  content_longevity: number;
  refresh_probability: number;
  traffic_forecast: number;
  strategic_value: number;
  overall: number;
}

export interface PredictionItem {
  content_id: string;
  title: string;
  cluster?: string;
  traffic_forecast: TrafficForecast;
  ranking_forecast: RankingForecast;
  growth_forecast: GrowthForecast;
  risk_forecast: RiskForecast;
  refresh_forecast: RefreshForecast;
  scores: PredictionScores;
}

export interface PredictionRecommendation {
  id: string;
  type: 'refresh' | 'expand' | 'protect' | 'invest' | 'consolidate' | 'monitor' | 'retire';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  content_id?: string;
  cluster?: string;
  reason: string;
  impact: string;
  effort: string;
  timeframe: string;
  confidence: number;
}

export interface PredictionIntelligenceReport {
  timestamp: string;
  total_items: number;
  items_analyzed: number;
  overall_scores: PredictionScores;
  traffic_forecasts: TrafficForecast[];
  ranking_forecasts: RankingForecast[];
  growth_forecasts: GrowthForecast[];
  risk_forecasts: RiskForecast[];
  refresh_forecasts: RefreshForecast[];
  scenarios: Scenario[];
  predictions: PredictionItem[];
  recommendations: PredictionRecommendation[];
  warnings: string[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
}

export interface AnalysisInput {
  content_history?: ContentHistory[];
  performance_data?: any[];
  gsc_data?: any[];
  ga4_data?: any[];
  trends_data?: any[];
  publishing_history?: any[];
  monitoring_reports?: any[];
  knowledge_core?: any[];
  inventory_data?: any[];
  content_intelligence?: any;
  semantic_intelligence?: any;
  authority_intelligence?: any;
  opportunity_intelligence?: any;
}
