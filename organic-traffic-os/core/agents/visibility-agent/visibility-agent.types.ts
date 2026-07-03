import { DraftPack } from '../writer-agent/writer-agent.types';
import { ReviewReport } from '../review-agent/review-agent.types';
import { EvidencePack } from '../fact-agent/fact-agent.types';

export interface VisibilityInput {
  blog_id: string;
  draft_pack: DraftPack;
  review_report: ReviewReport;
  evidence_pack: EvidencePack;
  mode: 'mock' | 'manual' | 'pipeline';
}

export interface VisibilityScore {
  seo_tecnico: number;
  legibilidade: number;
  cobertura_semantica: number;
  cobertura_entidades: number;
  heading_structure: number;
  schema_readiness: number;
  internal_linking: number;
  external_references: number;
  snippet_readiness: number;
  ai_readability: number;
  ai_citation_readiness: number;
  pontuacao_final: number;
}

export interface EntityCoverage {
  obrigatorias: string[];
  secundarias: string[];
  relacionadas: string[];
  ausencias: string[];
  recomendacoes: string[];
}

export interface VisibilityMetadata {
  meta_title: string;
  meta_description: string;
  slug: string;
  canonical: string;
  open_graph: any;
  twitter_card: any;
  robots: string;
  language: string;
  author: string;
  updated_date: string;
}

export interface SchemaMarkup {
  types: string[]; // e.g. ['Article', 'FAQPage', 'BreadcrumbList']
  json_ld: string;
}

export interface SnippetSuggestions {
  featured_snippet: string;
  people_also_ask: string[];
  resumo_executivo: string;
  faq_otimizado: boolean;
  resumo_ia: string;
}

export interface OptimizedDraft {
  content_markdown: string;
  content_html: string;
  internal_links_added: number;
  external_links_added: number;
}

export interface VisibilityReport {
  id: string;
  content_id: string;
  draft_id: string;
  optimized_draft: OptimizedDraft;
  score: VisibilityScore;
  entity_coverage: EntityCoverage;
  metadata: VisibilityMetadata;
  schema: SchemaMarkup;
  snippets: SnippetSuggestions;
  warnings: string[];
  created_at: string;
}

export interface VisibilityAgentOutput {
  agent: string;
  blog_id: string;
  report: VisibilityReport;
  success: boolean;
  message: string;
}
