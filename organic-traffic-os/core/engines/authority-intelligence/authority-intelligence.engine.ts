import {
  AuthorityItem, Cluster, EntityAuthority, InternalLink, PillarPage,
  AuthorityScores, AuthorityRecommendation
} from './authority-intelligence.types';
import {
  calculateTopicalAuthorityScore, calculateClusterAuthorityScore,
  calculateEntityAuthorityScore, calculateInternalLinkingScore,
  calculatePillarCoverageScore, calculateSourceAuthorityScore,
  calculateOverallAuthorityScore
} from './authority-intelligence.validator';

export class AuthorityIntelligenceEngine {
  buildClusters(items: AuthorityItem[], clustersData?: any[]): Cluster[] {
    const clusterMap = new Map<string, Cluster>();

    if (clustersData) {
      for (const c of clustersData) {
        clusterMap.set(c.name, {
          name: c.name,
          items: c.items || [],
          pillar_id: c.pillar_id,
          total_words: 0,
          avg_internal_links: 0,
          keywords: c.keywords || [],
          entities: c.entities || [],
        });
      }
    }

    for (const item of items) {
      const clusterName = item.cluster || 'uncategorized';
      const existing = clusterMap.get(clusterName);
      if (existing) {
        existing.items.push(item.id);
        existing.total_words += item.word_count;
        if (item.keywords) {
          for (const kw of item.keywords) {
            if (!existing.keywords.includes(kw)) existing.keywords.push(kw);
          }
        }
        if (item.entities) {
          for (const ent of item.entities) {
            if (!existing.entities.includes(ent)) existing.entities.push(ent);
          }
        }
      } else {
        clusterMap.set(clusterName, {
          name: clusterName,
          items: [item.id],
          total_words: item.word_count,
          avg_internal_links: 0,
          keywords: item.keywords || [],
          entities: item.entities || [],
        });
      }
    }

    for (const cluster of clusterMap.values()) {
      const clusterItems = items.filter(i => cluster.items.includes(i.id));
      const totalLinks = clusterItems.reduce((sum, i) => sum + i.internal_links_in + i.internal_links_out, 0);
      cluster.avg_internal_links = clusterItems.length > 0 ? totalLinks / clusterItems.length : 0;
    }

    return Array.from(clusterMap.values());
  }

  buildEntityAuthority(items: AuthorityItem[], clusters: Cluster[]): EntityAuthority[] {
    const entityMap = new Map<string, EntityAuthority>();

    for (const item of items) {
      if (!item.entities) continue;
      for (const entName of item.entities) {
        const key = entName.toLowerCase();
        const existing = entityMap.get(key);
        if (existing) {
          existing.mentions++;
          if (!existing.items_referenced.includes(item.id)) {
            existing.items_referenced.push(item.id);
          }
          if (item.cluster && !existing.clusters_referenced.includes(item.cluster)) {
            existing.clusters_referenced.push(item.cluster);
          }
        } else {
          entityMap.set(key, {
            name: entName,
            type: 'concept',
            mentions: 1,
            items_referenced: [item.id],
            clusters_referenced: item.cluster ? [item.cluster] : [],
            has_pillar: false,
          });
        }
      }
    }

    for (const entity of entityMap.values()) {
      for (const cluster of clusters) {
        if (cluster.entities.some(e => e.toLowerCase() === entity.name.toLowerCase())) {
          if (!entity.clusters_referenced.includes(cluster.name)) {
            entity.clusters_referenced.push(cluster.name);
          }
          if (cluster.pillar_id) {
            entity.has_pillar = true;
          }
        }
      }
    }

    return Array.from(entityMap.values()).sort((a, b) => b.mentions - a.mentions);
  }

  detectPillarGaps(clusters: Cluster[], items: AuthorityItem[]): { cluster: string; recommended_keywords: string[]; reason: string }[] {
    const gaps: { cluster: string; recommended_keywords: string[]; reason: string }[] = [];

    for (const cluster of clusters) {
      if (!cluster.pillar_id && cluster.items.length >= 3) {
        gaps.push({
          cluster: cluster.name,
          recommended_keywords: cluster.keywords.slice(0, 5),
          reason: `Cluster com ${cluster.items.length} conteúdos mas sem página pilar`,
        });
      }
    }

    return gaps;
  }

  detectWeakClusters(clusters: Cluster[]): { cluster: string; score: number; reason: string }[] {
    const weak: { cluster: string; score: number; reason: string }[] = [];

    for (const cluster of clusters) {
      let issues: string[] = [];
      let penalty = 0;

      if (cluster.total_words < 2000) {
        issues.push('pouco conteúdo');
        penalty += 30;
      }
      if (cluster.items.length < 3) {
        issues.push('poucos artigos');
        penalty += 25;
      }
      if (!cluster.pillar_id) {
        issues.push('sem pilar');
        penalty += 25;
      }
      if (cluster.avg_internal_links < 2) {
        issues.push('links internos fracos');
        penalty += 10;
      }
      if (cluster.keywords.length === 0) {
        issues.push('sem keywords definidas');
        penalty += 10;
      }

      if (issues.length > 0) {
        weak.push({
          cluster: cluster.name,
          score: Math.max(0, 100 - penalty),
          reason: issues.join(', '),
        });
      }
    }

    return weak.sort((a, b) => a.score - b.score);
  }

