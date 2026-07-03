export class VersionManager {
  public registerVersion(draftId: string, text: string, metadata: any) {
    return { id: "version-id", draftId, versao: "v1.1", ...metadata };
  }
  public compareVersions(v1Id: string, v2Id: string) {
    return { diffs: [] };
  }
}
