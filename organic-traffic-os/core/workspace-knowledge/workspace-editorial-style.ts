import { EditorialStyle } from './workspace-knowledge.types';

export const workspaceEditorialStyles: Record<string, EditorialStyle> = {
  passacumaru: {
    workspaceId: 'passacumaru',
    toneOfVoice: 'Profissional, acessivel e motivador',
    technicalLevel: 'Intermediario',
    complexity: 'Media',
    preferredFormat: 'Artigos longos com listas e tabelas',
    articleStructure: ['Introducao', 'Contexto', 'Detalhes do Edital', 'Como se Inscrever', 'Dicas', 'Conclusao'],
    averageSize: '2000-3000 palavras',
    ctaPattern: 'Inscreva-se agora | Confira o edital | Comece a estudar',
    useTables: true,
    useLists: true,
    useExamples: true,
    useQuotes: false,
  },
  garimpeibrasil: {
    workspaceId: 'garimpeibrasil',
    toneOfVoice: 'Didatico, transparente e confiavel',
    technicalLevel: 'Basico',
    complexity: 'Baixa',
    preferredFormat: 'Artigos didaticos com exemplos praticos',
    articleStructure: ['Introducao', 'Conceito', 'Como Funciona', 'Vantagens', 'Riscos', 'Como Comecar'],
    averageSize: '1500-2500 palavras',
    ctaPattern: 'Comece a investir | Saiba mais | Abra sua conta',
    useTables: true,
    useLists: true,
    useExamples: true,
    useQuotes: false,
  },
};

export function getEditorialStyle(workspaceId: string): EditorialStyle | undefined {
  return workspaceEditorialStyles[workspaceId];
}
