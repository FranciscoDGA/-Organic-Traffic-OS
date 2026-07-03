import { ResearchInput } from './research-agent.types';

export class ResearchAgentValidator {
  validate(input: ResearchInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.backlog_item) errors.push('backlog_item é obrigatório');
    if (!input.backlog_item?.titulo) errors.push('backlog_item.titulo é obrigatório');
    if (!['mock', 'manual', 'pipeline'].includes(input.mode)) errors.push('mode inválido');
    return { valid: errors.length === 0, errors };
  }
}
