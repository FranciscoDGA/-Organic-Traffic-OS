export interface SemanticItem {
  id: string;
  url: string;
  title: string;
  content: string;
  type: 'post' | 'page' | 'brief' | 'draft' | 'research_pack' | 'source' | 'other';
  keywords?: string[];
  entities?: string[];
  topics?: string[];
  questions?: string[];
}

export interface SemanticMetrics {
  item_id: string;
  word_count: number;
  keyword_count: number;
  entity_count: number;
  topic_count: number;
  question_count: number;
  internal_links: number;
  external_links: number;
  headings: number;
  avg_sentence_length: number;
  readability_score: number;
}

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'product' | 'concept' | 'event' | 'other';
  frequency: number;
  contexts: string[];
  items_referenced: string[];
}

export interface Topic {
  name: string;
  keywords: string[];
  frequency: number;
  depth: number;
  items_referenced: string[];
  coverage_score: number;
}

export interface SemanticQuestion {
  question: string;
  topic: string;
  answer_coverage: number;
  items_answered: string[];
  items_unanswered: string[];
}

export interface SemanticGap {
  id: string;
  type: 'entity_missing' | 'topic_missing' | 'question_unanswered' | 'keyword_missing' | 'depth_insufficient' | 'cluster_incomplete';
  description: string;
  topic: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  recommendation: string;
  related_items: string[];
}

export interface SemanticScores {
  coverage: number;
  entity_coverage: number;
  topic_depth: number;
  question_answering: number;
  topical_authority: number;
  completeness: number;
}

export interface SemanticRecommendation {
  id: string;
  type: 'cover_entity' | 'deepen_topic' | 'answer_question' | 'add_keyword' | 'create_content' | 'expand_cluster' | 'improve_depth';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  topic: string;
  impact: string;
  effort: string;
  scores: Partial<SemanticScores>;
}

export interface SemanticIntelligenceReport {
  timestamp: string;
  total_items: number;
  total_entities: number;
  total_topics: number;
  total_questions: number;
  total_gaps: number;
  overall_scores: SemanticScores;
  items: SemanticItem[];
  items_with_metrics: { item: SemanticItem; metrics: SemanticMetrics }[];
  entities: Entity[];
  topics: Topic[];
  questions: SemanticQuestion[];
  gaps: SemanticGap[];
  recommendations: SemanticRecommendation[];
  logs: { timestamp: string; level: string; action: string; message: string; duration_ms?: number }[];
}

export interface AnalysisInput {
  knowledge_core?: any[];
  keywords_data?: any[];
  serp_data?: any[];
  inventory_data?: any[];
  research_packs?: any[];
  drafts?: any[];
  visibility_reports?: any[];
  sources?: any[];
  facts?: any[];
}
