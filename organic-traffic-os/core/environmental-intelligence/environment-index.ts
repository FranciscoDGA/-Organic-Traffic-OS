export { getEnvironmentService } from './environment.service';
export { monitorEnvironment, getEventById } from './environment-monitor';
export { detectChanges } from './change-detector';
export { analyzeImpact } from './impact-analyzer';
export { correlateTrends } from './trend-correlator';
export { validateEnvironmentReport } from './environment-validator';
export type { EnvironmentalEvent, TrendData, EnvironmentalReport, EventType, AlertLevel, EventStatus } from './environment.types';
