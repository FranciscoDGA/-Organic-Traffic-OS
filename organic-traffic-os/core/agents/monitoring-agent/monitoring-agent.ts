import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { MonitoringInput, MonitoringAgentOutput } from './monitoring-agent.types';
import { MonitoringAgentService } from './monitoring-agent.service';

export class MonitoringAgent implements BaseAgent {
  id = 'monitoring-agent';
  name = 'Monitoring Agent';
  version = '1.0.0';
  private service = new MonitoringAgentService();

  async execute(task: MonitoringInput, ctx: AgentContext): Promise<AgentResult<MonitoringAgentOutput>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runMonitoring(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: MonitoringInput): boolean {
    return !!task.blog_id && !!task.package && !!task.metrics;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
