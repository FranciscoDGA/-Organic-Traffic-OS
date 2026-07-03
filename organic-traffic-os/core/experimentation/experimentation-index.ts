export { getExperimentService } from './experimentation.engine';
export { createExperiment, createVariant } from './experiment-manager';
export { analyzeExperiment, simulateMetrics } from './experiment-runner';
export { validateExperiment } from './experiment-validator';
export type { Experiment, ExperimentVariant, ExperimentAnalysis, ExperimentType, ExperimentStatus, MetricName } from './experimentation.types';
