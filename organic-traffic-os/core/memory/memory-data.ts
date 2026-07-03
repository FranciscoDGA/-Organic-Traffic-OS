import { MemoryRecord } from './memory.types';
import { createMemoryRecord } from './memory-record';

export function buildPassaCumaruMemories(): MemoryRecord[] {
  const ws = 'passacumaru';
  return [
    createMemoryRecord({ workspaceId: ws, type: 'operational', origin: 'scheduler', category: 'success', title: 'Daily refresh executado', description: 'Refresh diario de concursos completado', context: 'Rotina de refresh automatico', result: '20 conteudos atualizados', learning: 'Refresh diario funciona bem para concursos', confidence: 0.95, tags: ['refresh', 'sucesso'] }),
    createMemoryRecord({ workspaceId: ws, type: 'editorial', origin: 'writer-agent', category: 'success', title: 'Artigo sobre Edital INSS', description: 'Artigo sobre edital do INSS gerado com sucesso', context: 'Solicitacao do planning-agent', result: 'Artigo com 2800 palavras', learning: 'Artigos sobre INSS geram mais engajamento', confidence: 0.9, tags: ['inss', 'edital', 'artigo'] }),
    createMemoryRecord({ workspaceId: ws, type: 'editorial', origin: 'review-agent', category: 'error', title: 'Artigo reprovado por plagio', description: 'Artigo detectado com similaridade alta', context: 'Revisao automatica', result: 'Artigo rejeitado', learning: 'Evitar copiar de fontes oficiais', confidence: 0.85, tags: ['plagio', 'rejeitado'] }),
    createMemoryRecord({ workspaceId: ws, type: 'workflow', origin: 'orchestrator', category: 'pattern', title: 'Workflow de concursos', description: 'Padrao de workflow para conteudo de concursos', context: 'Analise de 50 workflows', result: '7 etapas otimizadas', learning: 'Concursos precisam de 7 etapas: pesquisa, planejamento, escrita, revisao, otimizacao, publicacao, monitoramento', confidence: 0.88, tags: ['workflow', 'concursos', 'padrao'] }),
    createMemoryRecord({ workspaceId: ws, type: 'engine', origin: 'content-intelligence', category: 'insight', title: 'Topico concursos saude em alta', description: 'Cluster de saude mostrando crescimento', context: 'Analise semanal', result: '+45% trafego', learning: 'Concursos de saude sao oportunidade', confidence: 0.92, tags: ['saude', 'crescimento', 'oportunidade'] }),
    createMemoryRecord({ workspaceId: ws, type: 'agent', origin: 'monitoring-agent', category: 'warning', title: 'Queda de trafego detectada', description: 'Trafego organcio caiu 15% em 7 dias', context: 'Monitoramento diario', result: 'Alerta gerado', learning: 'Quedas de 15% precisam de acao imediata', confidence: 0.87, tags: ['trafego', 'queda', 'alerta'] }),
    createMemoryRecord({ workspaceId: ws, type: 'publishing', origin: 'publisher-agent', category: 'success', title: 'Publicacao no WordPress', description: 'Artigo publicado com sucesso no WordPress', context: 'Publicacao automatica', result: 'Post ID 1234', learning: 'WordPress funciona bem com publicacao programada', confidence: 0.94, tags: ['wordpress', 'publicacao'] }),
    createMemoryRecord({ workspaceId: ws, type: 'learning', origin: 'engine-aggregator', category: 'insight', title: 'Concursos Municipais sao mais lucrativos', description: 'Analise de 6 meses mostra concursos municipais com melhor ROI', context: 'Analise de performance', result: 'ROI 3x maior', learning: 'Concursos municipais geram mais trafego organico', confidence: 0.91, tags: ['municipais', 'roi', 'lucratividade'] }),
  ];
}

export function buildGarimpeiBrasilMemories(): MemoryRecord[] {
  const ws = 'garimpeibrasil';
  return [
    createMemoryRecord({ workspaceId: ws, type: 'operational', origin: 'scheduler', category: 'success', title: 'Refresh de investimentos', description: 'Refresh de Conteudo de investimentos executado', context: 'Rotina diaria', result: '15 conteudos atualizados', learning: 'Investimentos precisam de dados atualizados', confidence: 0.93, tags: ['investimentos', 'refresh'] }),
    createMemoryRecord({ workspaceId: ws, type: 'editorial', origin: 'writer-agent', category: 'success', title: 'Artigo sobre CDI', description: 'Artigo explicativo sobre CDI gerado', context: 'Solicitacao do planning-agent', result: 'Artigo com 1800 palavras', learning: 'Artigos explicativos funcionam bem', confidence: 0.89, tags: ['cdi', 'explicativo'] }),
    createMemoryRecord({ workspaceId: ws, type: 'engine', origin: 'opportunity-intelligence', category: 'insight', title: 'Tesouro Direto em alta', description: 'Buscas por Tesouro Direto crescendo', context: 'Analise de oportunidades', result: 'Volume 35% maior', learning: 'Tesouro Direto e tema de alta demanda', confidence: 0.9, tags: ['tesouro-direto', 'oportunidade'] }),
  ];
}
