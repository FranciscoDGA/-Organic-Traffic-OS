import { AssetEngine } from './asset-engine';

export class AssetService {
  private engine = new AssetEngine();

  public createAsset(data: any) {
    const { blueprint, strategy, content } = data;
    return this.engine.generateAsset(blueprint, strategy, content);
  }
  public listAssets() {
    return [
      { id: "1", tipo: "Página Pilar", titulo: "Guia Definitivo Concursos", status: "generated" },
      { id: "2", tipo: "FAQ", titulo: "Dúvidas Frequentes PassaCumaru", status: "generated" },
      { id: "3", tipo: "Checklist", titulo: "O que levar na prova", status: "validated" }
    ];
  }
  public getAsset(id: string) {
    return { id, tipo: "Artigo", titulo: "Técnicas de Estudo" };
  }
}
