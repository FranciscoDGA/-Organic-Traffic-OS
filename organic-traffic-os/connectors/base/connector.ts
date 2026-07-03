export interface IConnector {
  id: string;
  nome: string;
  versao: string;
  status: 'active' | 'inactive' | 'error';
  autenticar(): Promise<boolean>;
  validar(payload: any): boolean;
  sincronizar(periodo: string): Promise<any[]>;
  normalizar(data: any): any;
}
