import { IConnector } from '../base/connector';

export class ManualConnector implements IConnector {
  id = 'conn-manual-01';
  nome = 'Manual CSV Connector';
  versao = '1.0.0';
  status: 'active' | 'inactive' | 'error' = 'active';

  async autenticar(): Promise<boolean> { return true; }
  validar(payload: any): boolean { return true; }
  async sincronizar(periodo: string): Promise<any[]> { return []; }
  normalizar(data: any): any { return data; }
}
