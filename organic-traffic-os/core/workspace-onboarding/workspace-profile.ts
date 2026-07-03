import { EditorialProfile, WorkspaceConfig } from './workspace-onboarding.types';
import { workspaceConfigs } from './workspace-configs';

export class WorkspaceProfile {
  getProfile(workspaceId: string): EditorialProfile | undefined {
    return workspaceConfigs[workspaceId]?.editorialProfile;
  }

  getAllProfiles(): Record<string, EditorialProfile> {
    const result: Record<string, EditorialProfile> = {};
    for (const [id, config] of Object.entries(workspaceConfigs)) {
      result[id] = config.editorialProfile;
    }
    return result;
  }

  validate(id: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const profile = this.getProfile(id);
    if (!profile) { errors.push('Perfil editorial nao encontrado'); return { valid: false, errors }; }
    if (!profile.voiceTone) errors.push('Tom de voz nao definido');
    if (!profile.mainCategories.length) errors.push('Categorias principais nao definidas');
    if (!profile.allowedContentTypes.length) errors.push('Tipos de conteudo nao definidos');
    return { valid: errors.length === 0, errors };
  }
}
