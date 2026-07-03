import {
  SemanticItem, SemanticMetrics, Entity, Topic, SemanticQuestion,
  SemanticGap, SemanticScores, SemanticRecommendation
} from './semantic-intelligence.types';
import {
  calculateCoverageScore, calculateEntityCoverageScore, calculateTopicDepthScore,
  calculateQuestionAnsweringScore, calculateTopicalAuthorityScore, calculateCompletenessScore
} from './semantic-intelligence.validator';

export class SemanticIntelligenceEngine {
  extractEntities(items: SemanticItem[]): Entity[] {
    const entityMap = new Map<string, Entity>();

    for (const item of items) {
      const text = `${item.title} ${item.content}`.toLowerCase();

      const entityPatterns: [RegExp, Entity['type']][] = [
        [/\b(google|bing|facebook|meta|amazon|microsoft|apple|openai|anthropic)\b/gi, 'organization'],
        [/\b(python|javascript|typescript|react|next\.?js|node\.?js|vercel)\b/gi, 'product'],
        [/\b(seo|sem|ppc|ctr|roi|kpi|cta|ux|ui)\b/gi, 'concept'],
        [/\b(brasil|são paulo|rio de janeiro|eua|europa)\b/gi, 'location'],
      ];

      for (const [pattern, type] of entityPatterns) {
        const matches = text.match(pattern);
        if (matches) {
          for (const match of matches) {
            const name = match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
            const key = name.toLowerCase();
            const existing = entityMap.get(key);
            if (existing) {
              existing.frequency++;
              if (!existing.items_referenced.includes(item.id)) {
                existing.items_referenced.push(item.id);
              }
              if (!existing.contexts.includes(item.title)) {
                existing.contexts.push(item.title);
              }
            } else {
              entityMap.set(key, {
                name, type, frequency: 1,
                contexts: [item.title],
                items_referenced: [item.id],
              });
            }
          }
        }
      }

      if (item.entities) {
        for (const ent of item.entities) {
          const key = ent.toLowerCase();
          const existing = entityMap.get(key);
          if (existing) {
            existing.frequency++;
            if (!existing.items_referenced.includes(item.id)) {
              existing.items_referenced.push(item.id);
            }
          } else {
            entityMap.set(key, {
              name: ent, type: 'concept', frequency: 1,
              contexts: [item.title],
              items_referenced: [item.id],
            });
          }
        }
      }
    }

    return Array.from(entityMap.values()).sort((a, b) => b.frequency - a.frequency);
  }

  mapTopics(items: SemanticItem[], keywords: string[]): Topic[] {
    const topicMap = new Map<string, Topic>();

    for (const item of items) {
      const text = `${item.title} ${item.content} ${(item.keywords || []).join(' ')}`.toLowerCase();

      const potentialTopics = new Set<string>();

      if (item.topics) {
        for (const t of item.topics) potentialTopics.add(t.toLowerCase());
      }

      for (const kw of keywords) {
        if (text.includes(kw.toLowerCase())) {
          potentialTopics.add(kw.toLowerCase());
        }
      }

      if (item.keywords) {
        for (const kw of item.keywords) {
          if (text.includes(kw.toLowerCase())) {
            potentialTopics.add(kw.toLowerCase());
          }
        }
      }

      for (const topicName of potentialTopics) {
        const existing = topicMap.get(topicName);
        if (existing) {
          existing.frequency++;
          if (!existing.items_referenced.includes(item.id)) {
            existing.items_referenced.push(item.id);
          }
          if (item.keywords) {
            for (const kw of item.keywords) {
              if (!existing.keywords.includes(kw.toLowerCase())) {
                existing.keywords.push(kw.toLowerCase());
              }
            }
          }
        } else {
          topicMap.set(topicName, {
            name: topicName,
            keywords: item.keywords?.map(k => k.toLowerCase()) || [],
            frequency: 1,
            depth: item.content.split(/\s+/).length > 500 ? 3 : item.content.split(/\s+/).length > 200 ? 2 : 1,
            items_referenced: [item.id],
            coverage_score: Math.min(100, Math.round(item.content.split(/\s+/).length / 15)),
          });
        }
      }
    }

    return Array.from(topicMap.values()).sort((a, b) => b.frequency - a.frequency);
  }

