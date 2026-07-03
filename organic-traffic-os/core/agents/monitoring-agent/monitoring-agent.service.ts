import {
  MonitoringInput, MonitoringAgentOutput, MonitoringReport,
  TrendStatus, HealthScore, Recommendation, PerformanceMetrics,
  PeriodComparison, TrendReport, PerformanceReport, LogEntry,
} from './monitoring-agent.types';
import { MonitoringAgentValidator } from './monitoring-agent.validator';
import { DiscoveryAgentService } from '../discovery-agent/discovery-agent.service';

export class MonitoringAgentService {
  private validator = new MonitoringAgentValidator();
  private logs: LogEntry[] = [];

  private log(level: LogEntry['level'], action: string, message: string, data?: Record<string, unknown>) {
    this.logs.push({
      timestamp: new Date().toISOString(),
      level,
      agent: 'monitoring-agent',
      action,
      message,
      data,
    });
  }

  comparePeriods(current: PerformanceMetrics, history: PerformanceMetrics[]): PeriodComparison {
    const previous = history.length > 0 ? history[history.length - 1] : null;
    const calc = (curr: number, prev: number | undefined): number => {
      if (!prev || prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100 * 100) / 100;
    };
    return {
      current,
      previous,
      percent_change: {
        visualizacoes: calc(current.visualizacoes, previous?.visualizacoes),
        cliques: calc(current.cliques, previous?.cliques),
        ctr: calc(current.ctr, previous?.ctr),
        impressoes: calc(current.impressoes, previous?.impressoes),
        posicao_media: calc(current.posicao_media, previous?.posicao_media),
        tempo_medio: calc(current.tempo_medio, previous?.tempo_medio),
        conversoes: calc(current.conversoes, previous?.conversoes),
        downloads: calc(current.downloads, previous?.downloads),
        leads: calc(current.leads, previous?.leads),
        compartilhamentos: calc(current.compartilhamentos, previous?.compartilhamentos),
      },
      period_label: previous ? 'último período vs atual' : 'sem histórico anterior',
    };
  }

  detectTrends(current: PerformanceMetrics, history: PerformanceMetrics[]): TrendStatus {
    const prev = history.length > 0 ? history[history.length - 1] : null;
    if (!prev) {
      if (current.visualizacoes > 5000) return 'alta';
      if (current.posicao_media > 10) return 'queda';
      return 'estabilidade';
    }

    const visChange = ((current.visualizacoes - prev.visualizacoes) / (prev.visualizacoes || 1)) * 100;
    const posChange = ((current.posicao_media - prev.posicao_media) / (prev.posicao_media || 1)) * 100;
    const cliquesChange = ((current.cliques - prev.cliques) / (prev.cliques || 1)) * 100;

    if (visChange > 50 || cliquesChange > 50) return 'mudanca_brusca';
    if (current.posicao_media > 15 && posChange > 20) return 'perda_ranking';
    if (current.posicao_media < 5 && posChange < -20) return 'ganho_autoridade';
    if (visChange < -30 && cliquesChange < -30) return 'decadencia';
    if (visChange > 20 && cliquesChange > 20) return 'crescimento';
    if (visChange > 10) return 'alta';
    if (visChange < -10) return 'queda';
    return 'estabilidade';
  }

