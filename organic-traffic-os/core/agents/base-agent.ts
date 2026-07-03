import { AgentContext } from './agent-context';
import { AgentResult } from './agent-result';

export interface BaseAgent {
  id: string;
  name: string;
  version: string;
  execute(task: any, ctx: AgentContext): Promise<AgentResult<any>>;
  validate(task: any): boolean;
  report(): any;
}
