import { QualityReviewEngine } from './quality-review-engine';

export class QualityService {
  private engine = new QualityReviewEngine();

  public reviewDraft(data: any) {
    const { draftId, context } = data;
    const report = this.engine.runFullAudit({ id: draftId }, context || {});
    return { id: "report-id", draft_id: draftId, ...report };
  }
  public getReport(id: string) {
    return { id, score_geral: 92, status: "approved" };
  }
  public listReports() {
    return [
      { id: "1", draft_id: "d1", score_geral: 92, status: "approved" },
      { id: "2", draft_id: "d2", score_geral: 65, status: "needs_review" }
    ];
  }
}
