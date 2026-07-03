export type WorkspaceStatus = 'active' | 'inactive' | 'setup' | 'suspended';
export type WorkspaceType = 'blog' | 'ecommerce' | 'saas' | 'agency' | 'portfolio';

export interface WorkspaceConfig {
  knowledgeCore: boolean;
  inventory: boolean;
  connectors: string[];
  engines: string[];
  agents: string[];
  workflows: string[];
  scheduler: boolean;
  publishing: WorkspacePublishingConfig;
}

export interface WorkspacePublishingConfig {
  autoPublish: boolean;
  requireApproval: boolean;
  platforms: string[];
  schedule: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  domain: string;
  type: WorkspaceType;
  status: WorkspaceStatus;
  language: string;
  country: string;
  timezone: string;
  niche: string;
  audience: string;
  monetization: string[];
  config: WorkspaceConfig;
  healthScore: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceContext {
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  domain: string;
  niche: string;
  language: string;
  country: string;
  timezone: string;
}
