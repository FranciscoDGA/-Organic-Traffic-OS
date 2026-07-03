import { ContextSource } from './context.types';

export function getWorkspaceContext(workspaceId: string): ContextSource[] {
  const contexts: Record<string, ContextSource[]> = {
    passacumaru: [
      { type: 'workspace', data: 'PassaCumaru - Blog de concursos e editais|' + Date.now(), relevance: 0.95, confidence: 0.95 },
      { type: 'knowledge-core', data: 'Concursos|cluster:concursos-municipais|' + Date.now(), relevance: 0.9, confidence: 0.9 },
      { type: 'knowledge-core', data: 'Editais|cluster:editais-saude|' + Date.now(), relevance: 0.85, confidence: 0.88 },
      { type: 'knowledge-graph', data: 'entity:INSS|importance:9|' + Date.now(), relevance: 0.88, confidence: 0.9 },
      { type: 'knowledge-graph', data: 'entity:Edital|importance:10|' + Date.now(), relevance: 0.92, confidence: 0.95 },
      { type: 'knowledge-graph', data: 'cluster:Concursos Municipais|' + Date.now(), relevance: 0.87, confidence: 0.85 },
      { type: 'knowledge-graph', data: 'faq:Como me inscrever?|' + Date.now(), relevance: 0.8, confidence: 0.9 },
      { type: 'memory', data: 'Refresh diario funciona bem para concursos|confidence:0.95|' + Date.now(), relevance: 0.93, confidence: 0.95 },
      { type: 'memory', data: 'Artigos sobre INSS geram mais engajamento|confidence:0.9|' + Date.now(), relevance: 0.88, confidence: 0.9 },
      { type: 'memory', data: 'Concursos de saude sao oportunidade|confidence:0.92|' + Date.now(), relevance: 0.86, confidence: 0.92 },
      { type: 'personas', data: 'Concurseiro Iniciante|goal:aprovacao|' + Date.now(), relevance: 0.85, confidence: 0.9 },
      { type: 'objectives', data: 'Aprovacao em concurso|priority:high|' + Date.now(), relevance: 0.95, confidence: 0.95 },
    ],
    garimpeibrasil: [
      { type: 'workspace', data: 'Garimpei Brasil - Blog de financas pessoais|' + Date.now(), relevance: 0.95, confidence: 0.95 },
      { type: 'knowledge-core', data: 'Investimentos|cluster:renda-fixa|' + Date.now(), relevance: 0.9, confidence: 0.9 },
      { type: 'knowledge-graph', data: 'entity:Tesouro Direto|importance:9|' + Date.now(), relevance: 0.88, confidence: 0.9 },
      { type: 'knowledge-graph', data: 'entity:Selic|importance:10|' + Date.now(), relevance: 0.92, confidence: 0.95 },
      { type: 'memory', data: 'Investimentos precisam de dados atualizados|confidence:0.93|' + Date.now(), relevance: 0.91, confidence: 0.93 },
      { type: 'memory', data: 'Tesouro Direto e tema de alta demanda|confidence:0.9|' + Date.now(), relevance: 0.89, confidence: 0.9 },
      { type: 'personas', data: 'Investidor Iniciante|goal:liberdade-financeira|' + Date.now(), relevance: 0.85, confidence: 0.9 },
      { type: 'objectives', data: 'Liberdade financeira|priority:high|' + Date.now(), relevance: 0.95, confidence: 0.95 },
    ],
  };
  return contexts[workspaceId] || [];
}
