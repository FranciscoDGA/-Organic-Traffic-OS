import { NaturalLanguageEngine } from './natural-language-engine';
import { LanguageValidator } from '../validators/language-validator';

export class LanguageService {
  private engine = new NaturalLanguageEngine();
  private validator = new LanguageValidator();

  public refineDraft(data: any) {
    const { draftId, text, context } = data;
    const refined = this.engine.refineDraft(text, context);
    
    // Safety check
    this.validator.validateFactualFidelity(text, refined.text);
    this.validator.validateCTAPresence(refined.text);
    
    return { id: "lang-rep-1", draft_id: draftId, status: "refined", ...refined };
  }
  public listReports() {
    return [
      { id: "1", draft_id: "d1", score_antes: 60, score_depois: 92, status: "refined" }
    ];
  }
  public getVersions() {
    return [
      { draft_id: "d1", versao_bruta: "v1.0", versao_humanizada: "v2.0" }
    ];
  }
}
