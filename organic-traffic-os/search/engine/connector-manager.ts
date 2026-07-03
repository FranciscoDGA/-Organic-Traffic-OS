import { IConnector } from '../../connectors/base/connector';
import { MockConnector } from '../../connectors/mock/mock-connector';
import { ManualConnector } from '../../connectors/manual/manual-connector';

export class ConnectorManager {
  private connectors: IConnector[] = [
    new MockConnector(),
    new ManualConnector()
  ];

  public getActiveConnectors() {
    return this.connectors.filter(c => c.status === 'active');
  }

  public async syncAll(periodo: string) {
    const results: any[] = [];
    for (const conn of this.getActiveConnectors()) {
      try {
        await conn.autenticar();
        const raw = await conn.sincronizar(periodo);
        const normalized = conn.normalizar(raw);
        results.push(...normalized);
      } catch (e) {
        console.error("Connector Error:", conn.nome);
      }
    }
    return results;
  }
}
