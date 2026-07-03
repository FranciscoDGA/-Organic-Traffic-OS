import { PlanningInput } from './planning-agent.types';

export class PlanningAgentValidator {
  validate(input: PlanningInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.discovery_report) errors.push('discovery_report é obrigatório');
    if (!input.start_date) errors.push('start_date é obrigatório');
    if (!input.weeks || input.weeks < 1 || input.weeks > 52) errors.push('weeks deve ser entre 1 e 52');
    if (input.discovery_report?.opportunities?.length === 0) errors.push('Nenhuma oportunidade para planejar');
    return { valid: errors.length === 0, errors };
  }
}
