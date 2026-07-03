import { WorkspaceEditorialProfile, EditorialPersona, EditorialCategory, EditorialRules, ToneStyle } from './workspace-editorial.types';
import { workspaceEditorialProfiles } from './workspace-profiles';

class WorkspaceEditorialService {
  private profiles = workspaceEditorialProfiles;

  getAll(): WorkspaceEditorialProfile[] {
    return Object.values(this.profiles);
  }

  getById(id: string): WorkspaceEditorialProfile | undefined {
    return this.profiles[id];
  }

  getByWorkspace(workspaceId: string): WorkspaceEditorialProfile | undefined {
    return Object.values(this.profiles).find(p => p.workspaceId === workspaceId);
  }

  getPersonas(workspaceId: string): EditorialPersona[] {
    return this.getByWorkspace(workspaceId)?.personas || [];
  }

  getCategories(workspaceId: string): EditorialCategory[] {
    return this.getByWorkspace(workspaceId)?.categories || [];
  }

  getRules(workspaceId: string): EditorialRules | undefined {
    return this.getByWorkspace(workspaceId)?.rules;
  }

  getTone(workspaceId: string): ToneStyle[] {
    return this.getByWorkspace(workspaceId)?.toneOfVoice || [];
  }

  updateProfile(workspaceId: string, updates: Partial<WorkspaceEditorialProfile>): boolean {
    const profile = this.getByWorkspace(workspaceId);
    if (!profile) return false;
    Object.assign(profile, updates, { updatedAt: new Date().toISOString(), version: this.incrementVersion(profile.version) });
    return true;
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.');
    parts[2] = String(parseInt(parts[2]) + 1);
    return parts.join('.');
  }

  validate(workspaceId: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const profile = this.getByWorkspace(workspaceId);
    if (!profile) { errors.push('Perfil nao encontrado'); return { valid: false, errors }; }
    if (!profile.mission) errors.push('Missao nao definida');
    if (!profile.objectives.length) errors.push('Objetivos nao definidos');
    if (!profile.personas.length) errors.push('Personas nao definidas');
    if (!profile.categories.length) errors.push('Categorias nao definidas');
    if (!profile.toneOfVoice.length) errors.push('Tom de voz nao definido');
    if (!profile.rules) errors.push('Regras nao definidas');
    if (!profile.monetization) errors.push('Monetizacao nao definida');
    return { valid: errors.length === 0, errors };
  }

  getContextForAgent(workspaceId: string): Record<string, unknown> | undefined {
    const profile = this.getByWorkspace(workspaceId);
    if (!profile) return undefined;
    return { name: profile.name, niche: profile.niche, mission: profile.mission, objectives: profile.objectives, targetAudience: profile.targetAudience, toneOfVoice: profile.toneOfVoice, depthLevel: profile.depthLevel, rules: profile.rules, categories: profile.categories.map(c => c.name), primaryCTA: profile.primaryCTA };
  }
}

export const workspaceEditorialService = new WorkspaceEditorialService();
