import { SourceEngine } from './source-engine';

export class SourceService {
  private engine = new SourceEngine();

  public registerSource(data: any) {
    return this.engine.registerSource(data);
  }
  public updateSource(id: string, data: any) {
    return this.engine.updateSource(id, data);
  }
  public getSource(id: string) {
    return { id, nome: "Fonte Oficial", url: "https://gov.br" };
  }
  public getByCategory(category: string) {
    return [];
  }
  public getByAuthority(minScore: number) {
    return [];
  }
  public getByDomain(domain: string) {
    return [];
  }
  public relateFact(sourceId: string, factId: string) {
    this.engine.relateFact(sourceId, factId);
    return true;
  }
}
