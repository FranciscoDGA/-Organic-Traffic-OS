import { FactInput } from './fact-agent.types';

export class FactAgentValidator {
  validate(input: FactInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.research_pack) errors.push('research_pack é obrigatório');
    if (!input.research_pack?.id) errors.push('research_pack.id é obrigatório');
    if (!input.research_pack?.fatos_conhecidos?.length && !input.research_pack?.fatos_pendentes?.length) {
      errors.push('Research Pack não contém fatos para validar');
    }
    if (!['mock', 'manual', 'pipeline'].includes(input.mode)) errors.push('mode inválido');
    return { valid: errors.length === 0, errors };
  }
}
