export interface CollectorResult {
  id: string;
  collector: string;
  origem: string;
  data_coleta: string;
  tipo: string;
  conteudo: any;
  confiabilidade: string;
  status: string;
  observacoes: string;
}

export interface ICollector {
  id: string;
  nome: string;
  versao: string;
  fonte: string;
  status: 'ativo' | 'inativo' | 'placeholder';

  coletar(params?: any): Promise<any>;
  validar(raw_data: any): boolean;
  normalizar(raw_data: any): CollectorResult;
  salvar(result: CollectorResult): Promise<void>;
  
  // Shortcut that runs the full pipeline
  run(params?: any): Promise<CollectorResult>;
}

export abstract class BaseCollector implements ICollector {
  abstract id: string;
  abstract nome: string;
  abstract versao: string;
  abstract fonte: string;
  abstract status: 'ativo' | 'inativo' | 'placeholder';

  abstract coletar(params?: any): Promise<any>;
  abstract validar(raw_data: any): boolean;
  abstract normalizar(raw_data: any): CollectorResult;
  
  async salvar(result: CollectorResult): Promise<void> {
    // Implement cache logic via collector-cache
    const { CollectorCache } = await import('./collector-cache');
    await CollectorCache.salvar(result);
  }

  async run(params?: any): Promise<CollectorResult> {
    try {
      if (this.status === 'inativo') throw new Error(`Collector ${this.id} is inactive.`);
      if (this.status === 'placeholder') throw new Error(`Collector ${this.id} is a placeholder and not fully implemented.`);

      const raw = await this.coletar(params);
      if (!this.validar(raw)) {
        throw new Error(`Data validation failed for collector ${this.id}`);
      }
      
      const result = this.normalizar(raw);
      await this.salvar(result);
      
      return result;
    } catch (e: any) {
      // Return a failed result
      return {
        id: `err-${Date.now()}`,
        collector: this.id,
        origem: this.fonte,
        data_coleta: new Date().toISOString(),
        tipo: 'error',
        conteudo: null,
        confiabilidade: 'nenhuma',
        status: 'error',
        observacoes: e.message
      };
    }
  }
}
