import { ContentArchitectEngine } from './content-architect-engine';

export class ArchitectService {
  private engine = new ContentArchitectEngine();

  public generateBlueprint(brief: any) {
    return this.engine.generateBlueprint(brief);
  }
  public getBlueprint(id: string) {
    return { id };
  }
  public updateBlueprint(id: string, data: any) {
    return { id, ...data };
  }
  public versionBlueprint(id: string) {
    return { id, versao: "1.1" };
  }
}
