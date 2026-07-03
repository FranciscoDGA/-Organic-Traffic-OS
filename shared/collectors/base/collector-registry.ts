import { ICollector } from './collector';
import { ManualCollector } from '../manual/manual-collector';
import { RSSCollector } from '../rss/rss-collector';
import * as Placeholders from '../placeholders/placeholder-collectors';

export class CollectorRegistry {
  private static collectors: Map<string, ICollector> = new Map();
  private static initialized = false;

  static init() {
    if (this.initialized) return;
    this.register(new ManualCollector());
    this.register(new RSSCollector());
    this.register(Placeholders.GoogleTrendsCollector);
    this.register(Placeholders.AutocompleteCollector);
    this.register(Placeholders.PAACollector);
    this.register(Placeholders.SearchConsoleCollector);
    this.register(Placeholders.YouTubeCollector);
    this.register(Placeholders.RedditCollector);
    this.register(Placeholders.NewsCollector);
    this.initialized = true;
  }

  static register(collector: ICollector) {
    this.collectors.set(collector.id, collector);
  }

  static get(id: string): ICollector | undefined {
    this.init();
    return this.collectors.get(id);
  }

  static getAll(): ICollector[] {
    this.init();
    return Array.from(this.collectors.values());
  }

  static getActive(): ICollector[] {
    this.init();
    return this.getAll().filter(c => c.status === 'ativo');
  }
}
