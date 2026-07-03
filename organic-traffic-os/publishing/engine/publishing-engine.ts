import { HTMLRenderer } from '../renderers/html-renderer';
import { MarkdownRenderer } from '../renderers/markdown-renderer';
import { JSONRenderer } from '../renderers/json-renderer';
import { WordPressRenderer } from '../renderers/future-wordpress-renderer';
import { NextJSRenderer } from '../renderers/future-nextjs-renderer';

export class PublishingEngine {
  private renderers = {
    html: new HTMLRenderer(),
    markdown: new MarkdownRenderer(),
    json: new JSONRenderer(),
    wordpress: new WordPressRenderer(),
    nextjs: new NextJSRenderer()
  };

  public preparePackage(asset: any, visibility: any, strategy: any, format: keyof typeof this.renderers) {
    const renderer = this.renderers[format] || this.renderers.json;
    const document = {
      content_id: `cid-${Date.now()}`,
      asset_id: asset.id,
      titulo: asset.titulo,
      slug: asset.titulo.toLowerCase().replace(/ /g, '-'),
      tipo: asset.tipo,
      versao: "1.0",
      status: "ready_for_publishing",
      idioma: "pt-BR",
      autor: "Organic Traffic OS",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      body: asset.content
    };
    
    const output = renderer.render(document);
    
    const manifest = {
      content_id: document.content_id,
      versao: document.versao,
      destino: format === 'wordpress' ? 'WordPress' : 'Export',
      renderer: format,
      status: 'prepared',
      checksum: "mock-hash-12345"
    };

    return { document, output, manifest, seo: visibility.seo, schema: visibility.schema };
  }
}
