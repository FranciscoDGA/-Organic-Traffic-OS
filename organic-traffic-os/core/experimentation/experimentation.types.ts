export type ExperimentType = 'title_test' | 'meta_description_test' | 'cta_test' | 'introduction_test' | 'content_format_test' | 'internal_link_test' | 'newsletter_subject_test' | 'publishing_channel_test';

export type ExperimentStatus = 'draft' | 'running' | 'paused' | 'completed' | 'cancelled';

export type MetricName = 'ctr' | 'impressions' | 'clicks' | 'avg_position' | 'avg_time' | 'engagement' | 'conversions' | 'downloads' | 'leads' | 'open_rate' | 'click_rate';

export interface ExperimentVariant {
  id: string;
  experimentId: string;
  name: string;
  description: string;
  changes: string;
  status: 'active' | 'inactive' | 'winner';
  metrics: Record<MetricName, number>;
  createdAt: string;
}

export interface Experiment {
  id: string;
  workspaceId: string;
  contentId?: string;
  name: string;
  hypothesis: string;
  type: ExperimentType;
  status: ExperimentStatus;
  startDate?: string;
  endDate?: string;
  primaryMetric: MetricName;
  secondaryMetrics: MetricName[];
  variants: ExperimentVariant[];
  winner?: string;
  confidence: number;
  conclusion: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentAnalysis {
  experimentId: string;
  winner?: string;
  confidence: number;
  conclusion: string;
  variantResults: { variantId: string; name: string; score: number; metrics: Record<string, number> }[];
}
