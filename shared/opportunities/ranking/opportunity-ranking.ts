import { OpportunityModel } from '../models/opportunity-model';

export class OpportunityRankingEngine {
  static calculateScore(candidate: OpportunityModel, context: any): number {
    let score = 0;

    // Relevância / Intenção
    if (candidate.intencao === 'Comercial / Transacional') score += 30;
    if (candidate.intencao === 'Informacional') score += 15;

    // Gap do concorrente
    if (candidate.origem.includes('competitor-gap')) score += 40;

    // Cluster incompleto (Se o cluster tiver poucas páginas no inventário)
    // context.inventory pode ser usado para verificar isso
    score += 10;

    // Importância Estratégica
    if (candidate.tipo === 'Guia Completo') score += 20;

    // Teto de 100
    return Math.min(score, 100);
  }

  static assignPriority(score: number): OpportunityModel['prioridade'] {
    if (score >= 80) return 'Muito Alta';
    if (score >= 60) return 'Alta';
    if (score >= 40) return 'Média';
    return 'Baixa';
  }
}
