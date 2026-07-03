import { Insight, InsightType } from './business-intelligence.types';

let insightCounter = 0;

function createInsight(title: string, description: string, type: InsightType, impact: string, recommendation: string, workspaceId?: string, metric?: string): Insight {
  return { id: `insight-${Date.now()}-${++insightCounter}`, title, description, type, impact, recommendation, workspaceId, metric, timestamp: new Date().toISOString() };
}

export function generateInsights(): Insight[] {
  return [
    createInsight('Melhor Workspace por ROI', 'AI Agency OS lidera com ROI de 8.5x, seguido por UtilPro Brasil (5.1x) e Qual o Seguro (4.2x)', 'positive', ' Alto', 'Manter investimento nos 3 workspaces de melhor performance', 'aiagencyos', 'estimatedROI'),
    createInsight('Oportunidade de Conteudo', 'Qual o Seguro tem potencial para 500+ leads/mes com expansao de categorias', 'opportunity', ' Alto', 'Expandir cobertura de seguros residenciais e empresariais', 'qualoseguro', 'leads'),
    createInsight('Conteudos Criticos', '3 artigos do PassaCumaru nao sao atualizados ha mais de 90 dias', 'warning', ' Medio', 'Agendar refresh de conteudo para manter relevancia', 'passacumaru', 'updated'),
    createInsight('AI Visibility em Crescimento', 'Todos os workspaces mostram melhoria em AI Visibility, media de 72%', 'positive', ' Medio', 'Continuar otimizacao para LLMs e Featured Snippets', undefined, 'aiVisibility'),
    createInsight('Custo por Conteudo', 'Tabuometro tem o menor custo por conteudo ($0.08), ideal para escalar', 'recommendation', ' Medio', 'Aumentar producao no Tabuometro mantendo qualidade', 'tabuometro', 'costPerContent'),
    createInsight('Gargalo de Producao', 'AI Agency OS tem tempo medio de producao de 52min, acima da media', 'negative', ' Baixo', 'Otimizar workflow de producao com prompts mais eficientes', 'aiagencyos', 'avgProductionTime'),
    createInsight('Crescimento Organico', 'Tabuometro lidera com 55% de crescimento organico, potencial nao explorado', 'opportunity', ' Alto', 'Monetizar melhor o trafego com afiliados e publicidade', 'tabuometro', 'organicGrowth'),
    createInsight('Qualidade Editorial', 'AI Agency OS atinge 90% de qualidade editorial, referencia da plataforma', 'positive', ' Baixo', 'Usar como benchmark para outros workspaces', 'aiagencyos', 'editorialQuality'),
  ];
}
