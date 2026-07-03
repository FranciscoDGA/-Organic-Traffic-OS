import { PublishingInput, PublishingAgentOutput, PublicationPackage, ExportReport } from './publishing-agent.types';
import { PublishingAgentValidator } from './publishing-agent.validator';
import { AdapterFactory } from '../../publishing/adapters/adapter-factory';
import { AdapterContext } from '../../publishing/adapters/adapter-context';

export class PublishingAgentService {
  private validator = new PublishingAgentValidator();
  private factory = new AdapterFactory();

  private generateChecksum(content: string): string {
    // Mock checksum
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private buildPublicationPackage(input: PublishingInput): PublicationPackage {
    const html = input.optimized_draft.content_html;
    return {
      id: `pkg-${Date.now()}`,
      content_id: input.optimized_draft.content_markdown ? 'doc-123' : 'doc-unknown',
      version: '1.0.0',
      title: input.metadata.meta_title,
      slug: input.metadata.slug,
      language: input.metadata.language,
      status: 'prepared',
      metadata: input.metadata,
      schema: input.schema,
      html,
      markdown: input.optimized_draft.content_markdown,
      json: { content: html, seo: input.metadata, schema: input.schema },
      assets: [],
      checksum: this.generateChecksum(html),
      created_at: new Date().toISOString(),
    };
  }

  async runPublishing(input: PublishingInput): Promise<PublishingAgentOutput> {
    const validation = this.validator.validate(input);
    if (!validation.valid) throw new Error(validation.errors.join(', '));

    const pkg = this.buildPublicationPackage(input);
    const exports: ExportReport[] = [];

    // Run Adapters
    const ctx: AdapterContext = { blog_id: input.blog_id, env: input.mode };
    
    for (const adapterName of input.config.target_adapters) {
      const adapter = this.factory.getAdapter(adapterName);
      if (adapter) {
        const result = await adapter.export(pkg, ctx);
        exports.push({
          adapter: adapter.name,
          status: result.success ? 'success' : 'failed',
          exported_at: result.timestamp,
          url: result.url,
          error: result.error
        });
      } else {
        exports.push({
          adapter: adapterName,
          status: 'failed',
          exported_at: new Date().toISOString(),
          error: 'Adapter not found'
        });
      }
    }

    return {
      agent: 'publishing-agent',
      blog_id: input.blog_id,
      report: {
        id: `pub-${Date.now()}`,
        content_id: pkg.content_id,
        package: pkg,
        exports,
        warnings: exports.filter(e => e.status === 'failed').map(e => `Failed export to ${e.adapter}: ${e.error}`),
        created_at: new Date().toISOString()
      },
      success: exports.every(e => e.status === 'success'),
      message: 'Pacote gerado e exportado via adapters.',
    };
  }
}
