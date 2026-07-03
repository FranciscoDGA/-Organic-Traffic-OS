import { KnowledgeItem } from './knowledge.types';
import { playbooks } from './playbooks';
import { promptLibrary } from './prompt-library';
import { templates } from './templates';
import { guidelines } from './guidelines';
import { workspaceKnowledge } from './workspace-knowledge';

class KnowledgeSearch {
  private allItems: KnowledgeItem[] = [...playbooks, ...promptLibrary, ...templates, ...guidelines, ...workspaceKnowledge];

  search(query: string, filters?: { category?: string; workspaceId?: string; tags?: string[] }): KnowledgeItem[] {
    let results = this.allItems;
    if (filters?.category) results = results.filter(i => i.category === filters.category);
    if (filters?.workspaceId) results = results.filter(i => i.workspaceId === filters.workspaceId);
    if (filters?.tags) results = results.filter(i => filters.tags!.some(t => i.tags.includes(t)));
    const q = query.toLowerCase();
    return results.filter(i => i.name.toLowerCase().includes(q) || i.content.toLowerCase().includes(q) || i.tags.some(t => t.includes(q)));
  }

  getByCategory(category: string): KnowledgeItem[] {
    return this.allItems.filter(i => i.category === category);
  }

  getByWorkspace(workspaceId: string): KnowledgeItem[] {
    return this.allItems.filter(i => i.workspaceId === workspaceId);
  }

  getById(id: string): KnowledgeItem | undefined {
    return this.allItems.find(i => i.id === id);
  }

  getRecent(count: number): KnowledgeItem[] {
    return [...this.allItems].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, count);
  }

  getStats() {
    return {
      total: this.allItems.length,
      byCategory: { playbook: playbooks.length, prompt: promptLibrary.length, template: templates.length, guideline: guidelines.length, workspace_knowledge: workspaceKnowledge.length },
      byWorkspace: { passacumaru: workspaceKnowledge.filter(w => w.workspaceId === 'passacumaru').length, qualoseguro: workspaceKnowledge.filter(w => w.workspaceId === 'qualoseguro').length, utilprobrasil: workspaceKnowledge.filter(w => w.workspaceId === 'utilprobrasil').length, tabuometro: workspaceKnowledge.filter(w => w.workspaceId === 'tabuometro').length, aiagencyos: workspaceKnowledge.filter(w => w.workspaceId === 'aiagencyos').length },
    };
  }
}

export const knowledgeSearch = new KnowledgeSearch();
