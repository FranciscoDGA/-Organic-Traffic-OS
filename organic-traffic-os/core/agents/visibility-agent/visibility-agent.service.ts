import { VisibilityInput, VisibilityAgentOutput, VisibilityReport, VisibilityScore, VisibilityMetadata, SchemaMarkup, SnippetSuggestions, EntityCoverage, OptimizedDraft } from './visibility-agent.types';
import { VisibilityAgentValidator } from './visibility-agent.validator';

export class VisibilityAgentService {
  private validator = new VisibilityAgentValidator();

  private calculateScores(): VisibilityScore {
    return {
      seo_tecnico: 95,
      legibilidade: 88,
      cobertura_semantica: 92,
      cobertura_entidades: 100,
      heading_structure: 100,
      schema_readiness: 100,
      internal_linking: 85,
      external_references: 90,
      snippet_readiness: 95,
      ai_readability: 96,
      ai_citation_readiness: 94,
      pontuacao_final: 94,
    };
  }

  private generateMetadata(input: VisibilityInput): VisibilityMetadata {
    const title = input.draft_pack.seo_data.title || 'Conteúdo Otimizado';
    return {
      meta_title: title,
      meta_description: input.draft_pack.seo_data.meta_description,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      canonical: `https://${input.blog_id}.com/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      open_graph: { title, type: 'article' },
      twitter_card: { card: 'summary_large_image', title },
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      language: 'pt-BR',
      author: 'Organic Traffic OS',
      updated_date: new Date().toISOString(),
    };
  }

  private generateSchema(input: VisibilityInput): SchemaMarkup {
    return {
      types: ['Article', 'FAQPage', 'BreadcrumbList'],
      json_ld: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "headline": input.draft_pack.seo_data.title,
            "author": { "@type": "Organization", "name": "Organic Traffic OS" },
            "publisher": { "@type": "Organization", "name": input.blog_id }
          }
        ]
      }),
    };
  }

  private generateSnippets(): SnippetSuggestions {
    return {
      featured_snippet: "Resumo objetivo e direto gerado para capturar a posição zero no Google baseando-se no primeiro parágrafo otimizado.",
      people_also_ask: ["O que é?", "Como funciona?", "Quais os requisitos?"],
      resumo_executivo: "Síntese estruturada ideal para IA.",
      faq_otimizado: true,
      resumo_ia: "Conteúdo denso e rico em entidades, formatado em listas e marcações claras para fácil digestão por LLMs."
    };
  }

  private analyzeEntities(input: VisibilityInput): EntityCoverage {
    return {
      obrigatorias: ['Concurso', 'Edital', 'Vagas'],
      secundarias: ['Salário', 'Requisitos'],
      relacionadas: ['Prefeitura', 'Inscrição'],
      ausencias: [],
      recomendacoes: ['Incluir menção ao órgão organizador caso seja definido.'],
    };
  }

  private optimizeDraft(input: VisibilityInput): OptimizedDraft {
    return {
      content_markdown: input.draft_pack.content_markdown, // Mock pass-through
      content_html: input.draft_pack.content_html, // Mock pass-through
      internal_links_added: 3,
      external_links_added: 2,
    };
  }

  async runVisibility(input: VisibilityInput): Promise<VisibilityAgentOutput> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const report: VisibilityReport = {
      id: `vis-${Date.now()}`,
      content_id: input.draft_pack.content_id,
      draft_id: input.draft_pack.id,
      optimized_draft: this.optimizeDraft(input),
      score: this.calculateScores(),
      entity_coverage: this.analyzeEntities(input),
      metadata: this.generateMetadata(input),
      schema: this.generateSchema(input),
      snippets: this.generateSnippets(),
      warnings: [],
      created_at: new Date().toISOString(),
    };

    return {
      agent: 'visibility-agent',
      blog_id: input.blog_id,
      report,
      success: true,
      message: 'Otimização de visibilidade concluída.',
    };
  }
}
