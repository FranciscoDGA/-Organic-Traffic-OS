import { KnowledgeItem } from './knowledge.types';
import { playbooks } from './playbooks';
import { promptLibrary } from './prompt-library';
import { templates } from './templates';
import { guidelines } from './guidelines';
import { workspaceKnowledge } from './workspace-knowledge';
import { knowledgeSearch } from './knowledge-search';

class KnowledgeService {
  private search = knowledgeSearch;

  getAll() { return { playbooks, prompts: promptLibrary, templates, guidelines, workspaceKnowledge }; }
  getPlaybooks() { return playbooks; }
  getPrompts() { return promptLibrary; }
  getTemplates() { return templates; }
  getGuidelines() { return guidelines; }
  getWorkspaceKnowledge() { return workspaceKnowledge; }
  getWorkspaceKnowledgeFor(ws: string) { return workspaceKnowledge.filter(w => w.workspaceId === ws); }
  searchKnowledge(query: string, category?: string, workspaceId?: string) { return this.search.search(query, { category: category as any, workspaceId }); }
  getById(id: string) { return this.search.getById(id); }
  getStats() { return this.search.getStats(); }
}

export const knowledgeService = new KnowledgeService();
