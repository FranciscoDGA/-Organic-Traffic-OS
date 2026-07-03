import { BaseCollector, CollectorResult } from '../base/collector';

class PlaceholderCollector extends BaseCollector {
  constructor(
    public id: string,
    public nome: string,
    public fonte: string
  ) {
    super();
  }
  
  versao = '0.0.0';
  status: 'ativo' | 'inativo' | 'placeholder' = 'placeholder';

  async coletar(params?: any): Promise<any> { return {}; }
  validar(raw_data: any): boolean { return false; }
  normalizar(raw_data: any): CollectorResult { return {} as any; }
}

export const GoogleTrendsCollector = new PlaceholderCollector('google-trends-collector', 'Google Trends', 'Google APIs');
export const AutocompleteCollector = new PlaceholderCollector('autocomplete-collector', 'Google Autocomplete', 'Google Search');
export const PAACollector = new PlaceholderCollector('paa-collector', 'People Also Ask', 'Google Search');
export const SearchConsoleCollector = new PlaceholderCollector('search-console-collector', 'Google Search Console', 'Google APIs');
export const YouTubeCollector = new PlaceholderCollector('youtube-collector', 'YouTube Videos', 'YouTube Data API');
export const RedditCollector = new PlaceholderCollector('reddit-collector', 'Reddit Discussions', 'Reddit API');
export const NewsCollector = new PlaceholderCollector('news-collector', 'Google News', 'Google News RSS');
