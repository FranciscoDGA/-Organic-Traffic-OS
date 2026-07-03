import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { VisibilityInput, VisibilityAgentOutput } from './visibility-agent.types';
import { VisibilityAgentService } from './visibility-agent.service';

export class VisibilityAgent implements BaseAgent {
  id = 'visibility-agent';
  name = 'Visibility Agent';
  version = '1.0.0';
  private service = new VisibilityAgentService();

  async execute(task: VisibilityInput, ctx: AgentContext): Promise<AgentResult<VisibilityAgentOutput>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runVisibility(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: VisibilityInput): boolean {
    return !!task.blog_id && !!task.draft_pack && !!task.review_report && !!task.evidence_pack;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
