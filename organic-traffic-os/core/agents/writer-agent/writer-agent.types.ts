import { ResearchPack } from '../research-agent/research-agent.types';
import { EvidencePack } from '../fact-agent/fact-agent.types';

export interface WriterInput {
  blog_id: string;
  research_pack: ResearchPack;
  evidence_pack: EvidencePack;
  mode: 'mock' | 'manual' | 'pipeline';
}

export type DraftStatus = 'drafting' | 'completed' | 'needs_review' | 'failed';

export interface SeoData {
  title: string;
  meta_description: string;
  focus_keyword: string;
  secondary_keywords: string[];
}

export interface DraftMetrics {
  word_count: number;
  reading_time_minutes: number;
  headings_count: number;
  paragraphs_count: number;
}

export interface DraftPack {
  id: string;
  content_id: string;
  evidence_pack_id: string;
  status: DraftStatus;
  seo_data: SeoData;
  content_markdown: string;
  content_html: string;
  metrics: DraftMetrics;
  created_at: string;
  updated_at: string;
  warnings: string[];
}

export interface WriterReport {
  agent: string;
  blog_id: string;
  draft_pack: DraftPack;
  success: boolean;
  message: string;
  created_at: string;
}
