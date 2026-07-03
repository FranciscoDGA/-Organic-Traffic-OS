import { IConnector } from '../base/connector';

export class MockConnector implements IConnector {
  id = 'conn-mock-01';
  nome = 'Mock Analytics Connector';
  versao = '1.0.0';
  status: 'active' | 'inactive' | 'error' = 'active';

  async autenticar(): Promise<boolean> { return true; }
  validar(payload: any): boolean { return true; }
  
  async sincronizar(periodo: string): Promise<any[]> {
    return [
      { query: "concurso prefeitura de cumaru do norte", impressions: 12500, clicks: 450, position: 2.4 },
      { query: "edital cumaru", impressions: 8000, clicks: 120, position: 1.1 },
      { query: "gabarito concurso cumaru", impressions: 45000, clicks: 50, position: 12.0 }
    ];
  }
  
  normalizar(data: any): any {
    return data.map((d: any) => ({
      query: d.query,
      metrics: {
        impressoes: d.impressions,
        cliques: d.clicks,
        ctr: parseFloat(((d.clicks / d.impressions) * 100).toFixed(2)),
        posicao_media: d.position
      }
    }));
  }
}
