import { DiscoveryReport } from '../discovery-agent/discovery-agent.types';

export interface PlanningInput {
  blog_id: string;
  discovery_report: DiscoveryReport;
  start_date: string;
  weeks: number;
}

export type BacklogStatus = 'pending' | 'in_progress' | 'done' | 'blocked';
export type ContentPriority = 'critical' | 'high' | 'medium' | 'low';

export interface BacklogItem {
  id: string;
  titulo: string;
  tipo: string;
  cluster: string;
  categoria: string;
  prioridade: ContentPriority;
  score: number;
  status: BacklogStatus;
  dependencias: string[];
  estimativa_dias: number;
  responsavel: string;
  origem: string;
  score_impacto: number;
  score_urgencia: number;
  score_roi: number;
  score_facilidade: number;
}

export interface CalendarEntry {
  id: string;
  data_prevista: string;
  titulo: string;
  tipo: string;
  cluster: string;
  prioridade: ContentPriority;
  status: BacklogStatus;
  observacoes: string;
}

export interface RoadmapPhase {
  fase: number;
  nome: string;
  semana_inicio: number;
  semana_fim: number;
  itens: BacklogItem[];
}

export interface Roadmap {
  blog_id: string;
  semanas_totais: number;
  total_itens: number;
  clusters: string[];
  fases: RoadmapPhase[];
}

export interface PlanningSummary {
  total_oportunidades: number;
  duplicatas_removidas: number;
  clusters_identificados: number;
  itens_backlog: number;
  semanas_estimadas: number;
  criticos: number;
  altos: number;
  medios: number;
}

export interface PlanningReport {
  agent: string;
  blog_id: string;
  backlog: BacklogItem[];
  calendar: CalendarEntry[];
  roadmap: Roadmap;
  summary: PlanningSummary;
  warnings: string[];
  created_at: string;
}
