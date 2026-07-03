import { Workspace } from './workspace.types';

const defaultConfig: Workspace['config'] = {
  knowledgeCore: true,
  inventory: true,
  connectors: ['google-search-console', 'google-analytics', 'google-trends', 'wordpress'],
  engines: ['content-intelligence', 'semantic-intelligence', 'authority-intelligence', 'opportunity-intelligence', 'predictive-intelligence'],
  agents: ['writing', 'editor', 'qa', 'compliance', 'seo', 'research', 'newsletter', 'analytics'],
  workflows: ['article', 'review', 'pillar', 'faq', 'campaign', 'newsletter', 'refresh'],
  scheduler: true,
  publishing: {
    autoPublish: false,
    requireApproval: true,
    platforms: ['wordpress'],
    schedule: '0 9 * * *',
  },
};

export const workspaceRegistry: Workspace[] = [
  {
    id: 'passacumaru',
    name: 'PassaCumaru',
    slug: 'passacumaru',
    domain: 'passacumaru.com.br',
    type: 'blog',
    status: 'active',
    language: 'pt-BR',
    country: 'BR',
    timezone: 'America/Sao_Paulo',
    niche: 'Concursos e Editais Publicos',
    audience: 'Concurseiros e profissionais que buscam oportunidades em editais',
    monetization: ['afiliacao', 'produtos proprios', 'publicidade'],
    config: { ...defaultConfig },
    healthScore: 92,
    lastActivity: new Date().toISOString(),
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'garimpeibrasil',
    name: 'Garimpei Brasil',
    slug: 'garimpeibrasil',
    domain: 'garimpeibrasil.com.br',
    type: 'blog',
    status: 'setup',
    language: 'pt-BR',
    country: 'BR',
    timezone: 'America/Sao_Paulo',
    niche: 'Financas Pessoais e Investimentos',
    audience: 'Pessoas que buscam informacoes sobre financas e investimentos',
    monetization: ['afiliacao', 'cursos', 'consultoria'],
    config: { ...defaultConfig },
    healthScore: 0,
    lastActivity: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getWorkspaceById(id: string): Workspace | undefined {
  return workspaceRegistry.find(w => w.id === id);
}

export function getWorkspaceBySlug(slug: string): Workspace | undefined {
  return workspaceRegistry.find(w => w.slug === slug);
}

export function getActiveWorkspaces(): Workspace[] {
  return workspaceRegistry.filter(w => w.status === 'active');
}

export function getAllWorkspaces(): Workspace[] {
  return workspaceRegistry;
}
