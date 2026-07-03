import { ResearchComposerEngine } from './research-composer';

export class ResearchService {
  private engine = new ResearchComposerEngine();

  public generatePack(blueprint: any) {
    return this.engine.preparePack(blueprint);
  }
  public getPack(id: string) {
    return { id };
  }
  public updatePack(id: string, data: any) {
    return { id, ...data };
  }
  public versionPack(id: string) {
    return { id, versao: "1.1" };
  }
}
