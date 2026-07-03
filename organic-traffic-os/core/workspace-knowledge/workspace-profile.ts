import { KnowledgeProfile } from './workspace-knowledge.types';

export const workspaceProfiles: Record<string, KnowledgeProfile> = {
  passacumaru: {
    workspaceId: 'passacumaru',
    name: 'PassaCumaru',
    description: 'Blog especializado em concursos e editais publicos',
    objective: 'Ajudar concurseiros a encontrarem e passarem em concursos publicos',
    mission: 'Democratizar o acesso a informacoes sobre concursos e editais',
    vision: 'Ser a principal referencia em concursos publicos do Brasil',
    niche: 'Concursos e Editais Publicos',
    subniches: ['Editais municipais', 'Concursos estaduais', 'Concursos federais', 'Licitacoes', 'Editais de saude'],
    toneOfVoice: 'Profissional, acessivel e motivador',
    language: 'pt-BR',
    country: 'BR',
    desiredAuthority: 'Autoridade em concursos publicos',
    editorialStrategy: 'Conteudos atualizados sobre editais com analises detalhadas',
    commercialObjective: 'Afiliacao de cursos e produtos para concurseiros',
    seoObjective: 'Ranking para termos de concursos e editais',
    aiVisibilityObjective: 'Ser citado como fonte por IA em respostas sobre concursos',
  },
  garimpeibrasil: {
    workspaceId: 'garimpeibrasil',
    name: 'Garimpei Brasil',
    description: 'Blog de financas pessoais e investimentos',
    objective: 'Ensinar pessoas a cuidarem do dinheiro e investirem',
    mission: 'Democratizar o acesso a informacoes financeiras',
    vision: 'Ser referencia em educacao financeira no Brasil',
    niche: 'Financas Pessoais e Investimentos',
    subniches: ['Renda fixa', 'Acoes', 'Fundos', 'Criptomoedas', 'Planejamento financeiro'],
    toneOfVoice: 'Didatico, transparente e confiavel',
    language: 'pt-BR',
    country: 'BR',
    desiredAuthority: 'Autoridade em financas pessoais',
    editorialStrategy: 'Conteudos didaticos sobre investimentos',
    commercialObjective: 'Afiliacao de corretoras e cursos de investimento',
    seoObjective: 'Ranking para termos de investimentos',
    aiVisibilityObjective: 'Ser citado como fonte por IA em respostas sobre investimentos',
  },
};

export function getKnowledgeProfile(workspaceId: string): KnowledgeProfile | undefined {
  return workspaceProfiles[workspaceId];
}

export function getAllKnowledgeProfiles(): KnowledgeProfile[] {
  return Object.values(workspaceProfiles);
}
