import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { FactInput, FactReport } from './fact-agent.types';
import { FactAgentService } from './fact-agent.service';

export class FactAgent implements BaseAgent {
  id = 'fact-agent';
  name = 'Fact Agent';
  version = '1.0.0';
  private service = new FactAgentService();

  async execute(task: FactInput, ctx: AgentContext): Promise<AgentResult<FactReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runFactValidation(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: FactInput): boolean {
    return !!task.blog_id && !!task.research_pack;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
