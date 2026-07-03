export { getPortfolioService } from './portfolio.service';
export { calculateWorkspaceScore, calculatePortfolioScore } from './portfolio-score';
export { compareWorkspaces } from './portfolio-comparator';
export { generateRecommendations } from './portfolio-recommendation';
export { getWorkspaceMetrics } from './portfolio-manager';
export { validatePortfolioReport } from './portfolio-validator';
export type { PortfolioReport, WorkspaceScore, PortfolioScore, WorkspaceMetrics, CapacityReport, PortfolioRecommendation } from './portfolio.types';
