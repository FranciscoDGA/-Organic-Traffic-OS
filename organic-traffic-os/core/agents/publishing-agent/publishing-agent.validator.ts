import { PublishingInput } from './publishing-agent.types';

export class PublishingAgentValidator {
  validate(input: PublishingInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.optimized_draft) errors.push('optimized_draft é obrigatório');
    if (!input.visibility_report?.id) errors.push('visibility_report é obrigatório');
    if (!input.metadata) errors.push('metadata é obrigatório');
    if (!input.schema) errors.push('schema é obrigatório');
    if (!input.config || !input.config.target_adapters) errors.push('config.target_adapters é obrigatório');
    if (!['mock', 'manual', 'pipeline'].includes(input.mode)) errors.push('mode inválido');
    return { valid: errors.length === 0, errors };
  }
}
