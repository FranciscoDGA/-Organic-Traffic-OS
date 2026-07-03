import { DiscoveryInput, DiscoveryOutput, DiscoveryOpportunity } from './discovery-agent.types';

export class DiscoveryService {
  async runDiscovery(input: DiscoveryInput): Promise<DiscoveryOutput> {
    // 1. Receber um blog ou tema
    // 2. Consultar Knowledge
    // 3. Consultar Inventory
    // 4. Consultar Keywords
    // 5. Consultar SERP
    // 6. Consultar Performance
    // (Simulando as 5 camadas nesta versão V1)

    const opportunities = this.generateOpportunities(input);
    const scored = this.scoreOpportunities(opportunities);
    
    return this.generateReport(input, scored);
  }

  private generateOpportunities(input: DiscoveryInput): DiscoveryOpportunity[] {
    // Mocks for Sprint 26.2
    return [
      {
        id: 'opp_1',
        title: `Guia de Estudo Completo: ${input.topic}`,
        type: 'guide',
        category: 'Concursos Municipais',
        cluster: 'Materiais de Estudo',
        intent: 'educational',
        priority: 'critical' as 'critical',
        score: 0,
        reason: 'Alto potencial de intenção educacional para candidatos iniciantes na banca IVIN.',
        source: 'knowledge',
        confidence: 95,
        next_step: 'create_brief'
      },
      {
        id: 'opp_2',
        title: 'O que mais cai na Banca IVIN',
        type: 'educational',
        category: 'Dicas de Banca',
        cluster: 'Preparação Estratégica',
        intent: 'informational',
        priority: 'high' as 'high',
        score: 0,
        reason: 'Perguntas recorrentes detectadas nas buscas. Lacuna no inventário atual.',
        source: 'serp',
        confidence: 88,
        next_step: 'create_brief'
      }
    ].slice(0, input.limit);
  }

  private scoreOpportunities(opportunities: DiscoveryOpportunity[]): DiscoveryOpportunity[] {
    return opportunities.map(opp => ({
      ...opp,
      score: opp.priority === 'critical' ? 98 : 85
    })).sort((a, b) => b.score - a.score);
  }

  private generateReport(input: DiscoveryInput, opportunities: DiscoveryOpportunity[]): DiscoveryOutput {
    return {
      agent: 'discovery-agent',
      blog_id: input.blog_id,
      topic: input.topic,
      opportunities,
      summary: {
        total_found: opportunities.length,
        high_priority: opportunities.filter(o => o.priority === 'high' || o.priority === 'critical').length
      },
      warnings: ['Resultados baseados em mocks simulados (Sprint 26.2).'],
      created_at: new Date().toISOString()
    };
  }
}
