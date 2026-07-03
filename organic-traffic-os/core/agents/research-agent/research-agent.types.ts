import { BacklogItem } from '../planning-agent/planning-agent.types';

export interface ResearchInput {
  blog_id: string;
  backlog_item: BacklogItem;
  mode: 'mock' | 'manual' | 'pipeline';
}

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unverified';
export type ResearchStatus = 'complete' | 'partial' | 'pending';

// ── Entity Map ────────────────────────────────────────────────────────────────
export interface ResearchEntity {
  nome: string;
  tipo: 'pessoa' | 'lugar' | 'organizacao' | 'conceito' | 'lei' | 'data' | 'cargo';
  importancia: 'critical' | 'high' | 'medium' | 'low';
  relacionamentos: string[];
  obrigatoria: boolean;
}

// ── Question Map ──────────────────────────────────────────────────────────────
export interface ResearchQuestion {
  pergunta: string;
  prioridade: 'critical' | 'high' | 'medium' | 'low';
  origem: string;
  respondida: boolean;
  resposta?: string;
}

// ── Reference List ────────────────────────────────────────────────────────────
export interface ResearchReference {
  titulo: string;
  tipo: 'edital' | 'lei' | 'artigo' | 'site-oficial' | 'manual' | 'portaria';
  fonte: string;
  url?: string;
  autor?: string;
  data?: string;
  confianca: ConfidenceLevel;
  status: 'validado' | 'pendente' | 'rejeitado';
}

// ── Research Pack ─────────────────────────────────────────────────────────────
export interface ResearchPack {
  id: string;
  content_id: string;
  titulo: string;
  objetivo: string;
  cluster: string;
  categoria: string;
  persona: string;
  resumo_executivo: string;
  contexto: string;
  principais_topicos: string[];
  perguntas_obrigatorias: ResearchQuestion[];
  entidades_obrigatorias: ResearchEntity[];
  fontes_consultadas: ResearchReference[];
  fatos_conhecidos: string[];
  fatos_pendentes: string[];
  links_internos_sugeridos: string[];
  links_externos_sugeridos: string[];
  observacoes: string;
  status: ResearchStatus;
  versao: string;
  created_at: string;
}

// ── Summary ───────────────────────────────────────────────────────────────────
export interface ResearchSummary {
  total_fatos: number;
  fatos_validados: number;
  fatos_pendentes: number;
  total_entidades: number;
  entidades_obrigatorias: number;
  total_perguntas: number;
  perguntas_respondidas: number;
  total_referencias: number;
  referencias_validadas: number;
  cobertura_pct: number;
}

// ── Report ────────────────────────────────────────────────────────────────────
export interface ResearchReport {
  agent: string;
  blog_id: string;
  pack: ResearchPack;
  summary: ResearchSummary;
  warnings: string[];
  created_at: string;
}
