import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { ReviewInput, ReviewAgentOutput } from './review-agent.types';
import { ReviewAgentService } from './review-agent.service';

export class ReviewAgent implements BaseAgent {
  id = 'review-agent';
  name = 'Review Agent';
  version = '1.0.0';
  private service = new ReviewAgentService();

  async execute(task: ReviewInput, ctx: AgentContext): Promise<AgentResult<ReviewAgentOutput>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runReview(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: ReviewInput): boolean {
    return !!task.blog_id && !!task.draft_pack && !!task.research_pack && !!task.evidence_pack;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
