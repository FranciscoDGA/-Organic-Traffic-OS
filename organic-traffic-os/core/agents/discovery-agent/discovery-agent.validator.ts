import { DiscoveryInput } from './discovery-agent.types';

export class DiscoveryAgentValidator {
  validate(input: DiscoveryInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.topic?.trim()) errors.push('topic é obrigatório');
    if (!['manual', 'mock', 'pipeline'].includes(input.mode)) errors.push('mode deve ser manual, mock ou pipeline');
    if (!input.limit || input.limit < 1 || input.limit > 100) errors.push('limit deve ser entre 1 e 100');
    return { valid: errors.length === 0, errors };
  }
}
