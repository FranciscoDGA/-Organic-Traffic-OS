import { BaseAdapter } from './base-adapter';
import { PublicationPackage } from '../../agents/publishing-agent/publishing-agent.types';
import { AdapterContext, AdapterResult } from './adapter-types';

export class HtmlAdapter implements BaseAdapter {
  id = 'html';
  name = 'HTML Local Export';
  async export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult> {
    return { success: true, timestamp: new Date().toISOString(), url: `/exports/${pkg.slug}.html` };
  }
}

export class MarkdownAdapter implements BaseAdapter {
  id = 'markdown';
  name = 'Markdown Local Export';
  async export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult> {
    return { success: true, timestamp: new Date().toISOString(), url: `/exports/${pkg.slug}.md` };
  }
}

export class JsonAdapter implements BaseAdapter {
  id = 'json';
  name = 'JSON Payload Export';
  async export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult> {
    return { success: true, timestamp: new Date().toISOString(), url: `/exports/${pkg.slug}.json` };
  }
}

export class WordPressAdapter implements BaseAdapter {
  id = 'wordpress';
  name = 'WordPress REST API (Future)';
  async export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult> {
    // Mock for future integration
    return { success: true, timestamp: new Date().toISOString(), url: `https://${ctx.blog_id}.com/${pkg.slug}/` };
  }
}

export class NextJsAdapter implements BaseAdapter {
  id = 'nextjs';
  name = 'Next.js App Router (Future)';
  async export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult> {
    // Mock for future integration
    return { success: true, timestamp: new Date().toISOString(), url: `https://app.${ctx.blog_id}.com/blog/${pkg.slug}` };
  }
}

export class HeadlessCmsAdapter implements BaseAdapter {
  id = 'headless-cms';
  name = 'Headless CMS (Future)';
  async export(pkg: PublicationPackage, ctx: AdapterContext): Promise<AdapterResult> {
    // Mock for future integration
    return { success: true, timestamp: new Date().toISOString() };
  }
}
