import { BwAuthConfig } from './bing-webmaster.types';

export class BwValidator {
  validateConfig(config: BwAuthConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config.api_key?.trim()) errors.push('api_key é obrigatório. Defina BING_API_KEY nas variáveis de ambiente.');
    return { valid: errors.length === 0, errors };
  }

  validateApiKey(config: BwAuthConfig): boolean {
    return !!config.api_key && config.api_key.trim().length > 10;
  }

  validateSiteUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
    }
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
