import { AssetSelector } from './asset-selector';

export class AssetEngine {
  private selector = new AssetSelector();

  public generateAsset(blueprint: any, strategy: any, content: any) {
    const type = this.selector.determineBestFormat(strategy.intent, strategy);
    return {
      id: "asset-uuid",
      tipo: type,
      titulo: blueprint.title || "Novo Ativo",
      status: "generated",
      versao: "v1.0",
      content
    };
  }
  public relateAssets(parentId: string, childId: string) {
    return { parent: parentId, child: childId, status: "linked" };
  }
}
