import { GtConfig, GtInterestOverTime, GtInterestByRegion, GtRelatedQueries, GtRelatedTopics, GtConnectorLog } from './google-trends.types';

const INTEREST_TERMS: Record<string, number> = {
  'concurso': 75, 'concurso público': 85, 'edital': 70, 'prefeitura': 60,
  'concurso municipal': 55, 'estudo para concurso': 65, 'questões concurso': 50,
  'banca IVIN': 35, 'concursocumaru': 5, 'edital cumaru 2026': 8,
};

function generateTimeline(baseValue: number, months = 12): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const seasonal = Math.sin((d.getMonth() / 12) * Math.PI * 2) * 15;
    const noise = (Math.random() - 0.5) * 10;
    const value = Math.max(0, Math.min(100, Math.round(baseValue + seasonal + noise)));
    data.push({ date: d.toISOString().split('T')[0], value });
  }
  return data;
}

const REGIONS: Record<string, string[]> = {
  BR: ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná', 'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Pará', 'Maranhão', 'Amazonas', 'Espírito Santo', 'Goiás', 'Paraíba', 'Santa Catarina'],
  US: ['California', 'Texas', 'Florida', 'New York', 'Illinois'],
};

const RELATED_QUERIES: Record<string, { rising: string[]; top: string[] }> = {
  'concurso': { rising: ['concurso ibGE 2026', 'concurso PF 2026', 'concurso banco do brasil'], top: ['concurso público', 'concurso 2026', 'edital concurso', 'concurso aberto', 'concurso militar'] },
  'concurso público': { rising: ['concurso público 2026 data', 'concurso prefeitura 2026'], top: ['concurso público 2026', 'edital concurso público', 'concurso aberto hoje', 'concurso federal'] },
  'edital': { rising: ['edital cumaru 2026', 'edital concurso 2026'], top: ['edital concurso', 'edital prefeitura', 'edital aberto', 'edital IFBA'] },
};

const RELATED_TOPICS: Record<string, { rising: string[]; top: string[] }> = {
  'concurso': { rising: ['Concurso Público Federal', 'Banca CESPE'], top: ['Concursos Públicos', 'Estudo', 'Vestibular'] },
  'concurso público': { rising: ['INSS Concurso', 'Receita Federal'], top: ['Concursos Públicos', 'Carreira Pública', 'Servidor Público'] },
};

export class GtClient {
  private config: GtConfig;
  private logs: GtConnectorLog[] = [];

  constructor(config: GtConfig) {
    this.config = config;
  }

  getLogs(): GtConnectorLog[] {
    return this.logs;
  }

  private log(level: GtConnectorLog['level'], action: string, message: string, extra?: Partial<GtConnectorLog>) {
    this.logs.push({ timestamp: new Date().toISOString(), level, action, message, ...extra });
  }

  private mockInterestOverTime(term: string): GtInterestOverTime {
    const baseValue = INTEREST_TERMS[term.toLowerCase()] || 30 + Math.floor(Math.random() * 40);
    const timeline = generateTimeline(baseValue);
    const avg = Math.round(timeline.reduce((s, t) => s + t.value, 0) / timeline.length);
    const peak = Math.max(...timeline.map(t => t.value));
    const recent = timeline.slice(-3).map(t => t.value);
    const older = timeline.slice(0, 3).map(t => t.value);
    const recentAvg = recent.reduce((s, v) => s + v, 0) / recent.length;
    const olderAvg = older.reduce((s, v) => s + v, 0) / older.length;
    const trend = recentAvg > olderAvg * 1.1 ? 'rising' : recentAvg < olderAvg * 0.9 ? 'declining' : 'stable';
    return { term, timelineData: timeline, average: avg, peak, trend };
  }

  private mockInterestByRegion(term: string, country = 'BR'): GtInterestByRegion {
    const regions = REGIONS[country] || REGIONS.BR;
    return {
      term,
      regions: regions.map(region => ({
        region,
        value: Math.max(5, Math.min(100, 30 + Math.floor(Math.random() * 70))),
      })).sort((a, b) => b.value - a.value),
    };
  }

  private mockRelatedQueries(term: string): GtRelatedQueries {
    const data = RELATED_QUERIES[term.toLowerCase()] || { rising: [`${term} 2026`, `${term} municipal`], top: [`${term} público`, `${term} edital`] };
    return {
      term,
      rising: data.rising.map(q => ({ query: q, value: 100 + Math.floor(Math.random() * 900), type: 'rising' as const })),
      top: data.top.map(q => ({ query: q, value: 50 + Math.floor(Math.random() * 50), type: 'top' as const })),
    };
  }

