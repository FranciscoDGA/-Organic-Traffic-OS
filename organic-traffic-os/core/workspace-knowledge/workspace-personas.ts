import { Persona } from './workspace-knowledge.types';

export const workspacePersonas: Record<string, Persona[]> = {
  passacumaru: [
    {
      id: 'concurseiro-iniciante',
      name: 'Concurseiro Iniciante',
      objective: 'Passar no primeiro concurso',
      knowledgeLevel: 'Basico',
      problems: ['Nao sei por onde comecar', 'Tenho medo de errar', 'Nao sei como estudar'],
      pains: ['Informacao fragmentada', 'Medo de fracassar', 'Falta de direcao'],
      frequentQuestions: ['Qual o melhor concurso?', 'Como comecar a estudar?', 'Precisa de curso?'],
      searchIntent: 'Informational',
      goals: ['Aprovacao em concurso', 'Estabilidade financeira', 'Carreira publica'],
      language: 'Portugues simples e motivador',
    },
    {
      id: 'concurseiro-experiente',
      name: 'Concurseiro Experiente',
      objective: 'Passar em concurso de alto nivel',
      knowledgeLevel: 'Avancado',
      problems: ['Concursos cada vez mais dificeis', 'Rotina de estudos estagnada'],
      pains: ['Falta de motivacao', 'Concorrencia alta', 'Tempo limitado'],
      frequentQuestions: ['Quais concursos saem este mes?', 'Como otimizar estudos?', 'Vale a pena licitacao?'],
      searchIntent: 'Transactional',
      goals: ['Aprovacao em concurso top', 'Aumentar renda', 'Mudar de carreira'],
      language: 'Portugues tecnico e direto',
    },
  ],
  garimpeibrasil: [
    {
      id: 'investidor-iniciante',
      name: 'Investidor Iniciante',
      objective: 'Comecar a investir',
      knowledgeLevel: 'Basico',
      problems: ['Medo de investir', 'Nao entendo termos financeiros'],
      pains: ['Informacao complexa', 'Medo de perder dinheiro', 'Renda baixa'],
      frequentQuestions: ['Onde investir?', 'Qual o risco?', 'Como comecar com pouco?'],
      searchIntent: 'Informational',
      goals: ['Render acima da poupanca', 'Criar reserva', 'Liberdade financeira'],
      language: 'Portugues simples e didatico',
    },
  ],
};

export function getWorkspacePersonas(workspaceId: string): Persona[] {
  return workspacePersonas[workspaceId] || [];
}
