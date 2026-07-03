import { SimulationResult, SimulationConfig, AutonomousReport } from './autonomous.types';
import { autonomousEngine } from './autonomous-engine';

class AOVService {
  private engine = autonomousEngine;
  private running = false;

  start(config?: Partial<SimulationConfig>): SimulationResult {
    this.running = true;
    const result = this.engine.runSimulation(config);
    this.running = false;
    return result;
  }

  stop(): boolean { this.running = false; return true; }
  reset(): boolean { this.running = false; return true; }
  isRunning(): boolean { return this.running; }
  getLatest(): SimulationResult | undefined { return this.engine.getLatest(); }
  getAll(): SimulationResult[] { return this.engine.getAllSimulations(); }
  getSimulation(id: string): SimulationResult | undefined { return this.engine.getSimulation(id); }
  getReport(id: string): AutonomousReport | undefined {
    const sim = this.engine.getSimulation(id);
    return sim ? this.engine.generateReport(sim) : undefined;
  }

  getHealth() {
    const latest = this.engine.getLatest();
    if (!latest) return { status: 'idle', availability: 0, reliability: 0 };
    return { status: latest.status, availability: latest.availability, reliability: latest.reliability, totalSimulations: this.engine.getAllSimulations().length };
  }
}

export const aovService = new AOVService();
