import { CollectorResult } from './collector';

export class CollectorValidator {
  static validateResult(result: CollectorResult): boolean {
    if (!result.id || !result.collector || !result.data_coleta) return false;
    if (!['success', 'error', 'pending'].includes(result.status)) return false;
    
    // In a real scenario, this could run Zod schemas against result.conteudo
    return true;
  }
}