  private mockRelatedTopics(term: string): GtRelatedTopics {
    const data = RELATED_TOPICS[term.toLowerCase()] || { rising: [`${term} Federal`], top: [`${term} Público`] };
    return {
      term,
      rising: data.rising.map(t => ({ topic: t, value: 100 + Math.floor(Math.random() * 900), type: 'rising' as const })),
      top: data.top.map(t => ({ topic: t, value: 50 + Math.floor(Math.random() * 50), type: 'top' as const })),
    };
  }

  async fetchInterestOverTime(term: string, country = 'BR'): Promise<GtInterestOverTime> {
    this.log('info', 'fetch_interest_over_time', `Buscando interesse para "${term}" (${country})`);
    const start = Date.now();
    if (this.config.mode === 'api') {
      this.log('warn', 'api_not_available', 'Google Trends API oficial não disponível. Usando mock.');
    }
    const result = this.mockInterestOverTime(term);
    this.log('info', 'fetch_interest_success', `Dados obtidos: ${result.timelineData.length} pontos`, { duration_ms: Date.now() - start, records: result.timelineData.length });
    return result;
  }

  async fetchInterestByRegion(term: string, country = 'BR'): Promise<GtInterestByRegion> {
    this.log('info', 'fetch_interest_by_region', `Buscando interesse regional para "${term}" (${country})`);
    const start = Date.now();
    const result = this.mockInterestByRegion(term, country);
    this.log('info', 'fetch_region_success', `${result.regions.length} regiões encontradas`, { duration_ms: Date.now() - start, records: result.regions.length });
    return result;
  }

  async fetchRelatedQueries(term: string): Promise<GtRelatedQueries> {
    this.log('info', 'fetch_related_queries', `Buscando consultas relacionadas para "${term}"`);
    const start = Date.now();
    const result = this.mockRelatedQueries(term);
    this.log('info', 'fetch_related_success', `${result.rising.length} rising, ${result.top.length} top`, { duration_ms: Date.now() - start });
    return result;
  }

  async fetchRelatedTopics(term: string): Promise<GtRelatedTopics> {
    this.log('info', 'fetch_related_topics', `Buscando tópicos relacionados para "${term}"`);
    const start = Date.now();
    const result = this.mockRelatedTopics(term);
    this.log('info', 'fetch_topics_success', `${result.rising.length} rising, ${result.top.length} top`, { duration_ms: Date.now() - start });
    return result;
  }

  async compareTerms(terms: string[], country = 'BR') {
    this.log('info', 'compare_terms', `Comparando ${terms.length} termos`);
    const start = Date.now();
    const timelines = await Promise.all(terms.map(t => this.fetchInterestOverTime(t, country)));
    const allDates = [...new Set(timelines.flatMap(t => t.timelineData.map(d => d.date)))].sort();
    const comparison = {
      terms,
      timelineData: allDates.map(date => ({
        date,
        values: timelines.map(t => {
          const point = t.timelineData.find(p => t.timelineData.indexOf(p) === timelines.indexOf(t));
          return t.timelineData.find(p => p.date === date)?.value || 0;
        }),
      })),
      average: timelines.map(t => t.average),
      peak: timelines.map(t => t.peak),
      winner: terms[timelines.indexOf(timelines.reduce((best, t) => t.average > best.average ? t : best))],
    };
    this.log('info', 'compare_complete', `Vencedor: ${comparison.winner}`, { duration_ms: Date.now() - start });
    return comparison;
  }

  async detectSeasonality(term: string): Promise<{ month: string; avgValue: number }[]> {
    this.log('info', 'detect_seasonality', `Analisando sazonalidade para "${term}"`);
    const start = Date.now();
    const interest = await this.fetchInterestOverTime(term);
    const monthMap = new Map<string, number[]>();
    for (const point of interest.timelineData) {
      const month = new Date(point.date).toLocaleString('pt-BR', { month: 'long' });
      if (!monthMap.has(month)) monthMap.set(month, []);
      monthMap.get(month)!.push(point.value);
    }
    const pattern = Array.from(monthMap.entries()).map(([month, values]) => ({
      month,
      avgValue: Math.round(values.reduce((s, v) => s + v, 0) / values.length),
    }));
    this.log('info', 'seasonality_complete', `${pattern.length} meses analisados`, { duration_ms: Date.now() - start });
    return pattern;
  }
}
