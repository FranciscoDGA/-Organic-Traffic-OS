import { WorkspaceRules } from './workspace-knowledge.types';

export const workspaceRules: Record<string, WorkspaceRules> = {
  passacumaru: {
    workspaceId: 'passacumaru',
    contentRules: [
      'Atualizar editais diariamente',
      'Verificar fontes oficiais antes de publicar',
      'Nao dar garantia de aprovacao',
      'Sempre linkar para edital original',
      'Atualizar status de editais',
    ],
    editorialRules: [
      'Manter tom profissional e motivador',
      'Usar linguagem acessivel',
      'Estruturar artigos com H2 e H3',
      'Incluir CTA relevante',
    ],
    seoRules: [
      'Usar palavras-chave no titulo',
      'Meta description otimizada',
      'Links internos para conteudos relacionados',
      'Imagens com alt text',
    ],
    brandRules: [
      'Identidade visual consistente',
      'Logo em todos os artigos',
      'Creditos para fontes oficiais',
    ],
    complianceRules: [
      'Respeitar direitos autorais',
      'Nao divulgar informacoes falsas',
      'Citar fontes oficiais',
    ],
  },
  garimpeibrasil: {
    workspaceId: 'garimpeibrasil',
    contentRules: [
      'Sempre informar riscos',
      'Nao recomendar investimentos especificos',
      'Usar dados atualizados',
      'Citar fontes reguladoras',
    ],
    editorialRules: [
      'Manter tom didatico e confiavel',
      'Explicar termos tecnicos',
      'Usar exemplos praticos',
      'Evitar linguagem complicada',
    ],
    seoRules: [
      'Focar em termos de educacao financeira',
      'Otimizar para featured snippets',
      'Conteudos longos e detalhados',
    ],
    brandRules: [
      'Identidade visual profissional',
      'Transparencia em todas informacoes',
    ],
    complianceRules: [
      'Respeitar normas da CVM',
      'Nao prometer retornos',
      'Informar riscos sempre',
    ],
  },
};

export function getWorkspaceRules(workspaceId: string): WorkspaceRules | undefined {
  return workspaceRules[workspaceId];
}
