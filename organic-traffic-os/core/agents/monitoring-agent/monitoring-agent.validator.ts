import { MonitoringInput } from './monitoring-agent.types';

export class MonitoringAgentValidator {
  validate(input: MonitoringInput): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!input.blog_id?.trim()) errors.push('blog_id é obrigatório');
    if (!input.package?.id) errors.push('package é obrigatório');
    if (!input.metrics) errors.push('metrics é obrigatório');
    if (!['mock', 'manual', 'pipeline'].includes(input.mode)) errors.push('mode inválido');
    return { valid: errors.length === 0, errors };
  }
}
