import { GtConfig } from './google-trends.types';

export class GtValidator {
  validateConfig(config: GtConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config.mode) errors.push('mode é obrigatório (mock ou api)');
    if (config.mode && !['mock', 'api'].includes(config.mode)) errors.push('mode deve ser "mock" ou "api"');
    return { valid: errors.length === 0, errors };
  }

  validateTerm(term: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!term?.trim()) errors.push('term é obrigatório');
    if (term && term.trim().length < 2) errors.push('term deve ter pelo menos 2 caracteres');
    if (term && term.trim().length > 100) errors.push('term deve ter no máximo 100 caracteres');
    return { valid: errors.length === 0, errors };
  }

  validateTerms(terms: string[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!terms || terms.length === 0) errors.push('Pelo menos um termo é obrigatório');
    if (terms && terms.length > 5) errors.push('Máximo de 5 termos para comparação');
    for (const term of (terms || [])) {
      const val = this.validateTerm(term);
      if (!val.valid) errors.push(...val.errors);
    }
    return { valid: errors.length === 0, errors };
  }

  validateCountry(country: string): boolean {
    return /^[A-Z]{2}$/.test(country);
  }

  validateDateRange(startDate: string, endDate: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) errors.push('startDate inválido');
    if (isNaN(end.getTime())) errors.push('endDate inválido');
    if (start > end) errors.push('startDate deve ser anterior a endDate');
    return { valid: errors.length === 0, errors };
  }
}
