import { Experiment, ExperimentVariant, ExperimentType, MetricName } from './experimentation.types';

let counter = 0;

export function createExperiment(params: {
  workspaceId: string;
  name: string;
  hypothesis: string;
  type: ExperimentType;
  primaryMetric: MetricName;
  secondaryMetrics?: MetricName[];
  contentId?: string;
}): Experiment {
  const now = new Date().toISOString();
  return {
    id: `exp-${params.workspaceId}-${++counter}`,
    workspaceId: params.workspaceId,
    contentId: params.contentId,
    name: params.name,
    hypothesis: params.hypothesis,
    type: params.type,
    status: 'draft',
    primaryMetric: params.primaryMetric,
    secondaryMetrics: params.secondaryMetrics || [],
    variants: [],
    confidence: 0,
    conclusion: '',
    createdAt: now,
    updatedAt: now,
  };
}

export function createVariant(experimentId: string, name: string, description: string, changes: string): ExperimentVariant {
  const now = new Date().toISOString();
  return {
    id: `var-${experimentId}-${Date.now()}`,
    experimentId,
    name,
    description,
    changes,
    status: 'active',
    metrics: { ctr: 0, impressions: 0, clicks: 0, avg_position: 0, avg_time: 0, engagement: 0, conversions: 0, downloads: 0, leads: 0, open_rate: 0, click_rate: 0 },
    createdAt: now,
  };
}
