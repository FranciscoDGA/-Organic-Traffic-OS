import {
  DiscoveryInput, DiscoveryOpportunity, DiscoveryReport, DiscoverySummary
} from './discovery-agent.types';
import { DiscoveryAgentValidator } from './discovery-agent.validator';

const MOCK_OPPORTUNITIES: Omit<DiscoveryOpportunity, 'id'>[] = [
  {
    title: 'Como Estudar para Concurso da Prefeitura de Cumaru do Norte',
    type: 'guide', category: 'Estudo', cluster: 'Concurso Cumaru',
    intent: 'educacional', priority: 'critical', score: 95,
    reason: 'Alta intenção educacional + Lacuna no inventário + Potencial de captura de lead',
    source: 'mock', confidence: 0.92,
    next_step: 'Criar brief e blueprint imediatamente'
  },
  {
    title: 'Edital do Concurso Prefeitura de Cumaru do Norte — Análise Completa',
    type: 'article', category: 'Edital', cluster: 'Concurso Cumaru',
    intent: 'informacional', priority: 'critical', score: 93,
    reason: 'Pergunta mais buscada no nicho + Zero concorrência local',
    source: 'mock', confidence: 0.90,
    next_step: 'Aguardar publicação do edital oficial para confirmar dados'
  },
  {
    title: 'Cargos e Salários do Concurso de Cumaru — Tabela Atualizada',
    type: 'comparison', category: 'Cargos', cluster: 'Concurso Cumaru',
    intent: 'informacional', priority: 'high', score: 88,
    reason: 'Alta demanda por dados concretos + Conteúdo evergreen',
    source: 'mock', confidence: 0.85,
    next_step: 'Criar tabela comparativa com cargos disponíveis'
  },
  {
    title: 'Banca IVIN — Perfil Completo e Estilo de Questões',
    type: 'guide', category: 'Banca', cluster: 'Banca IVIN',
    intent: 'educacional', priority: 'high', score: 85,
    reason: 'Diferencial editorial + Lacuna no mercado + Potencial de tráfego long tail',
    source: 'mock', confidence: 0.88,
    next_step: 'Coletar questões das últimas provas da IVIN'
  },
  {
    title: 'Simulado IVIN — 40 Questões de Legislação Municipal',
    type: 'article', category: 'Simulado', cluster: 'Banca IVIN',
    intent: 'educacional', priority: 'high', score: 82,
    reason: 'Alta retenção + Potencial de assinatura + Engajamento comprovado no nicho',
    source: 'mock', confidence: 0.80,
    next_step: 'Elaborar simulado com gabarito e explicações'
  },
  {
    title: 'Lei Orgânica Municipal — Resumo Para Concursos',
    type: 'guide', category: 'Legislação', cluster: 'Direito Municipal',
    intent: 'educacional', priority: 'high', score: 80,
    reason: 'Conteúdo evergreen + Presente em todos os editais municipais',
    source: 'mock', confidence: 0.82,
    next_step: 'Criar guia com os pontos mais cobrados em provas'
  },
  {
    title: 'Checklist de Documentos para Posse em Concurso Municipal',
    type: 'checklist', category: 'Pós-aprovação', cluster: 'Concurso Municipal',
    intent: 'transacional', priority: 'medium', score: 72,
    reason: 'Conteúdo de cauda longa + Alto valor percebido + Potencial de lead',
    source: 'mock', confidence: 0.75,
    next_step: 'Criar checklist em formato PDF para captura de email'
  },
  {
    title: 'E-book Gratuito — Guia do Candidato Iniciante em Concursos Municipais',
    type: 'ebook', category: 'Lead Magnet', cluster: 'Iniciantes',
    intent: 'transacional', priority: 'medium', score: 70,
    reason: 'Potencial de captura de lead + Conteúdo de alta retenção',
    source: 'mock', confidence: 0.70,
    next_step: 'Estruturar e-book de 20 páginas com guia completo'
  },
];

export class DiscoveryAgentService {
  private validator = new DiscoveryAgentValidator();

  validateInput(input: DiscoveryInput): { valid: boolean; errors: string[] } {
    return this.validator.validate(input);
  }

  generateOpportunities(input: DiscoveryInput): DiscoveryOpportunity[] {
    const base = MOCK_OPPORTUNITIES.map((o, i) => ({ id: `opp-${Date.now()}-${i}`, ...o }));
    return base.slice(0, input.limit);
  }

  scoreOpportunities(opps: DiscoveryOpportunity[]): DiscoveryOpportunity[] {
    return opps.sort((a, b) => b.score - a.score);
  }

  buildSummary(opps: DiscoveryOpportunity[]): DiscoverySummary {
    const avg = opps.reduce((acc, o) => acc + o.score, 0) / (opps.length || 1);
    const clusters = opps.reduce((acc: Record<string,number>, o) => {
      acc[o.cluster] = (acc[o.cluster] || 0) + 1; return acc;
    }, {});
    const topCluster = Object.entries(clusters).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
    return {
      total_found: opps.length,
      critical: opps.filter(o => o.priority === 'critical').length,
      high: opps.filter(o => o.priority === 'high').length,
      medium: opps.filter(o => o.priority === 'medium').length,
      low: opps.filter(o => o.priority === 'low').length,
      avg_score: Math.round(avg),
      top_cluster: topCluster
    };
  }

  generateReport(input: DiscoveryInput, opps: DiscoveryOpportunity[]): DiscoveryReport {
    return {
      agent: 'discovery-agent',
      blog_id: input.blog_id,
      topic: input.topic,
      opportunities: opps,
      summary: this.buildSummary(opps),
      warnings: ['Dados baseados em mock. Conectar GSC para dados reais no próximo sprint.'],
      created_at: new Date().toISOString()
    };
  }

  async runDiscovery(input: DiscoveryInput): Promise<DiscoveryReport> {
    const validation = this.validateInput(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));
    const raw = this.generateOpportunities(input);
    const scored = this.scoreOpportunities(raw);
    return this.generateReport(input, scored);
  }
}
