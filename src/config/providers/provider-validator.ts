import { PROVIDER_REGISTRY } from './provider-registry';
import { ProviderHealthStatus } from './provider-types';

export class ProviderValidator {
  static validate(providerId: string): ProviderHealthStatus {
    const provider = PROVIDER_REGISTRY.find(p => p.provider_id === providerId);
    if (!provider) {
      return {
        provider_id: providerId,
        configured: false,
        missing_variables: [],
        status: 'error',
        last_checked: new Date().toISOString(),
        error_message: 'Provedor não encontrado no registro.',
        recommendation: 'Verifique se o provider_id está correto.'
      };
    }

    const missing_variables: string[] = [];

    // Validar as variáveis exigidas consultando o process.env
    for (const variable of provider.required_vars) {
      const val = process.env[variable];
      if (!val || val.trim() === '') {
        missing_variables.push(variable);
      }
    }

    // Regras de validações avançadas sem expor segredos
    let error_message: string | undefined;
    let recommendation: string | undefined;

    if (missing_variables.length > 0) {
      error_message = `Variáveis ausentes no ambiente.`;
      recommendation = `Configure as seguintes variáveis no seu painel da Vercel ou .env.local: ${missing_variables.join(', ')}`;
    }

    // Validações de formato específico
    if (providerId === 'google-search-console' && !missing_variables.includes('GOOGLE_REDIRECT_URI')) {
      const redirectUri = process.env.GOOGLE_REDIRECT_URI || '';
      if (redirectUri && !redirectUri.startsWith('http://') && !redirectUri.startsWith('https://')) {
        missing_variables.push('GOOGLE_REDIRECT_URI');
        error_message = 'GOOGLE_REDIRECT_URI possui formato de URL inválido.';
        recommendation = 'O link de callback do Google deve iniciar com http:// ou https://';
      }
    }

    const status = missing_variables.length > 0 ? (provider.status === 'active' ? 'error' as const : 'warning' as const) : 'active' as const;

    return {
      provider_id: providerId,
      configured: missing_variables.length === 0,
      missing_variables,
      status,
      last_checked: new Date().toISOString(),
      error_message,
      recommendation: recommendation || 'Provedor configurado corretamente.'
    };
  }

  static validateAll(): ProviderHealthStatus[] {
    return PROVIDER_REGISTRY.map(p => this.validate(p.provider_id));
  }
}
