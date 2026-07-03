import { ReviewInput } from './review-agent.types';

export class ReviewAgentValidator {
  validate(input: ReviewInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.draft_pack?.id) errors.push('draft_pack é obrigatório');
    if (!input.research_pack?.id) errors.push('research_pack é obrigatório');
    if (!input.evidence_pack?.id) errors.push('evidence_pack é obrigatório');
    if (!['mock', 'manual', 'pipeline'].includes(input.mode)) errors.push('mode inválido');
    return { valid: errors.length === 0, errors };
  }
}