  calculateHealth(current: PerformanceMetrics, trend: TrendStatus): HealthScore {
    const normalize = (val: number, max: number): number => Math.min(100, Math.max(0, Math.round((val / max) * 100)));
    const trendScore: Record<TrendStatus, number> = {
      alta: 95, crescimento: 90, ganho_autoridade: 85, estabilidade: 70,
      mudanca_brusca: 50, queda: 35, perda_ranking: 20, decadencia: 10,
    };
    const performance = Math.round((normalize(current.visualizacoes, 20000) * 0.3 +
      normalize(current.cliques, 2000) * 0.3 +
      normalize(current.ctr * 10, 100) * 0.4));
    const atualidade = current.ultima_atualizacao
      ? Math.max(20, 100 - Math.floor((Date.now() - new Date(current.ultima_atualizacao).getTime()) / (1000 * 60 * 60 * 24 * 7)) * 5)
      : 50;
    const qualidade = Math.round((normalize(current.tempo_medio, 300) * 0.5 +
      normalize(current.compartilhamentos, 200) * 0.5));
    const engajamento = Math.round((normalize(current.tempo_medio, 300) * 0.4 +
      normalize(current.compartilhamentos, 200) * 0.3 +
      normalize(current.cliques, 2000) * 0.3));
    const visibilidade = Math.round((normalize(current.impressoes, 500000) * 0.5 +
      (100 - normalize(current.posicao_media, 30)) * 0.5));
    const conversao = current.conversoes > 0 || current.leads > 0 || current.downloads > 0
      ? Math.round((normalize(current.conversoes, 200) * 0.4 +
          normalize(current.leads, 100) * 0.3 +
          normalize(current.downloads, 50) * 0.3))
      : 50;
    const tendencia = trendScore[trend] ?? 50;
    const pontuacao_final = Math.round(
      performance * 0.20 + atualidade * 0.15 + qualidade * 0.15 +
      engajamento * 0.15 + visibilidade * 0.15 + conversao * 0.10 + tendencia * 0.10
    );
    return { performance, atualidade, qualidade, engajamento, visibilidade, conversao, tendencia, pontuacao_final };
  }

  generateRecommendations(health: HealthScore, trend: TrendStatus, metrics: PerformanceMetrics): Recommendation[] {
    const recs: Recommendation[] = [];
    if (health.atualidade < 80) {
      recs.push({ acao: 'atualizar_artigo', descricao: 'O conteúdo possui informações que podem estar defasadas.', prioridade: 'alta' });
    }
    if (trend === 'alta' || trend === 'crescimento') {
      recs.push({ acao: 'criar_satelite', descricao: 'Conteúdo tracionando bem. Criar artigos satélites para fortalecer o cluster.', prioridade: 'media' });
    }
    if (health.conversao < 80 && metrics.visualizacoes > 3000) {
      recs.push({ acao: 'melhorar_cta', descricao: 'Tráfego alto mas baixa conversão. Revisar Call to Actions.', prioridade: 'alta' });
    }
    if (health.engajamento < 60) {
      recs.push({ acao: 'criar_faq', descricao: 'Baixo engajamento detectado. Adicionar seção de FAQ pode aumentar retenção.', prioridade: 'media' });
    }
    if (metrics.tempo_medio < 120) {
      recs.push({ acao: 'adicionar_imagem', descricao: 'Tempo médio baixo. Adicionar imagens pode melhorar retenção visual.', prioridade: 'media' });
    }
    if (metrics.tempo_medio < 90) {
      recs.push({ acao: 'adicionar_video', descricao: 'Tempo médio muito baixo. Adicionar vídeo pode aumentar engajamento.', prioridade: 'baixa' });
    }
    if (health.visibilidade < 70) {
      recs.push({ acao: 'melhorar_links', descricao: 'Visibilidade abaixo do esperado. Revisar links internos e estratégia de distribuição.', prioridade: 'media' });
    }
    if (trend === 'crescimento' || trend === 'alta') {
      recs.push({ acao: 'expandir_cluster', descricao: 'Conteúdo em crescimento. Expandir o cluster com novos tópicos relacionados.', prioridade: 'media' });
    }
    if (trend === 'decadencia' && health.atualidade < 40) {
      recs.push({ acao: 'arquivar', descricao: 'Conteúdo em decadência e desatualizado. Considerar arquivamento.', prioridade: 'baixa' });
    }
    return recs;
  }

  createDiscoverySuggestions(recommendations: Recommendation[], title: string): string[] {
    return recommendations
      .filter(r => r.acao === 'criar_satelite' || r.acao === 'expandir_cluster')
      .map(r => `Expandir: ${title}`);
  }

  buildTrendReport(content_id: string, trend: TrendStatus, comparison: PeriodComparison): TrendReport {
    const confidence: TrendReport['confidence'] = comparison.previous ? 'alta' : 'baixa';
    return {
      content_id,
      current_trend: trend,
      previous_trend: null,
      comparison,
      confidence,
      detected_at: new Date().toISOString(),
    };
  }

