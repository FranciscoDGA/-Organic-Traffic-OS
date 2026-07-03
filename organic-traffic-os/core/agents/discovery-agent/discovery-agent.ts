import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { DiscoveryInput, DiscoveryReport } from './discovery-agent.types';
import { DiscoveryAgentService } from './discovery-agent.service';

export class DiscoveryAgent implements BaseAgent {
  id = 'discovery-agent';
  name = 'Discovery Agent';
  version = '1.0.0';

  private service = new DiscoveryAgentService();

  async execute(task: DiscoveryInput, ctx: AgentContext): Promise<AgentResult<DiscoveryReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runDiscovery(task);
      return {
        success: true,
        data: report,
        durationMs: Date.now() - startedAt
      };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: DiscoveryInput): boolean {
    return !!task.blog_id && !!task.topic;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
