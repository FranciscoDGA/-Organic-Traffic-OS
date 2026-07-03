import { ReliabilityReport, ReliabilityScore, ReportPeriod } from './reliability.types';
import { reliabilityEngine } from './reliability-engine';

class ORECService {
  private engine = reliabilityEngine;

  getScore(): ReliabilityScore { return this.engine.calculateScore(); }
  getLatest(): ReliabilityReport | undefined { return this.engine.getLatest(); }
  getAll(): ReliabilityReport[] { return this.engine.getAll(); }
  getReport(id: string): ReliabilityReport | undefined { return this.engine.getReport(id); }
  recalculate(period?: ReportPeriod): ReliabilityReport { return this.engine.generateReport(period); }
}

export const orecService = new ORECService();
