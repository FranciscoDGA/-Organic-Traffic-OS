import { LearningRecord } from './auto-learning.types';
import { createLearningRecord } from './learning-record';

export function buildPassaCumaruLessons(): LearningRecord[] {
  const ws = 'passacumaru';
  return [
    createLearningRecord({ workspaceId: ws, origin: 'performance-engine', type: 'content_success', category: 'performance', description: 'Artigos sobre INSS tiveram 3x mais trafego', patternDetected: 'Conteudos sobre INSS performam acima da media', evidence: '12 artigos com media de 2500 visualizacoes', impact: 'high', confidence: 0.92, recommendation: 'Criar mais conteudos sobre INSS e beneficios sociais' }),
    createLearningRecord({ workspaceId: ws, origin: 'monitoring-agent', type: 'content_failure', category: 'performance', description: 'Artigos sobre concursos encerrados tiveram baixo trafego', patternDetected: 'Conteudos de concursos encerrados perdem relevancia rapida', evidence: '8 artigos com media de 200 visualizacoes apos 30 dias', impact: 'medium', confidence: 0.88, recommendation: 'Focar em concursos ativos e proximos edais' }),
    createLearningRecord({ workspaceId: ws, origin: 'content-intelligence', type: 'strong_cluster', category: 'pattern', description: 'Cluster de concursos de saude e forte', patternDetected: 'Concursos de saude tem demanda crescente', evidence: '+45% trafego organico no cluster', impact: 'high', confidence: 0.9, recommendation: 'Expandir cluster de saude com mais subtopicos' }),
    createLearningRecord({ workspaceId: ws, origin: 'content-intelligence', type: 'weak_cluster', category: 'pattern', description: 'Cluster de concursos de TI esta fraco', patternDetected: 'Concursos de TI tem pouca demanda no Brasil', evidence: 'Media de 150 visualizacoes por artigo', impact: 'low', confidence: 0.75, recommendation: 'Reduzir investimento em concursos de TI' }),
    createLearningRecord({ workspaceId: ws, origin: 'writer-agent', type: 'effective_title', category: 'strategy', description: 'Titulos com "Guia Completo" tem maior CTR', patternDetected: 'Titulos guia tem 40% mais cliques', evidence: 'CTR medio de 8.5% vs 6.1% para outros formatos', impact: 'high', confidence: 0.87, recommendation: 'Usar "Guia Completo" em titulos de artigos principais' }),
    createLearningRecord({ workspaceId: ws, origin: 'monitoring-agent', type: 'recurring_failure', category: 'risk', description: 'Artigos sem data de atualizacao perdem ranking', patternDetected: 'Conteudos desatualizados perdem posicoes', evidence: '15 artigos cairam de posicao apos 90 dias sem update', impact: 'medium', confidence: 0.85, recommendation: 'Atualizar artigos a cada 60 dias' }),
    createLearningRecord({ workspaceId: ws, origin: 'opportunity-intelligence', type: 'repeated_opportunity', category: 'opportunity', description: 'Editais de saude aparecem toda semana', patternDetected: 'Editais de saude sao oportunidade recorrente', evidence: '3-5 novos editais por semana', impact: 'high', confidence: 0.93, recommendation: 'Automatizar criacao de conteudo sobre editais de saude' }),
    createLearningRecord({ workspaceId: ws, origin: 'publishing-agent', type: 'effective_format', category: 'strategy', description: 'Listas de editais geram mais compartilhamentos', patternDetected: 'Formato lista e mais compartilhavel', evidence: '3x mais compartilhamentos que artigos narrativos', impact: 'medium', confidence: 0.82, recommendation: 'Criar listas semanais de editais abertos' }),
  ];
}

export function buildGarimpeiBrasilLessons(): LearningRecord[] {
  const ws = 'garimpeibrasil';
  return [
    createLearningRecord({ workspaceId: ws, origin: 'performance-engine', type: 'content_success', category: 'performance', description: 'Artigos sobre Tesouro Direto performam bem', patternDetected: 'Investimentos de renda fixa tem demanda alta', evidence: 'Media de 1800 visualizacoes', impact: 'high', confidence: 0.9, recommendation: 'Expandir conteudo sobre renda fixa' }),
    createLearningRecord({ workspaceId: ws, origin: 'content-intelligence', type: 'promising_topic', category: 'opportunity', description: 'CDI e tema em alta', patternDetected: 'Buscas por CDI cresceram 30%', evidence: 'Volume de busca subiu de 20k para 26k', impact: 'medium', confidence: 0.85, recommendation: 'Criar serie de artigos sobre CDI' }),
    createLearningRecord({ workspaceId: ws, origin: 'monitoring-agent', type: 'detected_risk', category: 'risk', description: 'Conteudos sobre criptomoedas tem risco regulatorio', patternDetected: 'Regulacao de criptos esta mudando', evidence: 'Novas regras da CVM em analise', impact: 'high', confidence: 0.78, recommendation: 'Evitar recomendacoes diretas sobre criptos' }),
  ];
}
