import { VisibilityInput } from './visibility-agent.types';

export class VisibilityAgentValidator {
  validate(input: VisibilityInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.draft_pack?.id) errors.push('draft_pack é obrigatório');
    if (!input.review_report?.id) errors.push('review_report é obrigatório');
    if (!input.evidence_pack?.id) errors.push('evidence_pack é obrigatório');
    if (!['mock', 'manual', 'pipeline'].includes(input.mode)) errors.push('mode inválido');
    return { valid: errors.length === 0, errors };
  }
}
