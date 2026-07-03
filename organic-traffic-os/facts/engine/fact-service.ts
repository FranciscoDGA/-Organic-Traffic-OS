import { FactEngine } from './fact-engine';

export class FactService {
  private engine = new FactEngine();

  public registerFact(data: any) {
    return { id: "fact-id", ...data };
  }
  public getFact(id: string) {
    return { id, descricao: "Fato de exemplo" };
  }
  public updateFact(id: string, data: any) {
    return { id, ...data };
  }
  public versionFact(id: string) {
    return { id, versao: "1.1" };
  }
  public getEvidence(id: string) {
    return [];
  }
  public getByCategory(category: string) {
    return [];
  }
}
