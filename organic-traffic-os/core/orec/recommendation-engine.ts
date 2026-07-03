import { Recommendation } from './reliability.types';

let recCounter = 0;

const recTemplates: { category: string; title: string; description: string; impact: 'low' | 'medium' | 'high'; effort: 'low' | 'medium' | 'high' }[] = [
  { category: 'performance', title: 'Otimizar queries de banco', description: 'Identificadas queries lentas no modulo de BI', impact: 'medium', effort: 'low' },
  { category: 'capacity', title: 'Escalar workers de Runtime', description: 'Queue de processamento atingiu 80% de capacidade', impact: 'high', effort: 'medium' },
  { category: 'cost', title: 'Otimizar uso de IA', description: 'Crescimento de custos de IA acima de 10% ao mes', impact: 'high', effort: 'medium' },
  { category: 'reliability', title: 'Implementar fallback para Connector', description: 'Google Trends com instabilidade recorrente', impact: 'medium', effort: 'low' },
  { category: 'performance', title: 'Cache de respostas de API', description: 'Latencia media de API acima de 300ms', impact: 'medium', effort: 'low' },
  { category: 'capacity', title: 'Expandir armazenamento', description: 'Utilizacao de storage atingiu 75%', impact: 'low', effort: 'high' },
  { category: 'reliability', title: 'Redundancia de workers', description: 'Worker unico representando risco de disponibilidade', impact: 'high', effort: 'medium' },
  { category: 'cost', title: 'Revisar modelos de IA', description: 'Modelo utilizado nao e o mais custo-eficiente', impact: 'medium', effort: 'low' },
];

export function generateRecommendations(count: number = 5): Recommendation[] {
  const shuffled = recTemplates.sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map(t => ({
    id: `rec-${Date.now()}-${++recCounter}`, ...t, priority: t.impact === 'high' ? 1 : t.impact === 'medium' ? 2 : 3,
    createdAt: new Date().toISOString(),
  }));
}
