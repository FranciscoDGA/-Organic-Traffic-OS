import { WorkspaceKnowledgeContext, KnowledgeProfile, WorkspaceMemory, EditorialStyle, Taxonomy, Entity, Persona, WorkspaceObjectives, WorkspaceRules } from './workspace-knowledge.types';
import { getKnowledgeProfile } from './workspace-profile';
import { getWorkspaceMemory } from './workspace-memory';
import { getEditorialStyle } from './workspace-editorial-style';
import { getWorkspaceTaxonomy } from './workspace-taxonomy';
import { getWorkspaceEntities } from './workspace-entities';
import { getWorkspacePersonas } from './workspace-personas';
import { getWorkspaceObjectives } from './workspace-objectives';
import { getWorkspaceRules } from './workspace-rules';

export class WorkspaceKnowledgeManager {
  private contexts: Map<string, WorkspaceKnowledgeContext> = new Map();

  loadContext(workspaceId: string): WorkspaceKnowledgeContext {
    const existing = this.contexts.get(workspaceId);
    if (existing) return existing;

    const profile = getKnowledgeProfile(workspaceId);
    const memory = getWorkspaceMemory(workspaceId);
    const editorialStyle = getEditorialStyle(workspaceId);
    const taxonomy = getWorkspaceTaxonomy(workspaceId);
    const entities = getWorkspaceEntities(workspaceId);
    const personas = getWorkspacePersonas(workspaceId);
    const objectives = getWorkspaceObjectives(workspaceId);
    const rules = getWorkspaceRules(workspaceId);

    if (!profile) throw new Error(`Knowledge profile not found for workspace: ${workspaceId}`);

    const context: WorkspaceKnowledgeContext = {
      profile,
      memory: memory || { workspaceId, publishedContents: [], clusters: [], entities: [], faqs: [], glossary: [], rules: [], history: [], strategies: [], lessonsLearned: [], knownErrors: [], bestPractices: [] },
      editorialStyle: editorialStyle || { workspaceId, toneOfVoice: '', technicalLevel: '', complexity: '', preferredFormat: '', articleStructure: [], averageSize: '', ctaPattern: '', useTables: false, useLists: false, useExamples: false, useQuotes: false },
      taxonomy: taxonomy || { workspaceId, categories: [], tags: [], contentTypes: [], clusters: [], pillarPages: [], relationships: [] },
      entities,
      personas,
      objectives: objectives || { workspaceId, commercial: '', seo: '', aiVisibility: '', content: '', authority: '' },
      rules: rules || { workspaceId, contentRules: [], editorialRules: [], seoRules: [], brandRules: [], complianceRules: [] },
    };

    this.contexts.set(workspaceId, context);
    return context;
  }

  getContext(workspaceId: string): WorkspaceKnowledgeContext | undefined {
    return this.contexts.get(workspaceId);
  }

  reloadContext(workspaceId: string): WorkspaceKnowledgeContext {
    this.contexts.delete(workspaceId);
    return this.loadContext(workspaceId);
  }
}

export const workspaceKnowledgeManager = new WorkspaceKnowledgeManager();
