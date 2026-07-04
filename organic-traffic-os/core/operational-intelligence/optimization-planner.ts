import { OptimizationRecommendation } from './operational.types';

let recCounter = 0;

export function generateOptimizationPlan(): OptimizationRecommendation[] {
  return [
    { id: `opt-${Date.now()}-${++recCounter}`, title: 'Implementar cache de contexto', description: 'Cache de context packages para evitar reconstrucao', benefit: 'Reducao de 30% no consumo de tokens', risk: 'Baixo - cache invalidado a cada atualizacao', estimated_savings: 15.50, operational_impact: 'Alto - reduz latencia em 40%', confidence: 85, priority: 'high', component: 'context-intelligence', created_at: new Date().toISOString() },
    { id: `opt-${Date.now()}-${++recCounter}`, title: 'Consolidar chamadas a connectors', description: 'Agrupar chamadas similares ao mesmo connector', benefit: 'Reducao de 25% nas chamadas API', risk: 'Medio - pode aumentar latencia individual', estimated_savings: 8.20, operational_impact: 'Medio - reduz overhead de conexao', confidence: 78, priority: 'medium', component: 'connectors', created_at: new Date().toISOString() },
    { id: `opt-${Date.now()}-${++recCounter}`, title: 'Otimizar prompts de IA', description: 'Simplificar prompts para reduzir tokens por chamada', benefit: 'Reducao de 20% no custo de IA', risk: 'Baixo - manter qualidade do output', estimated_savings: 7.50, operational_impact: 'Medio - reduz custo por operacao', confidence: 82, priority: 'high', component: 'execution-intelligence', created_at: new Date().toISOString() },
  ];
}
