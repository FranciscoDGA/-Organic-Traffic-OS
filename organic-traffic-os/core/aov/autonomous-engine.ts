import { SimulationResult, SimulationConfig, DayResult, AutonomousReport } from './autonomous.types';
import { defaultConfig } from './simulation-config';
import { simulateDay } from './simulation-engine';

let simCounter = 0;

function generateDate(day: number): string {
  const base = new Date('2026-07-03');
  base.setDate(base.getDate() + day);
  return base.toISOString().split('T')[0];
}

export class AutonomousEngine {
  private simulations: Map<string, SimulationResult> = new Map();

  runSimulation(config?: Partial<SimulationConfig>): SimulationResult {
    const cfg = { ...defaultConfig, ...config };
    const id = `sim-${Date.now()}-${++simCounter}`;
    const days: DayResult[] = [];

    for (let i = 0; i < cfg.totalDays; i++) {
      days.push(simulateDay(i + 1, generateDate(i), cfg.workspaces));
    }

    const totalMissions = days.reduce((s, d) => s + d.missionsGenerated, 0);
    const totalCompleted = days.reduce((s, d) => s + d.missionsCompleted, 0);
    const totalFailed = days.reduce((s, d) => s + d.missionsFailed, 0);
    const totalTokens = days.reduce((s, d) => s + d.tokensUsed, 0);
    const totalCost = days.reduce((s, d) => s + d.costIncurred, 0);
    const totalErrors = days.reduce((s, d) => s + d.errors, 0);
    const totalRetries = days.reduce((s, d) => s + d.retries, 0);
    const totalPublications = days.reduce((s, d) => s + d.publicationsSimulated, 0);
    const avgDayDuration = Math.round(days.reduce((s, d) => s + d.durationMs, 0) / days.length);
    const completedDays = days.filter(d => d.status === 'completed').length;

    const result: SimulationResult = {
      id, config: cfg, status: 'completed', days,
      startedAt: new Date().toISOString(), completedAt: new Date().toISOString(),
      totalDaysCompleted: completedDays, totalMissions, totalCompleted, totalFailed,
      totalPublications, totalTokens, totalCost: parseFloat(totalCost.toFixed(4)),
      totalErrors, totalRetries, avgDayDurationMs: avgDayDuration,
      availability: parseFloat(((completedDays / cfg.totalDays) * 100).toFixed(1)),
      reliability: parseFloat(((totalCompleted / Math.max(1, totalMissions)) * 100).toFixed(1)),
    };
    this.simulations.set(id, result);
    return result;
  }

  getSimulation(id: string): SimulationResult | undefined { return this.simulations.get(id); }
  getAllSimulations(): SimulationResult[] { return Array.from(this.simulations.values()); }
  getLatest(): SimulationResult | undefined { return Array.from(this.simulations.values()).pop(); }

  generateReport(sim: SimulationResult): AutonomousReport {
    return {
      simulationId: sim.id, status: sim.status, totalDays: sim.config.totalDays,
      availability: sim.availability, reliability: sim.reliability,
      performance: { avgDayMs: sim.avgDayDurationMs, totalMissions: sim.totalMissions, completionRate: `${sim.reliability}%` },
      consumption: { totalTokens: sim.totalTokens, totalCost: sim.totalCost, avgCostPerDay: parseFloat((sim.totalCost / sim.config.totalDays).toFixed(4)) },
      problems: sim.totalErrors > 0 ? [`${sim.totalErrors} erros encontrados em ${sim.totalDaysCompleted} dias`] : ['Nenhum problema detectado'],
      suggestions: ['Sistema operando dentro dos parametros', 'Manter monitoramento continuo', 'Considerar ativacao em Producao apos validacao'],
      criticalModules: [],
      generatedAt: new Date().toISOString(),
    };
  }
}

export const autonomousEngine = new AutonomousEngine();
