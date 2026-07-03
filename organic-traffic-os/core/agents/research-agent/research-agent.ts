import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { ResearchInput, ResearchReport } from './research-agent.types';
import { ResearchAgentService } from './research-agent.service';

export class ResearchAgent implements BaseAgent {
  id = 'research-agent';
  name = 'Research Agent';
  version = '1.0.0';
  private service = new ResearchAgentService();

  async execute(task: ResearchInput, ctx: AgentContext): Promise<AgentResult<ResearchReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runResearch(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: ResearchInput): boolean {
    return !!task.blog_id && !!task.backlog_item;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
