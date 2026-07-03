import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { PlanningInput, PlanningReport } from './planning-agent.types';
import { PlanningAgentService } from './planning-agent.service';

export class PlanningAgent implements BaseAgent {
  id = 'planning-agent';
  name = 'Planning Agent';
  version = '1.0.0';
  private service = new PlanningAgentService();

  async execute(task: PlanningInput, ctx: AgentContext): Promise<AgentResult<PlanningReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runPlanning(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: PlanningInput): boolean {
    return !!task.blog_id && !!task.discovery_report;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
