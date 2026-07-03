import { ProviderValidator } from './provider-validator';
import { ProviderHealthStatus } from './provider-types';

export class ProviderHealthChecker {
  public static checkHealth(providerId: string): ProviderHealthStatus {
    // Retorna o resultado da validação com segurança (sem vazar chaves reais)
    return ProviderValidator.validate(providerId);
  }

  public static getGlobalHealthReport(): { overall_status: string; providers: ProviderHealthStatus[] } {
    const reports = ProviderValidator.validateAll();
    const hasError = reports.some(r => r.status === 'error');
    
    return {
      overall_status: hasError ? 'degraded' : 'healthy',
      providers: reports
    };
  }
}
