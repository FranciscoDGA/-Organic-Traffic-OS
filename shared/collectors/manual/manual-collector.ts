import { BaseCollector, CollectorResult } from '../base/collector';

export class ManualCollector extends BaseCollector {
  id = 'manual-collector';
  nome = 'Manual Collector';
  versao = '1.0.0';
  fonte = 'Manual Input';
  status: 'ativo' | 'inativo' | 'placeholder' = 'ativo';

  async coletar(params: { text: string; sourceUrl?: string }): Promise<any> {
    if (!params || !params.text) {
      throw new Error('ManualCollector require um parâmetro "text"');
    }
    return {
      raw_text: params.text,
      provided_source: params.sourceUrl || 'user_input'
    };
  }

  validar(raw_data: any): boolean {
    return typeof raw_data.raw_text === 'string' && raw_data.raw_text.length > 0;
  }

  normalizar(raw_data: any): CollectorResult {
    return {
      id: `man-${Date.now()}`,
      collector: this.id,
      origem: raw_data.provided_source,
      data_coleta: new Date().toISOString(),
      tipo: 'text',
      conteudo: raw_data.raw_text,
      confiabilidade: 'alta', // User provided
      status: 'success',
      observacoes: 'Inserção manual de dados'
    };
  }
}
