import { WorkspaceMemory } from './workspace-knowledge.types';

export const workspaceMemories: Record<string, WorkspaceMemory> = {
  passacumaru: {
    workspaceId: 'passacumaru',
    publishedContents: ['guia-concursos-2026', 'editais-julho-2026', 'dicas-prova', 'como-estudar'],
    clusters: ['concursos-municipais', 'editais-saude', 'concursos-federal', 'licitacoes'],
    entities: ['INSS', 'IBGE', 'Municipio', 'Edital', 'Concurso', 'Banca', 'Prova', 'Aprovacao'],
    faqs: ['Como me inscrever?', 'Quando sera a prova?', 'Qual o conteudo programatico?', 'Precisa de nivel superior?'],
    glossary: ['Edital', 'Concurso', 'Banca', 'Gabarito', 'Prova objetiva', 'Redacao', 'Classificacao'],
    rules: ['Atualizar editais diariamente', 'Verificar fontes oficiais', 'Nao dar garantia de aprovacao'],
    history: ['Lancamento em 2026', 'Primeiro edital coberto: PM Municipal'],
    strategies: ['Foco em editais recentes', 'Conteudos de alto volume de busca'],
    lessonsLearned: ['Editais municipais tem mais busca', 'Atualizacoes diarias sao importantes'],
    knownErrors: ['Timeout em APIs de editais', 'Dados desatualizados de bancas'],
    bestPractices: ['Sempre linkar para edital original', 'Atualizar status de editais'],
  },
  garimpeibrasil: {
    workspaceId: 'garimpeibrasil',
    publishedContents: [],
    clusters: ['renda-fixa', 'acoes', 'fundos'],
    entities: ['Banco Central', 'CVM', 'B3', 'Tesouro Direto', 'CDI', 'Selic'],
    faqs: ['Como investir?', 'Qual a melhor investimento?', 'O que e CDI?'],
    glossary: ['CDI', 'Selic', 'Renda fixa', 'Renda variavel', 'Tesouro Direto'],
    rules: ['Nao recomendar investimentos especificos', 'Sempre informar riscos'],
    history: ['Projeto em setup'],
    strategies: ['Foco em educacao financeira basica'],
    lessonsLearned: [],
    knownErrors: [],
    bestPractices: ['Sempre mencionar riscos', 'Usar exemplos praticos'],
  },
};

export function getWorkspaceMemory(workspaceId: string): WorkspaceMemory | undefined {
  return workspaceMemories[workspaceId];
}
