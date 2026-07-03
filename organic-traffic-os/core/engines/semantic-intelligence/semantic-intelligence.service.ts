import { SemanticIntelligenceEngine } from './semantic-intelligence.engine';
import {
  SemanticItem, SemanticMetrics, SemanticIntelligenceReport,
  AnalysisInput, SemanticRecommendation, SemanticScores,
  Entity, Topic, SemanticQuestion, SemanticGap
} from './semantic-intelligence.types';

export class SemanticIntelligenceService {
  private engine = new SemanticIntelligenceEngine();
  private lastReport: SemanticIntelligenceReport | null = null;
  private history: SemanticIntelligenceReport[] = [];

  async runAnalysis(input: AnalysisInput): Promise<SemanticIntelligenceReport> {
    const logs: SemanticIntelligenceReport['logs'] = [];
    const start = Date.now();

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'analysis_start', message: 'Starting semantic intelligence analysis' });

    const items = this.extractItems(input);
    const keywords = this.extractKeywords(input);
    const metrics = this.extractMetrics(items);

    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'data_extracted', message: `Extracted ${items.length} items, ${keywords.length} keywords` });

    const entities = this.engine.extractEntities(items);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'entities_extracted', message: `Found ${entities.length} unique entities` });

    const topics = this.engine.mapTopics(items, keywords);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'topics_mapped', message: `Mapped ${topics.length} topics` });

    const questions = this.engine.mapQuestions(items);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'questions_mapped', message: `Identified ${questions.length} questions` });

    const gaps = this.engine.detectSemanticGaps(items, entities, topics, questions, metrics);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'gaps_detected', message: `Detected ${gaps.length} semantic gaps` });

    const scores = this.engine.calculateScores(items, metrics, entities, topics, questions);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'scores_calculated', message: `Coverage: ${scores.coverage}, Entities: ${scores.entity_coverage}, Topics: ${scores.topic_depth}` });

    const recommendations = this.engine.generateRecommendations(items, metrics, entities, topics, questions, gaps, scores);
    logs.push({ timestamp: new Date().toISOString(), level: 'info', action: 'recommendations_generated', message: `Generated ${recommendations.length} recommendations`, duration_ms: Date.now() - start });

    const report: SemanticIntelligenceReport = {
      timestamp: new Date().toISOString(),
      total_items: items.length,
      total_entities: entities.length,
      total_topics: topics.length,
      total_questions: questions.length,
      total_gaps: gaps.length,
      overall_scores: scores,
      items,
      items_with_metrics: items.map((item, idx) => ({ item, metrics: metrics[idx] || this.defaultMetrics(item.id) })),
      entities,
      topics,
      questions,
      gaps,
      recommendations,
      logs,
    };

    this.lastReport = report;
    this.history.push(report);
    if (this.history.length > 20) this.history.shift();

    return report;
  }

  getRecommendations(): SemanticRecommendation[] {
    return this.lastReport?.recommendations || [];
  }

  getScores(): SemanticScores | null {
    return this.lastReport?.overall_scores || null;
  }

  getLastReport(): SemanticIntelligenceReport | null {
    return this.lastReport;
  }

  getHistory(): { timestamp: string; total_items: number; scores: SemanticScores; gaps_count: number }[] {
    return this.history.map(r => ({
      timestamp: r.timestamp,
      total_items: r.total_items,
      scores: r.overall_scores,
      gaps_count: r.total_gaps,
    }));
  }

  private extractItems(input: AnalysisInput): SemanticItem[] {
    const items: SemanticItem[] = [];
    let id = 1;

    if (input.knowledge_core) {
      for (const entry of input.knowledge_core) {
        items.push({
          id: `kc-${id++}`, url: entry.url || '', title: entry.title || `Knowledge ${id}`,
          content: entry.content || entry.description || '', type: 'page',
          keywords: entry.keywords || [], entities: entry.entities || [],
          topics: entry.topics || [],
        });
      }
    }

    if (input.keywords_data) {
      for (const kw of input.keywords_data) {
        if (!items.find(i => i.title === kw.keyword)) {
          items.push({
            id: `kw-${id++}`, url: '', title: kw.keyword || `Keyword ${id}`,
            content: kw.description || kw.context || '', type: 'other',
            keywords: [kw.keyword], topics: kw.topics || [],
          });
        }
      }
    }

    if (input.inventory_data) {
      for (const entry of input.inventory_data) {
        if (!items.find(i => i.url === entry.url)) {
          items.push({
            id: `inv-${id++}`, url: entry.url || '', title: entry.title || `Inventory ${id}`,
            content: entry.content || entry.body || '', type: entry.type || 'page',
            keywords: entry.keywords || [], entities: entry.entities || [],
            topics: entry.topics || [],
          });
        }
      }
    }

    if (input.research_packs) {
      for (const pack of input.research_packs) {
        items.push({
          id: `rp-${id++}`, url: '', title: pack.title || `Research Pack ${id}`,
          content: pack.summary || pack.content || '', type: 'research_pack',
          keywords: pack.keywords || [], topics: pack.topics || [],
        });
      }
    }

    if (input.drafts) {
      for (const draft of input.drafts) {
        if (!items.find(i => i.url === draft.url)) {
          items.push({
            id: `dr-${id++}`, url: draft.url || '', title: draft.title || `Draft ${id}`,
            content: draft.content || draft.body || '', type: 'draft',
            keywords: draft.keywords || [], topics: draft.topics || [],
          });
        }
      }
    }

    if (input.sources) {
      for (const source of input.sources) {
        if (!items.find(i => i.url === source.url)) {
          items.push({
            id: `src-${id++}`, url: source.url || '', title: source.title || `Source ${id}`,
            content: source.content || source.description || '', type: 'source',
            keywords: source.keywords || [],
          });
        }
      }
    }

    if (input.facts) {
      for (const fact of input.facts) {
        items.push({
          id: `fact-${id++}`, url: '', title: fact.claim || `Fact ${id}`,
          content: fact.evidence || fact.claim || '', type: 'other',
          keywords: fact.keywords || [],
        });
      }
    }

    return items;
  }

  private extractKeywords(input: AnalysisInput): string[] {
    const keywords = new Set<string>();

    if (input.keywords_data) {
      for (const kw of input.keywords_data) {
        if (kw.keyword) keywords.add(kw.keyword.toLowerCase());
        if (kw.keywords) {
          for (const k of kw.keywords) keywords.add(k.toLowerCase());
        }
      }
    }

    if (input.research_packs) {
      for (const pack of input.research_packs) {
        if (pack.keywords) {
          for (const k of pack.keywords) keywords.add(k.toLowerCase());
        }
      }
    }

    if (input.inventory_data) {
      for (const entry of input.inventory_data) {
        if (entry.keywords) {
          for (const k of entry.keywords) keywords.add(k.toLowerCase());
        }
      }
    }

    return Array.from(keywords);
  }

  private extractMetrics(items: SemanticItem[]): SemanticMetrics[] {
    return items.map(item => {
      const words = item.content.split(/\s+/).filter(w => w.length > 0);
      const sentences = item.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 20;

      let readability = 60;
      if (avgSentenceLength > 25) readability -= 15;
      else if (avgSentenceLength > 20) readability -= 5;
      if (words.length > 2000) readability += 10;
      else if (words.length > 500) readability += 5;
      readability = Math.max(0, Math.min(100, readability));

      return {
        item_id: item.id,
        word_count: words.length,
        keyword_count: item.keywords?.length || 0,
        entity_count: item.entities?.length || 0,
        topic_count: item.topics?.length || 0,
        question_count: item.questions?.length || 0,
        internal_links: (item.content.match(/\[.*?\]\(.*?\)/g) || []).length,
        external_links: (item.content.match(/https?:\/\//g) || []).length,
        headings: (item.content.match(/^#+\s/gm) || []).length,
        avg_sentence_length: Math.round(avgSentenceLength),
        readability_score: readability,
      };
    });
  }

  private defaultMetrics(item_id: string): SemanticMetrics {
    return {
      item_id, word_count: 0, keyword_count: 0, entity_count: 0,
      topic_count: 0, question_count: 0, internal_links: 0,
      external_links: 0, headings: 0, avg_sentence_length: 20,
      readability_score: 50,
    };
  }
}
