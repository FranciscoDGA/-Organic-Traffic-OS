import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { PublishingInput, PublishingAgentOutput } from './publishing-agent.types';
import { PublishingAgentService } from './publishing-agent.service';

export class PublishingAgent implements BaseAgent {
  id = 'publishing-agent';
  name = 'Publishing Agent';
  version = '1.0.0';
  private service = new PublishingAgentService();

  async execute(task: PublishingInput, ctx: AgentContext): Promise<AgentResult<PublishingAgentOutput>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runPublishing(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: PublishingInput): boolean {
    return !!task.blog_id && !!task.optimized_draft && !!task.visibility_report;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