  analyzeInternalLinks(items: AuthorityItem[], links: InternalLink[]): { orphan_count: number; well_connected: number; avg_links: number } {
    const itemsWithIncoming = new Set(links.map(l => l.target_id)).size;
    const itemsWithOutgoing = new Set(links.map(l => l.source_id)).size;
    const allLinked = new Set([...links.map(l => l.source_id), ...links.map(l => l.target_id)]);

    const orphan_count = items.filter(i => !allLinked.has(i.id)).length;
    const well_connected = items.filter(i => {
      const incoming = links.filter(l => l.target_id === i.id).length;
      const outgoing = links.filter(l => l.source_id === i.id).length;
      return incoming >= 2 && outgoing >= 2;
    }).length;

    return {
      orphan_count,
      well_connected,
      avg_links: items.length > 0 ? links.length / items.length : 0,
    };
  }

  calculateScores(
    items: AuthorityItem[],
    clusters: Cluster[],
    entityAuth: EntityAuthority[],
    links: InternalLink[],
    pillarPages: PillarPage[]
  ): AuthorityScores {
    const topical = calculateTopicalAuthorityScore(items, clusters);
    const cluster = calculateClusterAuthorityScore(clusters, items);
    const entity = calculateEntityAuthorityScore(entityAuth);
    const internal_linking = calculateInternalLinkingScore(items, links);
    const pillar_coverage = calculatePillarCoverageScore(clusters, pillarPages);
    const source = calculateSourceAuthorityScore(items);
    const overall = calculateOverallAuthorityScore({ topical, cluster, entity, internal_linking, pillar_coverage, source });

    return { topical, cluster, entity, internal_linking, pillar_coverage, source, overall };
  }

  generateRecommendations(
    items: AuthorityItem[],
    clusters: Cluster[],
    entityAuth: EntityAuthority[],
    pillarGaps: { cluster: string; recommended_keywords: string[]; reason: string }[],
    weakClusters: { cluster: string; score: number; reason: string }[],
    scores: AuthorityScores
  ): AuthorityRecommendation[] {
    const recs: AuthorityRecommendation[] = [];
    let recId = 1;

    for (const gap of pillarGaps) {
      recs.push({
        id: `rec-${recId++}`, type: 'create_pillar', priority: 'critical',
        title: `Criar página pilar: ${gap.cluster}`,
        description: gap.reason,
        cluster: gap.cluster,
        impact: 'Crítico', effort: 'Alto',
        scores: { pillar_coverage: scores.pillar_coverage },
      });
    }

    for (const weak of weakClusters.filter(w => w.score < 40)) {
      recs.push({
        id: `rec-${recId++}`, type: 'expand_cluster', priority: 'high',
        title: `Expandir cluster: ${weak.cluster}`,
        description: `Score ${weak.score}/100 — ${weak.reason}`,
        cluster: weak.cluster,
        impact: 'Alto', effort: 'Alto',
        scores: { cluster: scores.cluster },
      });
    }

    const orphanItems = items.filter(i => i.internal_links_in === 0 && i.type === 'post');
    if (orphanItems.length > 0) {
      recs.push({
        id: `rec-${recId++}`, type: 'add_internal_links', priority: 'high',
        title: `Conectar ${orphanItems.length} itens órfãos`,
        description: 'Posts sem links de entrada — adicionar links de outros conteúdos relacionados.',
        impact: 'Alto', effort: 'Médio',
        scores: { internal_linking: scores.internal_linking },
      });
    }

    const weakEntities = entityAuth.filter(e => e.mentions < 3 && e.clusters_referenced.length < 2);
    if (weakEntities.length > 0) {
      recs.push({
        id: `rec-${recId++}`, type: 'strengthen_entity', priority: 'medium',
        title: `Fortalecer ${weakEntities.length} entidades fracas`,
        description: 'Entidades com poucas menções — referenciar em mais conteúdos e clusters.',
        impact: 'Médio', effort: 'Médio',
        scores: { entity: scores.entity },
      });
    }

    const shallowPillars = items.filter(i => i.type === 'pillar' && i.word_count < 1500);
    if (shallowPillars.length > 0) {
      recs.push({
        id: `rec-${recId++}`, type: 'expand_cluster', priority: 'high',
        title: `Expandir ${shallowPillars.length} páginas pilares rasas`,
        description: 'Páginas pilares com menos de 1500 palavras — expandir para 2000+.',
        impact: 'Alto', effort: 'Alto',
        scores: { pillar_coverage: scores.pillar_coverage },
      });
    }

    if (scores.internal_linking < 40) {
      recs.push({
        id: `rec-${recId++}`, type: 'add_internal_links', priority: 'medium',
        title: 'Melhorar rede de links internos',
        description: `Score de links internos ${scores.internal_linking}/100. Adicionar links entre conteúdos relacionados.`,
        impact: 'Médio', effort: 'Médio',
        scores: { internal_linking: scores.internal_linking },
      });
    }

    return recs.sort((a, b) => {
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
  }
}
