export class AssetService {
  listAssets(): any[] {
    return [];
  }

  createAsset(data: any): any {
    return { id: 'mock', ...data };
  }

  getAsset(id: string): any {
    return { id };
  }
}
