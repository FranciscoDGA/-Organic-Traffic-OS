export interface FakeWorkspace {
  id: string;
  name: string;
  slug: string;
  domain: string;
  description: string;
  status: 'active' | 'inactive';
  articlesCount: number;
  agentsCount: number;
}

export interface FakeArticle {
  id: string;
  workspaceId: string;
  title: string;
  slug: string;
  status: 'draft' | 'review' | 'published' | 'scheduled';
  author: string;
  createdAt: string;
  publishedAt?: string;
}

export interface FakeAgent {
  id: string;
  workspaceId: string;
  name: string;
  type: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  lastRun?: string;
}

export interface FakeMission {
  id: string;
  workspaceId: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  steps: number;
  completedSteps: number;
  createdAt: string;
}

export const FAKE_WORKSPACES: FakeWorkspace[] = [
  { id: 'ws-001', name: 'PassaCumaru', slug: 'passacumaru', domain: 'passacumaru.com.br', description: 'Blog de viagens e turismo', status: 'active', articlesCount: 45, agentsCount: 3 },
  { id: 'ws-002', name: 'Qual o Seguro', slug: 'qual-o-seguro', domain: 'qualseguro.com.br', description: 'Blog de seguros', status: 'active', articlesCount: 32, agentsCount: 2 },
  { id: 'ws-003', name: 'UtilPro Brasil', slug: 'utilpro-brasil', domain: 'utilpro.com.br', description: 'Blog de ferramentas profissionais', status: 'active', articlesCount: 28, agentsCount: 2 },
  { id: 'ws-004', name: 'Tabuômetro', slug: 'tabuometro', domain: 'tabuometro.com.br', description: 'Blog de curiosidades', status: 'active', articlesCount: 55, agentsCount: 4 },
  { id: 'ws-005', name: 'AI Agency OS', slug: 'ai-agency-os', domain: 'aiagencyos.com.br', description: 'Blog de IA e automacao', status: 'active', articlesCount: 18, agentsCount: 3 },
];

export function generateFakeArticles(workspaceId: string, count = 10): FakeArticle[] {
  const articles: FakeArticle[] = [];
  const statuses: FakeArticle['status'][] = ['draft', 'review', 'published', 'scheduled'];
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    articles.push({
      id: `art-${workspaceId}-${i}`,
      workspaceId,
      title: `Artigo Ficticio ${i + 1} - ${workspaceId}`,
      slug: `artigo-ficticio-${workspaceId}-${i + 1}`,
      status,
      author: 'Agent-Writer',
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    });
  }
  return articles;
}

export function generateFakeAgents(workspaceId: string): FakeAgent[] {
  return [
    { id: `agent-${workspaceId}-discovery`, workspaceId, name: 'Discovery Agent', type: 'discovery', status: 'idle' },
    { id: `agent-${workspaceId}-writer`, workspaceId, name: 'Writer Agent', type: 'writer', status: 'idle' },
    { id: `agent-${workspaceId}-review`, workspaceId, name: 'Review Agent', type: 'review', status: 'idle' },
  ];
}

export function generateFakeMissions(workspaceId: string, count = 5): FakeMission[] {
  const statuses: FakeMission['status'][] = ['pending', 'running', 'completed', 'failed'];
  return Array.from({ length: count }, (_, i) => ({
    id: `mission-${workspaceId}-${i}`,
    workspaceId,
    name: `Missao Ficticia ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    steps: 5,
    completedSteps: Math.floor(Math.random() * 6),
    createdAt: new Date(Date.now() - Math.random() * 7 * 86400000).toISOString(),
  }));
}
