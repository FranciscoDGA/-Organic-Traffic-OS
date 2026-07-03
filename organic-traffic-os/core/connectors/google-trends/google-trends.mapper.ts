import { GtInternalData, GtInterestOverTime, GtInterestByRegion, GtRelatedQueries, GtRelatedTopics, GtTimePoint } from './google-trends.types';

export class GtMapper {
  static toInternalInterestOverTime(interest: GtInterestOverTime, country: string): GtInternalData[] {
    return interest.timelineData.map((point: GtTimePoint) => ({
      id: `iot-${interest.term}-${point.date}`,
      term: interest.term,
      type: 'interest_over_time' as const,
      value: point.value,
      metadata: {
        average: interest.average,
        peak: interest.peak,
        trend: interest.trend,
      },
      date: point.date,
      country,
    }));
  }

  static toInternalInterestByRegion(interest: GtInterestByRegion, country: string): GtInternalData[] {
    return interest.regions.map((region, idx) => ({
      id: `ibr-${interest.term}-${region.region}`,
      term: interest.term,
      type: 'interest_by_region' as const,
      value: region.value,
      metadata: {
        region: region.region,
        rank: idx + 1,
        geoCode: region.geoCode,
      },
      date: new Date().toISOString().split('T')[0],
      country,
    }));
  }

  static toInternalRelatedQueries(related: GtRelatedQueries, country: string): GtInternalData[] {
    const data: GtInternalData[] = [];
    for (const q of related.rising) {
      data.push({
        id: `rq-${related.term}-rising-${q.query}`,
        term: related.term,
        type: 'related_queries' as const,
        value: q.value,
        metadata: { query: q.query, relationType: 'rising' },
        date: new Date().toISOString().split('T')[0],
        country,
      });
    }
    for (const q of related.top) {
      data.push({
        id: `rq-${related.term}-top-${q.query}`,
        term: related.term,
        type: 'related_queries' as const,
        value: q.value,
        metadata: { query: q.query, relationType: 'top' },
        date: new Date().toISOString().split('T')[0],
        country,
      });
    }
    return data;
  }

  static toInternalRelatedTopics(topics: GtRelatedTopics, country: string): GtInternalData[] {
    const data: GtInternalData[] = [];
    for (const t of topics.rising) {
      data.push({
        id: `rt-${topics.term}-rising-${t.topic}`,
        term: topics.term,
        type: 'related_topics' as const,
        value: t.value,
        metadata: { topic: t.topic, relationType: 'rising', mid: t.mid },
        date: new Date().toISOString().split('T')[0],
        country,
      });
    }
    for (const t of topics.top) {
      data.push({
        id: `rt-${topics.term}-top-${t.topic}`,
        term: topics.term,
        type: 'related_topics' as const,
        value: t.value,
        metadata: { topic: t.topic, relationType: 'top', mid: t.mid },
        date: new Date().toISOString().split('T')[0],
        country,
      });
    }
    return data;
  }

  static aggregateInterest(items: GtInternalData[]) {
    if (items.length === 0) return { total_records: 0, avg_interest: 0, peak_interest: 0, terms: 0 };
    const terms = new Set(items.map(i => i.term));
    return {
      total_records: items.length,
      avg_interest: Math.round(items.reduce((s, i) => s + i.value, 0) / items.length),
      peak_interest: Math.max(...items.map(i => i.value)),
      terms: terms.size,
    };
  }
}
