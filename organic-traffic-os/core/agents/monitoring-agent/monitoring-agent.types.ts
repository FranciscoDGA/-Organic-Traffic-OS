import { PublicationPackage } from '../publishing-agent/publishing-agent.types';

export interface PerformanceMetrics {
  visualizacoes: number;
  cliques: number;
  ctr: number;
  impressoes: number;
  posicao_media: number;
  tempo_medio: number; // in seconds
  conversoes: number;
  downloads: number;
  leads: number;
  compartilhamentos: number;
  ultima_atualizacao: string;
  origem: string;
}

export type TrendStatus = 'alta' | 'queda' | 'estabilidade' | 'mudanca_brusca' | 'perda_ranking' | 'ganho_autoridade' | 'decadencia' | 'crescimento';

export interface HealthScore {
  performance: number;
  atualidade: number;
  qualidade: number;
  engajamento: number;
  visibilidade: number;
  conversao: number;
  tendencia: number;
  pontuacao_final: number;
}

export interface Recommendation {
  acao: 'atualizar_artigo' | 'criar_faq' | 'criar_satelite' | 'criar_pilar' | 'melhorar_cta' | 'adicionar_imagem' | 'adicionar_video' | 'melhorar_links' | 'expandir_cluster' | 'republicar' | 'arquivar';
  descricao: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

export interface MonitoringInput {
  blog_id: string;
  package: PublicationPackage;
  metrics: PerformanceMetrics;
  history: PerformanceMetrics[];
  mode: 'mock' | 'manual' | 'pipeline';
}

export interface MonitoringReport {
  id: string;
  content_id: string;
  trend: TrendStatus;
  health_score: HealthScore;
  recommendations: Recommendation[];
  discovery_suggestions: string[];
  refresh_suggestions: string[];
  created_at: string;
}

export interface MonitoringAgentOutput {
  agent: string;
  blog_id: string;
  report: MonitoringReport;
  success: boolean;
  message: string;
  trend_report?: TrendReport;
  performance_report?: PerformanceReport;
  comparison?: PeriodComparison;
  logs?: LogEntry[];
}

export interface PeriodComparison {
  current: PerformanceMetrics;
  previous: PerformanceMetrics | null;
  percent_change: {
    visualizacoes: number;
    cliques: number;
    ctr: number;
    impressoes: number;
    posicao_media: number;
    tempo_medio: number;
    conversoes: number;
    downloads: number;
    leads: number;
    compartilhamentos: number;
  };
  period_label: string;
}

export interface TrendReport {
  content_id: string;
  current_trend: TrendStatus;
  previous_trend: TrendStatus | null;
  comparison: PeriodComparison;
  confidence: 'baixa' | 'media' | 'alta';
  detected_at: string;
}

export interface PerformanceReport {
  content_id: string;
  metrics_summary: {
    total_visualizacoes: number;
    total_cliques: number;
    avg_ctr: number;
    total_impressoes: number;
    avg_posicao_media: number;
    avg_tempo_medio: number;
    total_conversoes: number;
    total_downloads: number;
    total_leads: number;
    total_compartilhamentos: number;
  };
  best_period: string | null;
  worst_period: string | null;
}

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  agent: string;
  action: string;
  message: string;
  data?: Record<string, unknown>;
}
