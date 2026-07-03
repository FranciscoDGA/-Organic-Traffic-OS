import { OpportunityItem, OpportunityScores } from './opportunity-intelligence.types';

export function validateAnalysisInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'object') return { valid: false, error: 'Input must be an object' };
  return { valid: true };
}

export function calculateOpportunityScore(item: OpportunityItem): number {
  const weights = {
    traffic_potential: 0.25,
    content_gap: 0.2,
    authority_fit: 0.15,
    freshness: 0.15,
    monetization: 0.15,
    difficulty_inverse: 0.1,
  };

  return Math.round(
    item.traffic_potential * weights.traffic_potential +
    item.content_gap * weights.content_gap +
    item.authority_fit * weights.authority_fit +
    item.freshness * weights.freshness +
    item.monetization * weights.monetization +
    (100 - item.difficulty) * weights.difficulty_inverse
  );
}

export function calculateTrafficPotentialScore(signals: {
  gsc_clicks?: number;
  gsc_impressions?: number;
  gsc_position?: number;
  trends_interest?: number;
  keyword_volume?: number;
  serp_competition?: number;
}): number {
  let score = 0;

  if (signals.gsc_impressions && signals.gsc_impressions > 1000) score += 20;
  else if (signals.gsc_impressions && signals.gsc_impressions > 500) score += 15;
  else if (signals.gsc_impressions && signals.gsc_impressions > 100) score += 10;

  if (signals.gsc_position && signals.gsc_position <= 10) score += 15;
  else if (signals.gsc_position && signals.gsc_position <= 20) score += 10;
  else if (signals.gsc_position && signals.gsc_position <= 50) score += 5;

  if (signals.trends_interest && signals.trends_interest > 70) score += 20;
  else if (signals.trends_interest && signals.trends_interest > 40) score += 10;

  if (signals.keyword_volume && signals.keyword_volume > 1000) score += 20;
  else if (signals.keyword_volume && signals.keyword_volume > 500) score += 15;
  else if (signals.keyword_volume && signals.keyword_volume > 100) score += 10;

  if (signals.serp_competition !== undefined) {
    if (signals.serp_competition < 30) score += 15;
    else if (signals.serp_competition < 60) score += 10;
    else if (signals.serp_competition < 80) score += 5;
  }

  if (signals.gsc_clicks && signals.gsc_clicks > 50) score += 10;
  else if (signals.gsc_clicks && signals.gsc_clicks > 10) score += 5;

  return Math.max(0, Math.min(100, score));
}

export function calculateDifficultyScore(signals: {
  serp_competition?: number;
  domain_authority?: number;
  existing_content?: boolean;
  cluster_strength?: number;
}): number {
  let score = 50;

  if (signals.serp_competition) {
    if (signals.serp_competition > 80) score += 30;
    else if (signals.serp_competition > 60) score += 20;
    else if (signals.serp_competition > 40) score += 10;
    else if (signals.serp_competition < 20) score -= 20;
  }

  if (signals.domain_authority) {
    if (signals.domain_authority > 60) score -= 15;
    else if (signals.domain_authority > 40) score -= 10;
    else if (signals.domain_authority < 20) score += 15;
  }

  if (signals.existing_content) score -= 10;
  else score += 10;

  if (signals.cluster_strength) {
    if (signals.cluster_strength > 70) score -= 10;
    else if (signals.cluster_strength < 30) score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function calculateMonetizationScore(signals: {
  commercial_intent?: boolean;
  keyword_type?: string;
  cta_opportunity?: boolean;
  conversion_potential?: number;
}): number {
  let score = 20;

  if (signals.commercial_intent) score += 30;
  if (signals.cta_opportunity) score += 15;

  if (signals.keyword_type) {
    if (signals.keyword_type === 'transactional') score += 25;
    else if (signals.keyword_type === 'commercial') score += 20;
    else if (signals.keyword_type === 'informational') score += 5;
  }

  if (signals.conversion_potential) {
    if (signals.conversion_potential > 70) score += 20;
    else if (signals.conversion_potential > 40) score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

export function calculateFreshnessScore(pubDate?: string, lastUpdate?: string): number {
  const date = lastUpdate || pubDate;
  if (!date) return 50;

  const ageMs = Date.now() - new Date(date).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  if (ageDays < 30) return 90;
  if (ageDays < 90) return 70;
  if (ageDays < 180) return 50;
  if (ageDays < 365) return 30;
  return 10;
}

export function calculateAuthorityFitScore(signals: {
  cluster_authority?: number;
  topical_authority?: number;
  entity_authority?: number;
  has_pillar?: boolean;
}): number {
  let score = 30;

  if (signals.cluster_authority) {
    if (signals.cluster_authority > 70) score += 20;
    else if (signals.cluster_authority > 40) score += 10;
  }

  if (signals.topical_authority) {
    if (signals.topical_authority > 70) score += 20;
    else if (signals.topical_authority > 40) score += 10;
  }

  if (signals.entity_authority) {
    if (signals.entity_authority > 70) score += 15;
    else if (signals.entity_authority > 40) score += 8;
  }

  if (signals.has_pillar) score += 15;

  return Math.max(0, Math.min(100, score));
}

export function calculateContentGapScore(signals: {
  has_content?: boolean;
  keyword_count?: number;
  question_count?: number;
  entity_count?: number;
  topic_depth?: number;
}): number {
  let score = 0;

  if (!signals.has_content) score += 40;
  else score += 10;

  if (signals.keyword_count !== undefined) {
    if (signals.keyword_count < 3) score += 20;
    else if (signals.keyword_count < 5) score += 10;
  }

  if (signals.question_count !== undefined) {
    if (signals.question_count > 5) score += 15;
    else if (signals.question_count > 2) score += 8;
  }

  if (signals.entity_count !== undefined) {
    if (signals.entity_count < 2) score += 10;
  }

  if (signals.topic_depth !== undefined) {
    if (signals.topic_depth < 30) score += 15;
    else if (signals.topic_depth < 50) score += 8;
  }

  return Math.max(0, Math.min(100, score));
}

export function calculateStrategicPriorityScore(signals: {
  business_alignment?: number;
  competitive_advantage?: number;
  seasonal_relevance?: number;
  conversion_path?: boolean;
}): number {
  let score = 30;

  if (signals.business_alignment) {
    if (signals.business_alignment > 70) score += 25;
    else if (signals.business_alignment > 40) score += 12;
  }

  if (signals.competitive_advantage) {
    if (signals.competitive_advantage > 70) score += 20;
    else if (signals.competitive_advantage > 40) score += 10;
  }

  if (signals.seasonal_relevance) {
    if (signals.seasonal_relevance > 70) score += 15;
    else if (signals.seasonal_relevance > 40) score += 8;
  }

  if (signals.conversion_path) score += 10;

  return Math.max(0, Math.min(100, score));
}
