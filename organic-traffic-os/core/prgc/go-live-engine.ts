import { GoLiveReport, ReadinessScore, WorkspaceReadiness, AgentReadiness } from './go-live.types';
import { calculateReadiness } from './readiness-score';
import { runValidation } from './validation-engine';

let reportCounter = 0;

export class GoLiveEngine {
  private reports: Map<string, GoLiveReport> = new Map();

  validate(): GoLiveReport {
    const { workspaceResults, agentResults, avgScore, agentAvgScore } = runValidation();

    const scores = calculateReadiness({
      infrastructure: 85, security: 90, runtime: 88, publishing: 80,
      business: 85, ai: 82, workspace: avgScore,
    });

    const pendingItems = [
      'Configurar monitoreamento de producao',
      'Definir alertas de custo',
      'Configurar backup diario',
    ];

    const risks = [
      'Custo de API pode exceder orcamento sem monitoramento',
      'Connectors podem falhar em horarios de pico',
    ];

    const criticalItems = [
      'Ativar Circuit Breaker em todos os connectors',
      'Configurar alertas de erro acima de 5%',
    ];

    const blockingItems = scores.overall >= 70 ? [] : ['Score abaixo de 70 - necessita correcoes'];

    const recommendations = [
      'Iniciar com 1 workspace em Producao',
      'Monitorar por 7 dias antes de expandir',
      'Manter Sandbox ativo para testes',
      'Revisar custos semanalmente',
    ];

    const goLivePlan = [
      'Fase 1: Ativar PassaCumaru em Producao',
      'Fase 2: Monitorar por 7 dias',
      'Fase 3: Ativar workspaces restantes',
      'Fase 4: Configurar auto-publishing',
    ];

    const rollbackPlan = [
      'Desativar auto-publishing imediatamente',
      'Redirecionar para Sandbox',
      'Notificar equipe de operacoes',
      'Documentar motivo do rollback',
      'Corrigir problema identificado',
    ];

    const successCriteria = [
      'Disponibilidade > 99%',
      'Taxa de erro < 2%',
      'Custo dentro do orcamento',
      'Todos os workspaces operacionais',
      'Zero perda de dados',
    ];

    const id = `glr-${Date.now()}-${++reportCounter}`;
    const report: GoLiveReport = {
      id, overallScore: scores, workspaces: workspaceResults, agents: agentResults,
      pendingItems, risks, criticalItems, blockingItems, recommendations,
      goLivePlan, rollbackPlan, successCriteria,
      authorized: scores.overall >= 70,
      generatedAt: new Date().toISOString(),
    };

    this.reports.set(id, report);
    return report;
  }

  getReport(id: string): GoLiveReport | undefined { return this.reports.get(id); }
  getAllReports(): GoLiveReport[] { return Array.from(this.reports.values()); }
  getLatest(): GoLiveReport | undefined { return Array.from(this.reports.values()).pop(); }
}

export const goLiveEngine = new GoLiveEngine();
