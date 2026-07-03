import { GoLiveReport } from './go-live.types';
import { goLiveEngine } from './go-live-engine';

class PRGCService {
  private engine = goLiveEngine;

  validate(): GoLiveReport { return this.engine.validate(); }
  getLatest(): GoLiveReport | undefined { return this.engine.getLatest(); }
  getAll(): GoLiveReport[] { return this.engine.getAllReports(); }
  getReport(id: string): GoLiveReport | undefined { return this.engine.getReport(id); }
  revalidate(): GoLiveReport { return this.engine.validate(); }

  getReadiness() {
    const latest = this.engine.getLatest();
    if (!latest) return { status: 'pending', score: 0, level: 'not_ready' };
    return { status: latest.authorized ? 'authorized' : 'pending', score: latest.overallScore.overall, level: latest.overallScore.level };
  }
}

export const prgcService = new PRGCService();
