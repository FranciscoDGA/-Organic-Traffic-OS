export interface AuthorityItem {
  id: string;
  url: string;
  title: string;
  type: 'post' | 'page' | 'pillar' | 'category' | 'brief' | 'draft' | 'other';
  cluster?: string;
  entities?: string[];
  keywords?: string[];
  internal_links_out: number;
  internal_links_in: number;
  word_count: number;
  pubDate?: string;
  source: 'inventory' | 'knowledge' | 'content_intelligence' | 'semantic_intelligence' | 'publishing';
}

export interface Cluster {
  name: string;
  items: string[];
  pillar_id?: string;
  total_words: number;
  avg_internal_links: number;
  keywords: string[];
  entities: string[];
}

export interface EntityAuthority {
  name: string;
  type: 'organization' | 'product' | 'concept' | 'person' | 'location' | 'other';
  mentions: number;
  items_referenced: string[];
  clusters_referenced: string[];
  has_pillar: boolean;
}

export interface InternalLink {
  source_id: string;
  target_id: string;
  source_url: string;
  target_url: string;
  anchor?: string;
}

export interface PillarPage {
  id: string;
  url: string;
  title: string;
  cluster: string;
  word_count: number;
  internal_links_in: number;
  internal_links_out: number;
  coverage_score: number;
}

export interface AuthorityScores {
  topical: number;
  cluster: number;
  entity: number;
  internal_linking: number;
  pillar_coverage: number;
  source: number;
  overall: number;
}

export interface AuthorityRecommendation {
  id: string;
  type: 'create_pillar' | 'expand_cluster' | 'add_internal_links' | 'strengthen_entity' | 'improve_source' | 'consolidate_topic' | 'build_cluster';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  cluster?: string;
  entity?: string;
  impact: string;
  effort: string;
  scores: Partial<AuthorityScores>;
}

export interface AuthorityIntelligenceReport {
  timestamp: string;
  total_items: number;
  total_clusters: number;
  total_entities: number;
  total_internal_links: number;
  total_pillar_pages: number;
  overall_scores: AuthorityScores;
  items: AuthorityItem[];
  clusters: Cluster[];
  entity_authority: EntityAuthority[];
  internal_links: InternalLink[];
  pillar_pages: PillarPage[];
  pillar_gaps: { cluster: string; recommended_keywords: string[]; reason: string }[];
  weak_clusters: { cluster: string; score: number; reason: string }[];
  recommendations: AuthorityRecommendation[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
}

export interface AnalysisInput {
  knowledge_core?: any[];
  inventory_data?: any[];
  content_intelligence?: any;
  semantic_intelligence?: any;
  keywords_data?: any[];
  clusters_data?: any[];
  internal_links?: any[];
  sources_data?: any[];
  performance_data?: any[];
  publishing_packages?: any[];
}
