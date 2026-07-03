import { SharedAgentExecutor } from '../executor/agent-executor';
import { AgentExecutionOutput } from '../types';

export class SharedAgentDispatcher {
  static async dispatch(targetAgentId: string, intent: string, input: Record<string, any> = {}): Promise<AgentExecutionOutput> {
    console.log(`[SHARED DISPATCHER] Intent '${intent}' routed to agent '${targetAgentId}'`);

    // In the future: queue the task in Shared Queue (Supabase)

    return SharedAgentExecutor.execute(targetAgentId, {
      intent,
      input,
    });
  }
}
