import { ResearchPack, ResearchReference } from '../research-agent/research-agent.types';

export interface FactInput {
  blog_id: string;
  research_pack: ResearchPack;
  mode: 'mock' | 'manual' | 'pipeline';
}

export type FactStatus = 'approved' | 'pending' | 'rejected';
export type ConfidenceGrade = 'A' | 'B' | 'C' | 'D' | 'F';

// ── Fact Model ────────────────────────────────────────────────────────────────
export interface Fact {
  id: string;
  descricao: string;
  categoria: string;
  origem: string;
  fonte_id: string;
  evidencias: string[];
  nivel_de_confianca: number; // 0-100
  status: FactStatus;
  ultima_verificacao: string;
  versao: string;
  observacoes: string;
}

// ── Conflict Model ────────────────────────────────────────────────────────────
export interface FactConflict {
  id: string;
  fato: string;
  fontes_conflitantes: string[];
  descricao_do_conflito: string;
  impacto: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved' | 'dismissed';
  acao_recomendada: string;
  necessita_revisao_humana: boolean;
}

// ── Evidence Pack ─────────────────────────────────────────────────────────────
export interface EvidencePack {
  id: string;
  content_id: string;
  research_pack_id: string;
  versao: string;
  data: string;
  status: 'approved' | 'partial' | 'rejected';
  autoridade_media: number;
  confiabilidade_media: number;
  fatos_aprovados: Fact[];
  fatos_pendentes: Fact[];
  fatos_rejeitados: Fact[];
  fontes_relacionadas: ResearchReference[];
  conflitos: FactConflict[];
  observacoes: string;
}

// ── Confidence Report ─────────────────────────────────────────────────────────
export interface ConfidenceReport {
  total_fatos: number;
  aprovados: number;
  pendentes: number;
  rejeitados: number;
  confianca_media: number;
  grade: ConfidenceGrade;
  total_conflitos: number;
  conflitos_abertos: number;
  fontes_unicas: number;
  rastreabilidade_pct: number;
}

// ── Full Report ───────────────────────────────────────────────────────────────
export interface FactReport {
  agent: string;
  blog_id: string;
  evidence_pack: EvidencePack;
  confidence: ConfidenceReport;
  warnings: string[];
  approved: boolean;
  created_at: string;
}
