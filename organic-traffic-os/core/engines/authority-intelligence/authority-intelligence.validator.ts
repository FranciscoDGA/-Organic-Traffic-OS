import { AuthorityItem, Cluster, EntityAuthority, InternalLink, PillarPage, AuthorityScores } from './authority-intelligence.types';

export function validateAnalysisInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Input must be an object' };
  return { valid: true };
}

export function calculateTopicalAuthorityScore(items: AuthorityItem[], clusters: Cluster[]): number {
  if (items.length === 0) return 0;

  const posts = items.filter(i => i.type === 'post' || i.type === 'page');
  const avgWordCount = posts.reduce((sum, i) => sum + i.word_count, 0) / (posts.length || 1);
  const avgLinks = posts.reduce((sum, i) => sum + i.internal_links_in + i.internal_links_out, 0) / (posts.length || 1);

  let score = 0;
  if (avgWordCount > 1500) score += 25;
  else if (avgWordCount > 800) score += 20;
  else if (avgWordCount > 400) score += 10;

  if (clusters.length > 10) score += 25;
  else if (clusters.length > 5) score += 20;
  else if (clusters.length > 2) score += 10;

  if (avgLinks > 5) score += 20;
  else if (avgLinks > 2) score += 10;

  const uniqueKeywords = new Set(items.flatMap(i => i.keywords || [])).size;
  if (uniqueKeywords > 30) score += 20;
  else if (uniqueKeywords > 15) score += 15;
  else if (uniqueKeywords > 5) score += 10;

  const uniqueEntities = new Set(items.flatMap(i => i.entities || [])).size;
  if (uniqueEntities > 20) score += 10;
  else if (uniqueEntities > 10) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function calculateClusterAuthorityScore(clusters: Cluster[], items: AuthorityItem[]): number {
  if (clusters.length === 0) return 0;

  let score = 0;
  const clustersWithPillar = clusters.filter(c => c.pillar_id).length;
  const pillarRatio = clustersWithPillar / clusters.length;
  score += Math.round(pillarRatio * 30);

  const avgItemsPerCluster = clusters.reduce((sum, c) => sum + c.items.length, 0) / clusters.length;
  if (avgItemsPerCluster > 5) score += 25;
  else if (avgItemsPerCluster > 3) score += 20;
  else if (avgItemsPerCluster > 1) score += 10;

  const avgWords = clusters.reduce((sum, c) => sum + c.total_words, 0) / clusters.length;
  if (avgWords > 5000) score += 20;
  else if (avgWords > 2000) score += 15;
  else if (avgWords > 500) score += 10;

  const avgLinks = clusters.reduce((sum, c) => sum + c.avg_internal_links, 0) / clusters.length;
  if (avgLinks > 4) score += 15;
  else if (avgLinks > 2) score += 10;

  const clustersWithKeywords = clusters.filter(c => c.keywords.length > 0).length;
  score += Math.round((clustersWithKeywords / clusters.length) * 10);

  return Math.max(0, Math.min(100, score));
}

export function calculateEntityAuthorityScore(entityAuth: EntityAuthority[]): number {
  if (entityAuth.length === 0) return 0;

  const avgMentions = entityAuth.reduce((sum, e) => sum + e.mentions, 0) / entityAuth.length;
  const entitiesWithPillar = entityAuth.filter(e => e.has_pillar).length;
  const avgClusters = entityAuth.reduce((sum, e) => sum + e.clusters_referenced.length, 0) / entityAuth.length;

  let score = 0;
  if (avgMentions > 10) score += 30;
  else if (avgMentions > 5) score += 20;
  else if (avgMentions > 2) score += 10;

  score += Math.round((entitiesWithPillar / entityAuth.length) * 30);

  if (avgClusters > 3) score += 25;
  else if (avgClusters > 1) score += 15;

  if (entityAuth.length > 15) score += 15;
  else if (entityAuth.length > 8) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateInternalLinkingScore(items: AuthorityItem[], links: InternalLink[]): number {
  if (items.length === 0) return 0;

  const totalLinks = links.length;
  const avgLinksPerItem = totalLinks / items.length;

  const itemsWithIncoming = new Set(links.map(l => l.target_id)).size;
  const incomingRatio = itemsWithIncoming / items.length;

  const itemsWithOutgoing = new Set(links.map(l => l.source_id)).size;
  const outgoingRatio = itemsWithOutgoing / items.length;

  let score = 0;
  if (avgLinksPerItem > 5) score += 25;
  else if (avgLinksPerItem > 3) score += 20;
  else if (avgLinksPerItem > 1) score += 10;

  if (incomingRatio > 0.8) score += 25;
  else if (incomingRatio > 0.5) score += 20;
  else if (incomingRatio > 0.2) score += 10;

  if (outgoingRatio > 0.8) score += 25;
  else if (outgoingRatio > 0.5) score += 20;
  else if (outgoingRatio > 0.2) score += 10;

  const orphanItems = items.filter(i => {
    const hasIncoming = links.some(l => l.target_id === i.id);
    const hasOutgoing = links.some(l => l.source_id === i.id);
    return !hasIncoming && !hasOutgoing;
  }).length;
  const orphanRatio = orphanItems / items.length;
  score += Math.round((1 - orphanRatio) * 25);

  return Math.max(0, Math.min(100, score));
}

export function calculatePillarCoverageScore(clusters: Cluster[], pillarPages: PillarPage[]): number {
  if (clusters.length === 0) return 0;

  const clustersWithPillar = clusters.filter(c => c.pillar_id).length;
  const coverageRatio = clustersWithPillar / clusters.length;

  let score = Math.round(coverageRatio * 60);

  const avgPillarWords = pillarPages.reduce((sum, p) => sum + p.word_count, 0) / (pillarPages.length || 1);
  if (avgPillarWords > 2000) score += 20;
  else if (avgPillarWords > 1000) score += 15;
  else if (avgPillarWords > 500) score += 10;

  const avgPillarLinks = pillarPages.reduce((sum, p) => sum + p.internal_links_in, 0) / (pillarPages.length || 1);
  if (avgPillarLinks > 10) score += 20;
  else if (avgPillarLinks > 5) score += 10;

  return Math.max(0, Math.min(100, score));
}

export function calculateSourceAuthorityScore(items: AuthorityItem[]): number {
  if (items.length === 0) return 0;

  const sourceCounts = new Map<string, number>();
  for (const item of items) {
    sourceCounts.set(item.source, (sourceCounts.get(item.source) || 0) + 1);
  }

  const uniqueSources = sourceCounts.size;
  let score = 0;

  if (uniqueSources > 5) score += 30;
  else if (uniqueSources > 3) score += 20;
  else if (uniqueSources > 1) score += 10;

  const maxSource = Math.max(...sourceCounts.values());
  const dominanceRatio = maxSource / items.length;
  if (dominanceRatio < 0.5) score += 25;
  else if (dominanceRatio < 0.7) score += 15;

  const itemsWithKeywords = items.filter(i => i.keywords && i.keywords.length > 0).length;
  score += Math.round((itemsWithKeywords / items.length) * 25);

  const itemsWithEntities = items.filter(i => i.entities && i.entities.length > 0).length;
  score += Math.round((itemsWithEntities / items.length) * 20);

  return Math.max(0, Math.min(100, score));
}

export function calculateOverallAuthorityScore(scores: Omit<AuthorityScores, 'overall'>): number {
  const weights = {
    topical: 0.2,
    cluster: 0.2,
    entity: 0.15,
    internal_linking: 0.15,
    pillar_coverage: 0.15,
    source: 0.15,
  };

  return Math.round(
    scores.topical * weights.topical +
    scores.cluster * weights.cluster +
    scores.entity * weights.entity +
    scores.internal_linking * weights.internal_linking +
    scores.pillar_coverage * weights.pillar_coverage +
    scores.source * weights.source
  );
}
