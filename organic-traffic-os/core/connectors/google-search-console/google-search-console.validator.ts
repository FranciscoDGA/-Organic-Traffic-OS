import { GscAuthConfig } from './google-search-console.types';

export class GscValidator {
  validateConfig(config: GscAuthConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config.client_id?.trim()) errors.push('client_id é obrigatório. Defina GOOGLE_CLIENT_ID nas variáveis de ambiente.');
    if (!config.client_secret?.trim()) errors.push('client_secret é obrigatório. Defina GOOGLE_CLIENT_SECRET nas variáveis de ambiente.');
    if (!config.redirect_uri?.trim()) errors.push('redirect_uri é obrigatório. Defina GOOGLE_REDIRECT_URI nas variáveis de ambiente.');
    return { valid: errors.length === 0, errors };
  }

  validateToken(config: GscAuthConfig): boolean {
    if (!config.access_token) return false;
    if (config.expires_at && Date.now() > config.expires_at) return false;
    return true;
  }

  validateSiteUrl(url: string): boolean {
    try {
      if (url.startsWith('sc-domain:')) return true;
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
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 901) errors.push('Período máximo é 901 dias (limite do GSC)');
    return { valid: errors.length === 0, errors };
  }
}
