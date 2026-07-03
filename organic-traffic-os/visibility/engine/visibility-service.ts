import { VisibilityEngine } from './visibility-engine';
import { VisibilityValidator } from '../validators/visibility-validator';

export class VisibilityService {
  private engine = new VisibilityEngine();
  private validator = new VisibilityValidator();

  public optimizeDraft(data: any) {
    const { draftId, text, context } = data;
    const report = this.engine.optimizeVisibility(text, context);
    
    // Safety check
    this.validator.validateFactualIntegrity(text, report.text);
    
    return { id: "vis-rep-1", draft_id: draftId, ...report };
  }
  public listReports() {
    return [
      { id: "1", draft_id: "d1", overall_score: 96, ai_visibility_score: 98 }
    ];
  }
}
