import { DraftPack } from '../writer-agent/writer-agent.types';
import { EvidencePack } from '../fact-agent/fact-agent.types';
import { ResearchPack } from '../research-agent/research-agent.types';

export interface ReviewInput {
  blog_id: string;
  draft_pack: DraftPack;
  research_pack: ResearchPack;
  evidence_pack: EvidencePack;
  mode: 'mock' | 'manual' | 'pipeline';
}

export interface ReviewChecklist {
  titulo_adequado: boolean;
  introducao_clara: boolean;
  estrutura_correta: boolean;
  h2_presentes: boolean;
  h3_presentes: boolean;
  faq_presente: boolean;
  cta_presente: boolean;
  conclusao_adequada: boolean;
  objetivo_atendido: boolean;
}

export interface QualityScore {
  clareza: number;
  didatica: number;
  fluidez: number;
  organizacao: number;
  cobertura_tema: number;
  uso_fatos: number;
  uso_fontes: number;
  consistencia: number;
  tom_voz: number;
  aderencia_brief: number;
  pontuacao_final: number;
}

export interface ReviewReport {
  id: string;
  content_id: string;
  draft_id: string;
  status: 'approved' | 'revision_requested' | 'rejected';
  quality_score: QualityScore;
  checklist: ReviewChecklist;
  warnings: string[];
  recommendations: string[];
  approved: boolean;
  created_at: string;
}

export interface ReviewAgentOutput {
  agent: string;
  blog_id: string;
  report: ReviewReport;
  success: boolean;
  message: string;
}
