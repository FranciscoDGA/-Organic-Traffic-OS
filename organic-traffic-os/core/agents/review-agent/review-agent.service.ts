import { ReviewInput, ReviewAgentOutput, ReviewReport, QualityScore, ReviewChecklist } from './review-agent.types';
import { ReviewAgentValidator } from './review-agent.validator';

export class ReviewAgentService {
  private validator = new ReviewAgentValidator();

  private generateMockChecklist(): ReviewChecklist {
    return {
      titulo_adequado: true,
      introducao_clara: true,
      estrutura_correta: true,
      h2_presentes: true,
      h3_presentes: true,
      faq_presente: false,
      cta_presente: true,
      conclusao_adequada: true,
      objetivo_atendido: true,
    };
  }

  private calculateQualityScore(checklist: ReviewChecklist): QualityScore {
    // Mock calculation based on checklist and arbitrary logic
    return {
      clareza: 90,
      didatica: 85,
      fluidez: 88,
      organizacao: 92,
      cobertura_tema: 95,
      uso_fatos: 100,
      uso_fontes: 100,
      consistencia: 89,
      tom_voz: 85,
      aderencia_brief: 90,
      pontuacao_final: 91, // Média ponderada mock
    };
  }

  private generateRecommendations(score: QualityScore, checklist: ReviewChecklist): string[] {
    const recs: string[] = [];
    if (!checklist.faq_presente) recs.push('Adicionar seção de FAQ com perguntas frequentes.');
    if (score.tom_voz < 90) recs.push('Ajustar tom de voz para soar mais autoritário e confiável.');
    return recs.length ? recs : ['Conteúdo bem estruturado, pronto para publicação.'];
  }

  async runReview(input: ReviewInput): Promise<ReviewAgentOutput> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const checklist = this.generateMockChecklist();
    const quality_score = this.calculateQualityScore(checklist);
    const recommendations = this.generateRecommendations(quality_score, checklist);

    const isApproved = quality_score.pontuacao_final >= 80 && checklist.estrutura_correta;

    const report: ReviewReport = {
      id: `review-${Date.now()}`,
      content_id: input.draft_pack.content_id,
      draft_id: input.draft_pack.id,
      status: isApproved ? 'approved' : 'revision_requested',
      quality_score,
      checklist,
      warnings: !checklist.faq_presente ? ['Ausência de FAQ detectada.'] : [],
      recommendations,
      approved: isApproved,
      created_at: new Date().toISOString(),
    };

    return {
      agent: 'review-agent',
      blog_id: input.blog_id,
      report,
      success: true,
      message: isApproved ? 'Revisão concluída: Rascunho aprovado.' : 'Revisão concluída: Necessita revisão.',
    };
  }
}