  mapQuestions(items: SemanticItem[]): SemanticQuestion[] {
    const questionMap = new Map<string, SemanticQuestion>();
    const questionPatterns = [
      /(?:como|por que|o que|qual|quando|onde|quem|quais)\s+[^?]+\?/gi,
      /(?:como|por que|o que|qual|quando|onde|quem|quais)\s+[^\.\!]+/gi,
    ];

    for (const item of items) {
      const text = `${item.title} ${item.content}`;
      const questions: string[] = [];

      if (item.questions) {
        questions.push(...item.questions);
      }

      for (const pattern of questionPatterns) {
        const matches = text.match(pattern);
        if (matches) {
          questions.push(...matches.map(m => m.trim()));
        }
      }

      for (const q of questions) {
        const normalized = q.toLowerCase().replace(/[?!.]+$/, '').trim();
        if (normalized.length < 10) continue;

        const existing = questionMap.get(normalized);
        if (existing) {
          if (!existing.items_answered.includes(item.id)) {
            existing.items_answered.push(item.id);
          }
        } else {
          questionMap.set(normalized, {
            question: q.trim(),
            topic: this.inferTopicFromQuestion(normalized),
            answer_coverage: item.content.toLowerCase().includes(normalized.split(' ').slice(1).join(' ')) ? 60 : 20,
            items_answered: [item.id],
            items_unanswered: [],
          });
        }
      }
    }

    return Array.from(questionMap.values());
  }

  detectSemanticGaps(
    items: SemanticItem[],
    entities: Entity[],
    topics: Topic[],
    questions: SemanticQuestion[],
    metrics: SemanticMetrics[]
  ): SemanticGap[] {
    const gaps: SemanticGap[] = [];
    let gapId = 1;

    const lowEntityItems = items.filter(item => {
      const m = metrics.find(met => met.item_id === item.id);
      return m && m.entity_count < 2;
    });
    if (lowEntityItems.length > items.length * 0.3) {
      gaps.push({
        id: `gap-${gapId++}`, type: 'entity_missing',
        description: `${lowEntityItems.length} itens com menos de 2 entidades`,
        topic: 'Geral', priority: 'high',
        recommendation: 'Adicionar entidades relevantes (organizações, produtos, conceitos) ao conteúdo',
        related_items: lowEntityItems.map(i => i.id),
      });
    }

    const shallowTopics = topics.filter(t => t.depth < 2);
    if (shallowTopics.length > topics.length * 0.4 && topics.length > 0) {
      gaps.push({
        id: `gap-${gapId++}`, type: 'topic_missing',
        description: `${shallowTopics.length} tópicos com profundidade insuficiente`,
        topic: shallowTopics.slice(0, 3).map(t => t.name).join(', '),
        priority: 'high',
        recommendation: 'Aprofundar tópicos existentes com sub-tópicos, exemplos e dados',
        related_items: shallowTopics.flatMap(t => t.items_referenced).slice(0, 5),
      });
    }

    const unansweredQuestions = questions.filter(q => q.answer_coverage < 40);
    if (unansweredQuestions.length > 0) {
      gaps.push({
        id: `gap-${gapId++}`, type: 'question_unanswered',
        description: `${unansweredQuestions.length} perguntas do público sem resposta adequada`,
        topic: unansweredQuestions.slice(0, 3).map(q => q.topic).join(', '),
        priority: 'critical',
        recommendation: 'Criar ou atualizar conteúdo para responder às perguntas identificadas',
        related_items: unansweredQuestions.flatMap(q => q.items_answered).slice(0, 5),
      });
    }

    const lowKeywordItems = items.filter(item => {
      const m = metrics.find(met => met.item_id === item.id);
      return m && m.keyword_count < 3 && m.word_count > 300;
    });
    if (lowKeywordItems.length > 0) {
      gaps.push({
        id: `gap-${gapId++}`, type: 'keyword_missing',
        description: `${lowKeywordItems.length} conteúdos longos com poucas palavras-chave`,
        topic: 'Geral', priority: 'medium',
        recommendation: 'Incorporar palavras-chave relevantes naturalmente no conteúdo',
        related_items: lowKeywordItems.map(i => i.id),
      });
    }

    const highFreqLowCoverage = topics.filter(t => t.frequency > 3 && t.items_referenced.length < 3);
    if (highFreqLowCoverage.length > 0) {
      gaps.push({
        id: `gap-${gapId++}`, type: 'cluster_incomplete',
        description: `${highFreqLowCoverage.length} tópicos frequentes com poucos conteúdos`,
        topic: highFreqLowCoverage.slice(0, 3).map(t => t.name).join(', '),
        priority: 'high',
        recommendation: 'Expandir cluster temático com mais conteúdos sobre o mesmo tópico',
        related_items: highFreqLowCoverage.flatMap(t => t.items_referenced).slice(0, 5),
      });
    }

    return gaps.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }

  calculateScores(
    items: SemanticItem[],
    metrics: SemanticMetrics[],
    entities: Entity[],
    topics: Topic[],
    questions: SemanticQuestion[]
  ): SemanticScores {
    const avgCoverage = metrics.length > 0
      ? Math.round(metrics.reduce((sum, m) => sum + calculateCoverageScore(m), 0) / metrics.length)
      : 0;

    return {
      coverage: avgCoverage,
      entity_coverage: calculateEntityCoverageScore(items, entities.length),
      topic_depth: calculateTopicDepthScore(topics),
      question_answering: calculateQuestionAnsweringScore(questions),
      topical_authority: calculateTopicalAuthorityScore(items, topics, this.countKeywords(items)),
      completeness: calculateCompletenessScore(metrics),
    };
  }

