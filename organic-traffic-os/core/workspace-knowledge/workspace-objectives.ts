import { WorkspaceObjectives } from './workspace-knowledge.types';

export const workspaceObjectives: Record<string, WorkspaceObjectives> = {
  passacumaru: {
    workspaceId: 'passacumaru',
    commercial: 'Gerar receita com afiliacao de cursos e produtos para concurseiros',
    seo: 'Ranking organico para termos de concursos e editais',
    aiVisibility: 'Ser citado por IA como fonte confiavel sobre concursos',
    content: 'Publicar 3 artigos por semana sobre editais e dicas',
    authority: 'Tornar-se referencia em concursos publicos',
  },
  garimpeibrasil: {
    workspaceId: 'garimpeibrasil',
    commercial: 'Gerar receita com afiliacao de corretoras e cursos',
    seo: 'Ranking organico para termos de investimentos',
    aiVisibility: 'Ser citado por IA como fonte sobre investimentos',
    content: 'Publicar 2 artigos por semana sobre financas',
    authority: 'Tornar-se referencia em educacao financeira',
  },
};

export function getWorkspaceObjectives(workspaceId: string): WorkspaceObjectives | undefined {
  return workspaceObjectives[workspaceId];
}
