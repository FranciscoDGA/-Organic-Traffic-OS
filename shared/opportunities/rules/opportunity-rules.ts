import { OpportunityModel } from '../models/opportunity-model';

export class OpportunityRules {
  static filter(candidate: OpportunityModel, inventory: any[]): boolean {
    // Regra 1: Nunca sugerir artigo duplicado (se já existe no inventário com título similar)
    const exists = inventory.find(i => i.title.toLowerCase().includes(candidate.titulo.toLowerCase()));
    if (exists) return false;

    // Regra 2: Nunca sugerir conteúdo fora do escopo / sem intenção clara
    if (!candidate.intencao) return false;

    return true;
  }
}