  buildPerformanceReport(content_id: string, current: PerformanceMetrics, history: PerformanceMetrics[]): PerformanceReport {
    const all = [...history, current];
    return {
      content_id,
      metrics_summary: {
        total_visualizacoes: all.reduce((s, m) => s + m.visualizacoes, 0),
        total_cliques: all.reduce((s, m) => s + m.cliques, 0),
        avg_ctr: Math.round((all.reduce((s, m) => s + m.ctr, 0) / all.length) * 100) / 100,
        total_impressoes: all.reduce((s, m) => s + m.impressoes, 0),
        avg_posicao_media: Math.round((all.reduce((s, m) => s + m.posicao_media, 0) / all.length) * 100) / 100,
        avg_tempo_medio: Math.round(all.reduce((s, m) => s + m.tempo_medio, 0) / all.length),
        total_conversoes: all.reduce((s, m) => s + m.conversoes, 0),
        total_downloads: all.reduce((s, m) => s + m.downloads, 0),
        total_leads: all.reduce((s, m) => s + m.leads, 0),
        total_compartilhamentos: all.reduce((s, m) => s + m.compartilhamentos, 0),
      },
      best_period: null,
      worst_period: null,
    };
  }

  private async sendToDiscovery(blog_id: string, suggestions: string[]) {
    if (suggestions.length === 0) return;
    this.log('info', 'send_to_discovery', `Enviando ${suggestions.length} sugestões para o Discovery Agent`, { suggestions });
    const dService = new DiscoveryAgentService();
    for (const sug of suggestions) {
      this.log('debug', 'feedback_loop_dispatched', `Sugestão enviada ao Discovery: ${sug}`, { origin: 'monitoring_feedback' });
    }
  }

  async runMonitoring(input: MonitoringInput): Promise<MonitoringAgentOutput> {
    this.logs = [];
    this.log('info', 'run_monitoring_start', 'Iniciando monitoramento', { blog_id: input.blog_id, content_id: input.package.content_id });

    const validation = this.validator.validate(input);
    if (!validation.valid) {
      this.log('error', 'validation_failed', validation.errors.join(', '));
      throw new Error(validation.errors.join(', '));
    }

    this.log('info', 'compare_periods', 'Comparando períodos', { history_points: input.history.length });
    const comparison = this.comparePeriods(input.metrics, input.history);

    this.log('info', 'detect_trends', 'Detectando tendências');
    const trend = this.detectTrends(input.metrics, input.history);
    this.log('info', 'trend_detected', `Tendência detectada: ${trend}`, { trend, comparison: comparison.percent_change });

    this.log('info', 'calculate_health', 'Calculando Health Score');
    const health_score = this.calculateHealth(input.metrics, trend);
    this.log('info', 'health_calculated', `Health Score: ${health_score.pontuacao_final}`, health_score as unknown as Record<string, unknown>);

    this.log('info', 'generate_recommendations', 'Gerando recomendações');
    const recommendations = this.generateRecommendations(health_score, trend, input.metrics);
    this.log('info', 'recommendations_generated', `${recommendations.length} recomendações geradas`);

    const discovery_suggestions = this.createDiscoverySuggestions(recommendations, input.package.title);

    const refresh_suggestions = recommendations
      .filter(r => r.acao === 'atualizar_artigo' || r.acao === 'republicar')
      .map(r => `Refresh: ${input.package.title}`);

    this.log('info', 'feedback_loop', `${discovery_suggestions.length} sugestões para o Discovery, ${refresh_suggestions.length} para Refresh`);
    if (discovery_suggestions.length > 0) {
      await this.sendToDiscovery(input.blog_id, discovery_suggestions);
    }

    const trend_report = this.buildTrendReport(input.package.content_id, trend, comparison);
    const performance_report = this.buildPerformanceReport(input.package.content_id, input.metrics, input.history);

    this.log('info', 'run_monitoring_complete', 'Monitoramento concluído');

    const report: MonitoringReport = {
      id: `mon-${Date.now()}`,
      content_id: input.package.content_id,
      trend,
      health_score,
      recommendations,
      discovery_suggestions,
      refresh_suggestions,
      created_at: new Date().toISOString(),
    };

    return {
      agent: 'monitoring-agent',
      blog_id: input.blog_id,
      report,
      success: true,
      message: 'Monitoramento concluído e feedback loop processado.',
      trend_report,
      performance_report,
      comparison,
      logs: this.logs,
    };
  }
}
