import {
  BriefTemplate, SearchIntent, Entities, Questions, Outline, SeoBrief, InternalLinks, References, WritingGuidelines
} from '../models/brief-models';

export class BriefScoreEngine {
  static calculate(
    intent: SearchIntent,
    entities: Entities,
    questions: Questions,
    outline: Outline,
    seo: SeoBrief,
    links: InternalLinks,
    refs: References
  ): number {
    let score = 0;

    // Completude de Intenção
    if (intent.intencao_principal) score += 10;
    if (intent.problemas.length > 0) score += 5;

    // Entidades
    if (entities.obrigatorias.length > 0) score += 15;

    // Perguntas
    if (questions.obrigatorias.length > 0) score += 15;

    // Estrutura
    if (outline.h2.length > 0) score += 15;
    if (outline.faq) score += 5;

    // SEO
    if (seo.keyword_principal) score += 15;
    if (seo.meta_title && seo.meta_description) score += 10;

    // Referências e Links
    if (links.artigos_relacionados.length > 0) score += 5;
    if (refs.fontes.length > 0) score += 5;

    return Math.min(score, 100);
  }
}
