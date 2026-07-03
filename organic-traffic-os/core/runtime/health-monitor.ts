import { HealthScore, HealthCategory, QueueName } from './runtime.types';
import { eventBus } from './event-bus';
import { moduleRegistry } from './module-registry';
import { queueManager } from './queue-manager';

export class HealthMonitor {
  private intervalMs: number;
  private timer: ReturnType<typeof setInterval> | null = null;
  private scores: Map<HealthCategory, HealthScore> = new Map();
  private history: HealthScore[] = [];
  private maxHistory = 100;

  constructor(intervalMs: number) {
    this.intervalMs = intervalMs;
  }

  start(): void {
    if (this.timer) return;
    this.check();
    this.timer = setInterval(() => this.check(), this.intervalMs);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  check(): HealthScore[] {
    const results: HealthScore[] = [
      this.checkRuntime(),
      this.checkQueues(),
      this.checkModules('connectors'),
      this.checkModules('engines'),
      this.checkModules('agents'),
      this.checkOverall(),
    ];
    for (const score of results) {
      this.scores.set(score.category, score);
      this.history.unshift(score);
    }
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
    eventBus.emit('HealthChanged', 'health-monitor', {
      overall: this.scores.get('overall')?.score || 0,
      status: this.scores.get('overall')?.status || 'critical',
    });
    return results;
  }

  getScore(category: HealthCategory): HealthScore | undefined {
    return this.scores.get(category);
  }

  getAllScores(): HealthScore[] {
    return Array.from(this.scores.values());
  }

  getHistory(limit = 20): HealthScore[] {
    return this.history.slice(0, limit);
  }

  isRunning(): boolean {
    return this.timer !== null;
  }

  private checkRuntime(): HealthScore {
    const score: HealthScore = {
      category: 'runtime',
      score: 100,
      status: 'healthy',
      details: { uptime: Date.now() },
      lastChecked: new Date().toISOString(),
    };
    this.scores.set('runtime', score);
    return score;
  }

  private checkQueues(): HealthScore {
    const sizes = queueManager.getAllQueueSizes();
    let totalItems = 0;
    let maxExceeded = false;
    for (const name of Object.keys(sizes) as QueueName[]) {
      totalItems += sizes[name];
      const queue = queueManager.getQueue(name);
      if (queue && sizes[name] >= queue.maxSize * 0.9) maxExceeded = true;
    }
    const score = maxExceeded ? 50 : totalItems > 50 ? 75 : 100;
    const healthScore: HealthScore = {
      category: 'queues',
      score,
      status: score >= 90 ? 'healthy' : score >= 60 ? 'degraded' : 'critical',
      details: { sizes, totalItems },
      lastChecked: new Date().toISOString(),
    };
    this.scores.set('queues', healthScore);
    return healthScore;
  }

  private checkModules(type: string): HealthScore {
    const allModules = moduleRegistry.getAll();
    const typeModules = allModules.filter(m => {
      if (type === 'connectors') return m.type === 'connector';
      if (type === 'engines') return m.type === 'engine';
      if (type === 'agents') return m.type === 'agent';
      return false;
    });
    const active = typeModules.filter(m => m.status === 'active' || m.status === 'loaded').length;
    const total = typeModules.length;
    const score = total === 0 ? 100 : Math.round((active / total) * 100);
    const category = (type === 'connectors' ? 'connectors' : type === 'engines' ? 'engines' : 'agents') as HealthCategory;
    const healthScore: HealthScore = {
      category,
      score,
      status: score >= 90 ? 'healthy' : score >= 60 ? 'degraded' : 'critical',
      details: { active, total, modules: typeModules.map(m => ({ id: m.id, status: m.status })) },
      lastChecked: new Date().toISOString(),
    };
    this.scores.set(category, healthScore);
    return healthScore;
  }

  private checkOverall(): HealthScore {
    const allScores = Array.from(this.scores.values()).filter(s => s.category !== 'overall');
    const avgScore = allScores.length > 0 ? Math.round(allScores.reduce((sum, s) => sum + s.score, 0) / allScores.length) : 100;
    const healthScore: HealthScore = {
      category: 'overall',
      score: avgScore,
      status: avgScore >= 90 ? 'healthy' : avgScore >= 60 ? 'degraded' : 'critical',
      details: { breakdown: allScores.map(s => ({ category: s.category, score: s.score })) },
      lastChecked: new Date().toISOString(),
    };
    this.scores.set('overall', healthScore);
    return healthScore;
  }
}
