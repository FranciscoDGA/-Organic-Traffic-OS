import { AudienceAdaptationEngine } from './audience-adaptation-engine';

export class AudienceService {
  private engine = new AudienceAdaptationEngine();

  public analyzeDraft(data: any) {
    const { draftId, context } = data;
    const plan = this.engine.runAdaptationPlan({ id: draftId, text: "Exemplo bruto..." }, context || {});
    return { id: "plan-id", draft_id: draftId, ...plan };
  }
  public getReport(id: string) {
    return { id, score: 88, status: "needs_adaptation", tom_recomendado: "didático" };
  }
  public listReports() {
    return [
      { id: "1", draft_id: "d1", score: 88, status: "needs_adaptation" },
      { id: "2", draft_id: "d2", score: 95, status: "adapted" }
    ];
  }
}
