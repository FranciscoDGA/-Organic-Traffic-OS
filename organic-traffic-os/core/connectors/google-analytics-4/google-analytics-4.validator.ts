import { Ga4AuthConfig } from './google-analytics-4.types';

export class Ga4Validator {
  validateConfig(config: Ga4AuthConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!config.client_id?.trim()) errors.push('client_id é obrigatório. Defina GA4_CLIENT_ID nas variáveis de ambiente.');
    if (!config.client_secret?.trim()) errors.push('client_secret é obrigatório. Defina GA4_CLIENT_SECRET nas variáveis de ambiente.');
    if (!config.redirect_uri?.trim()) errors.push('redirect_uri é obrigatório. Defina GA4_REDIRECT_URI nas variáveis de ambiente.');
    return { valid: errors.length === 0, errors };
  }

  validateToken(config: Ga4AuthConfig): boolean {
    if (!config.access_token) return false;
    if (config.expires_at && Date.now() > config.expires_at) return false;
    return true;
  }

  validatePropertyId(propertyId: string): boolean {
    return /^\d+$/.test(propertyId);
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