  generateRecommendations(
    items: SemanticItem[],
    metrics: SemanticMetrics[],
    entities: Entity[],
    topics: Topic[],
    questions: SemanticQuestion[],
    gaps: SemanticGap[],
    scores: SemanticScores
  ): SemanticRecommendation[] {
    const recs: SemanticRecommendation[] = [];
    let recId = 1;

    if (scores.entity_coverage < 30) {
      recs.push({
        id: `rec-${recId++}`, type: 'cover_entity', priority: 'high',
        title: 'Expandir cobertura de entidades',
        description: `Score de entidades ${scores.entity_coverage}/100. Adicionar organizações, produtos e conceitos relevantes.`,
        topic: 'Geral', impact: 'Alto', effort: 'Médio',
        scores: { entity_coverage: scores.entity_coverage },
      });
    }

    if (scores.topic_depth < 40) {
      recs.push({
        id: `rec-${recId++}`, type: 'deepen_topic', priority: 'high',
        title: 'Aprofundar tópicos',
        description: `Score de profundidade ${scores.topic_depth}/100. Expandir tópicos com sub-tópicos e detalhes.`,
        topic: topics.slice(0, 3).map(t => t.name).join(', ') || 'Geral',
        impact: 'Alto', effort: 'Alto',
        scores: { topic_depth: scores.topic_depth },
      });
    }

    if (scores.question_answering < 30) {
      const unanswered = questions.filter(q => q.answer_coverage < 40).slice(0, 3);
      recs.push({
        id: `rec-${recId++}`, type: 'answer_question', priority: 'critical',
        title: 'Responder perguntas do público',
        description: `${unanswered.length} perguntas sem resposta adequada. Criar conteúdo que responda diretamente.`,
        topic: unanswered.map(q => q.topic).join(', ') || 'Geral',
        impact: 'Crítico', effort: 'Alto',
        scores: { question_answering: scores.question_answering },
      });
    }

    const lowKeywordItems = items.filter((item, idx) => metrics[idx] && metrics[idx].keyword_count < 3 && metrics[idx].word_count > 300);
    if (lowKeywordItems.length > 0) {
      recs.push({
        id: `rec-${recId++}`, type: 'add_keyword', priority: 'medium',
        title: 'Incorporar palavras-chave',
        description: `${lowKeywordItems.length} conteúdos longos com poucas palavras-chave.`,
        topic: 'Geral', impact: 'Médio', effort: 'Baixo',
        scores: { coverage: scores.coverage },
      });
    }

    const shallowItems = items.filter((item, idx) => metrics[idx] && metrics[idx].word_count < 500 && item.type === 'post');
    if (shallowItems.length > 0) {
      recs.push({
        id: `rec-${recId++}`, type: 'improve_depth', priority: 'medium',
        title: 'Expandir conteúdo raso',
        description: `${shallowItems.length} posts com menos de 500 palavras.`,
        topic: 'Geral', impact: 'Médio', effort: 'Médio',
        scores: { completeness: scores.completeness },
      });
    }

    const incompleteClusters = topics.filter(t => t.frequency > 3 && t.items_referenced.length < 3);
    if (incompleteClusters.length > 0) {
      recs.push({
        id: `rec-${recId++}`, type: 'expand_cluster', priority: 'high',
        title: 'Expandir clusters temáticos',
        description: `${incompleteClusters.length} tópicos frequentes com poucos conteúdos.`,
        topic: incompleteClusters.slice(0, 3).map(t => t.name).join(', '),
        impact: 'Alto', effort: 'Alto',
        scores: { topical_authority: scores.topical_authority },
      });
    }

    if (scores.completeness < 40) {
      recs.push({
        id: `rec-${recId++}`, type: 'create_content', priority: 'high',
        title: 'Criar conteúdo complementar',
        description: `Score de completude ${scores.completeness}/100. Criar conteúdos para preencher lacunas.`,
        topic: 'Geral', impact: 'Alto', effort: 'Alto',
        scores: { completeness: scores.completeness },
      });
    }

    return recs.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }

  private countKeywords(items: SemanticItem[]): number {
    const keywords = new Set<string>();
    for (const item of items) {
      if (item.keywords) {
        for (const kw of item.keywords) keywords.add(kw.toLowerCase());
      }
    }
    return keywords.size;
  }

  private inferTopicFromQuestion(question: string): string {
    const words = question.split(' ').filter(w => w.length > 3);
    return words.slice(0, 3).join(' ') || 'Geral';
  }
}
