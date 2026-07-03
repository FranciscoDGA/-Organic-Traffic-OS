import { WriterInput, DraftPack, WriterReport, SeoData, DraftMetrics } from './writer-agent.types';
import { WriterAgentValidator } from './writer-agent.validator';

export class WriterAgentService {
  private validator = new WriterAgentValidator();

  private generateMockMarkdown(title: string, facts: string[]): string {
    const intro = `## Introdução\n\nEste é um rascunho gerado automaticamente pelo **Writer Agent**. Abaixo estão os fatos validados incorporados ao texto:\n\n`;
    const body = facts.map(f => `- ${f}`).join('\n');
    return `# ${title}\n\n${intro}${body}\n\n## Conclusão\n\nConclusão gerada com base nas entidades e fatos aprovados.`;
  }

  private generateMockHtml(markdown: string): string {
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\n/gim, '<br />');
  }

  async runWriterDraft(input: WriterInput): Promise<WriterReport> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const { research_pack, evidence_pack } = input;
    
    // Extraindo fatos aprovados
    const approvedFacts = evidence_pack.fatos_aprovados.map(f => f.descricao);

    // Gerando o rascunho
    const title = research_pack.titulo || 'Rascunho Sem Título';
    const markdown = this.generateMockMarkdown(title, approvedFacts);
    const html = this.generateMockHtml(markdown);

    const seoData: SeoData = {
      title: `${title} | Guia Completo`,
      meta_description: `Confira todos os detalhes sobre ${title}. Fatos validados e atualizados.`,
      focus_keyword: 'concurso', // Fallback, could extract from pack if needed
      secondary_keywords: research_pack.entidades_obrigatorias?.map((e: any) => e.nome).slice(0, 3) || []
    };

    const metrics: DraftMetrics = {
      word_count: markdown.split(/\s+/).length,
      reading_time_minutes: Math.max(1, Math.ceil(markdown.split(/\s+/).length / 200)),
      headings_count: (markdown.match(/^#/gim) || []).length,
      paragraphs_count: (markdown.match(/\n\n/gim) || []).length + 1
    };

    const draftPack: DraftPack = {
      id: `draft-${Date.now()}`,
      content_id: research_pack.content_id,
      evidence_pack_id: evidence_pack.id,
      status: 'completed',
      seo_data: seoData,
      content_markdown: markdown,
      content_html: html,
      metrics,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      warnings: []
    };

    return {
      agent: 'writer-agent',
      blog_id: input.blog_id,
      draft_pack: draftPack,
      success: true,
      message: 'Rascunho gerado com sucesso.',
      created_at: new Date().toISOString(),
    };
  }
}
