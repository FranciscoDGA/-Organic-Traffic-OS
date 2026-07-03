import { OptimizedDraft, VisibilityReport, VisibilityMetadata, SchemaMarkup } from '../visibility-agent/visibility-agent.types';

export interface PublishingConfig {
  target_adapters: string[]; // e.g., ['json', 'markdown', 'html', 'wordpress']
  auto_publish: boolean;
}

export interface PublishingInput {
  blog_id: string;
  optimized_draft: OptimizedDraft;
  visibility_report: VisibilityReport;
  metadata: VisibilityMetadata;
  schema: SchemaMarkup;
  config: PublishingConfig;
  mode: 'mock' | 'manual' | 'pipeline';
}

export interface PublicationPackage {
  id: string;
  content_id: string;
  version: string;
  title: string;
  slug: string;
  language: string;
  status: 'prepared' | 'published' | 'failed';
  metadata: VisibilityMetadata;
  schema: SchemaMarkup;
  html: string;
  markdown: string;
  json: any;
  assets: any[];
  checksum: string;
  created_at: string;
}

export interface ExportReport {
  adapter: string;
  status: 'success' | 'failed';
  exported_at: string;
  url?: string;
  error?: string;
}

export interface PublishingReport {
  id: string;
  content_id: string;
  package: PublicationPackage;
  exports: ExportReport[];
  warnings: string[];
  created_at: string;
}

export interface PublishingAgentOutput {
  agent: string;
  blog_id: string;
  report: PublishingReport;
  success: boolean;
  message: string;
}
