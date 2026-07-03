import { BriefTemplate } from '../models/brief-models';

export class BriefValidator {
  static validateTemplate(template: BriefTemplate): boolean {
    if (!template.id || !template.titulo || !template.versao) return false;
    return true;
  }
}
