import { ConnectorManager } from './connector-manager';
import { SearchIntelligenceEngine } from './search-intelligence-engine';

export class SearchService {
  private manager = new ConnectorManager();
  private engine = new SearchIntelligenceEngine();

  public async getDashboardOverview() {
    const rawData = await this.manager.syncAll('7d');
    const opps = this.engine.analyzeOpportunities(rawData);
    
    return {
      connectors_ativos: this.manager.getActiveConnectors().length,
      ultima_sincronizacao: new Date().toISOString(),
      consultas_mapeadas: rawData.length,
      dados_brutos: rawData,
      oportunidades: opps
    };
  }

  public async syncData() {
    // In future, saves to DB
    return { status: "Success", items_synced: 3 };
  }
}
