export type KnowledgeCategory = 'playbook' | 'prompt' | 'template' | 'guideline' | 'workspace_knowledge';
export type KnowledgeStatus = 'draft' | 'active' | 'deprecated' | 'archived';

export interface KnowledgeItem {
  id: string;
  name: string;
  category: KnowledgeCategory;
  subcategory: string;
  workspaceId?: string;
  agentType?: string;
  objective?: string;
  language: string;
  version: string;
  status: KnowledgeStatus;
  author: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Playbook extends KnowledgeItem {
  category: 'playbook';
  steps: string[];
  bestPractices: string[];
}

export interface PromptTemplate extends KnowledgeItem {
  category: 'prompt';
  promptText: string;
  variables: string[];
  priority: number;
}

export interface ContentTemplate extends KnowledgeItem {
  category: 'template';
  structure: string[];
  placeholders: string[];
}

export interface Guideline extends KnowledgeItem {
  category: 'guideline';
  rules: string[];
  examples: string[];
}

export interface WorkspaceKnowledge extends KnowledgeItem {
  category: 'workspace_knowledge';
  domain: string;
  subtopics: string[];
}
