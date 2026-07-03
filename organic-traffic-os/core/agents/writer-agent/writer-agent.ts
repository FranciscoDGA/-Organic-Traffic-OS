import { BaseAgent } from '../base-agent';
import { AgentContext } from '../agent-context';
import { AgentResult } from '../agent-result';
import { WriterInput, WriterReport } from './writer-agent.types';
import { WriterAgentService } from './writer-agent.service';

export class WriterAgent implements BaseAgent {
  id = 'writer-agent';
  name = 'Writer Agent';
  version = '1.0.0';
  private service = new WriterAgentService();

  async execute(task: WriterInput, ctx: AgentContext): Promise<AgentResult<WriterReport>> {
    const startedAt = Date.now();
    try {
      const report = await this.service.runWriterDraft(task);
      return { success: true, data: report, durationMs: Date.now() - startedAt };
    } catch (e: any) {
      return { success: false, error: e, durationMs: Date.now() - startedAt };
    }
  }

  validate(task: WriterInput): boolean {
    return !!task.blog_id && !!task.research_pack && !!task.evidence_pack;
  }

  report(): any {
    return { agent: this.id, version: this.version, status: 'active' };
  }
}
