import { StrategyEngine } from './strategy-engine';

export class StrategyService {
  private engine = new StrategyEngine();

  public generateStrategy(data: any) {
    return this.engine.defineStrategy(data);
  }
  public updateStrategy(id: string, data: any) {
    return { id, ...data };
  }
  public versionStrategy(id: string) {
    return true;
  }
  public getStrategy(id: string) {
    return { id, objetivo: "Vender produto", persona: "Tech Lead" };
  }
  public listStrategies() {
    return [
      { id: "1", objetivo: "Gerar autoridade", status: "active" }
    ];
  }
}
