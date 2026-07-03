import { DraftWriterEngine } from './draft-writer-engine';
import { VersionManager } from '../versions/version-manager';

export class DraftService {
  private engine = new DraftWriterEngine();
  private versionManager = new VersionManager();

  public createDraft(data: any) {
    const context = this.engine.prepareContext(data.briefId, data.blueprintId, data.researchId);
    const draft = this.engine.generateDraft(context);
    this.versionManager.registerVersion(draft.id, draft.text, { modelo_ia: "gpt-4o" });
    return draft;
  }
  public getDraft(id: string) {
    return { id, titulo: "Rascunho V1", status: "created", versao: "v1.0" };
  }
  public listDrafts() {
    return [
      { id: "1", titulo: "Rascunho de SEO Técnico", status: "created" }
    ];
  }
}
