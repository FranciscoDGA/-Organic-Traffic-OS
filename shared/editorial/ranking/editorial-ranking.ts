import { EditorialItem } from '../models/editorial-models';

export class EditorialRanking {
  static calculate(item: EditorialItem, context: any): number {
    let rankingScore = item.score; // Baseado na oportunidade

    // Impacto / Retorno esperado
    if (item.tipo === 'Guia Completo') rankingScore += 20;

    // Dependências (se ele é pai de muitos, priorizar)
    const childrenCount = context.dependencies?.find((d:any) => d.pai === item.id)?.filhos?.length || 0;
    rankingScore += (childrenCount * 10);

    // Urgência (Ex: Notícia / Freshness)
    if (item.categoria === 'Notícias') rankingScore += 15;

    return Math.min(rankingScore, 100);
  }
}
