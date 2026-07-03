import { BaseAdapter } from './base-adapter';
import { HtmlAdapter, MarkdownAdapter, JsonAdapter, WordPressAdapter, NextJsAdapter, HeadlessCmsAdapter } from './adapter-registry';

export class AdapterFactory {
  private adapters = new Map<string, BaseAdapter>();

  constructor() {
    this.register(new HtmlAdapter());
    this.register(new MarkdownAdapter());
    this.register(new JsonAdapter());
    this.register(new WordPressAdapter());
    this.register(new NextJsAdapter());
    this.register(new HeadlessCmsAdapter());
  }

  register(adapter: BaseAdapter) {
    this.adapters.set(adapter.id, adapter);
  }

  getAdapter(id: string): BaseAdapter | undefined {
    return this.adapters.get(id);
  }

  getAllAdapters(): BaseAdapter[] {
    return Array.from(this.adapters.values());
  }
}
