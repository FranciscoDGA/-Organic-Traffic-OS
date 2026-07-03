import { Experiment, ExperimentVariant, ExperimentAnalysis, MetricName } from './experimentation.types';

function calculateScore(variant: ExperimentVariant, primaryMetric: MetricName): number {
  const m = variant.metrics;
  const scores: Record<MetricName, number> = {
    ctr: m.ctr * 100, impressions: Math.min(100, m.impressions / 100), clicks: Math.min(100, m.clicks / 10),
    avg_position: Math.max(0, 100 - m.avg_position * 5), avg_time: Math.min(100, m.avg_time / 10),
    engagement: m.engagement * 100, conversions: Math.min(100, m.conversions * 10),
    downloads: Math.min(100, m.downloads * 10), leads: Math.min(100, m.leads * 10),
    open_rate: m.open_rate * 100, click_rate: m.click_rate * 100,
  };
  return scores[primaryMetric] || 0;
}

export function analyzeExperiment(experiment: Experiment): ExperimentAnalysis {
  const variantResults = experiment.variants.map(v => ({
    variantId: v.id,
    name: v.name,
    score: calculateScore(v, experiment.primaryMetric),
    metrics: { ...v.metrics },
  }));

  variantResults.sort((a, b) => b.score - a.score);

  const winner = variantResults[0];
  const confidence = winner && winner.score > 0 ? Math.min(95, 50 + winner.score * 0.5) : 0;
  const conclusion = winner
    ? `Variant "${winner.name}" performed best with score ${winner.score.toFixed(1)}`
    : 'Insufficient data for conclusion';

  return { experimentId: experiment.id, winner: winner?.variantId, confidence, conclusion, variantResults };
}

export function simulateMetrics(variant: ExperimentVariant, days: number = 7): ExperimentVariant {
  const base = Math.random() * 50 + 10;
  return {
    ...variant,
    metrics: {
      ctr: parseFloat((Math.random() * 0.1 + 0.02).toFixed(4)),
      impressions: Math.floor(base * 100 + Math.random() * 5000),
      clicks: Math.floor(base * 5 + Math.random() * 200),
      avg_position: parseFloat((Math.random() * 15 + 3).toFixed(1)),
      avg_time: parseFloat((Math.random() * 180 + 30).toFixed(0)),
      engagement: parseFloat((Math.random() * 0.6 + 0.2).toFixed(2)),
      conversions: Math.floor(Math.random() * 20),
      downloads: Math.floor(Math.random() * 10),
      leads: Math.floor(Math.random() * 8),
      open_rate: parseFloat((Math.random() * 0.3 + 0.1).toFixed(2)),
      click_rate: parseFloat((Math.random() * 0.15 + 0.03).toFixed(2)),
    },
  };
}
