import { AgentExecutionInput, AgentExecutionOutput } from '../types';
import { SharedAgentRegistry } from '../registry/agent-registry';
import { SharedAIProvider } from '../providers/ai-provider';

export class SharedAgentExecutor {
  static async execute(agentId: string, input: AgentExecutionInput): Promise<AgentExecutionOutput> {
    const agent = SharedAgentRegistry.getAgent(agentId);

    if (!agent) {
      return {
        status: 'failed',
        error: `Agent ${agentId} not found in shared registry.`,
        logs: [`[ERROR] Agent ${agentId} not found.`],
      };
    }

    const logs: string[] = [];
    logs.push(`[SHARED EXECUTOR] Starting execution of ${agent.name} (${agentId})...`);
    logs.push(`[SHARED EXECUTOR] Intent: ${input.intent}`);
    logs.push(`[SHARED EXECUTOR] Simulating AI execution via ${agent.default_provider}...`);

    await SharedAIProvider.executePrompt(agent.default_provider, 'simulated prompt', agent.output_schema);

    logs.push(`[SHARED EXECUTOR] Execution successful.`);

    return {
      status: 'completed',
      data: {
        message: `Simulated successful output from ${agent.name}`,
        simulated_result: true,
        received_input: input.input
      },
      logs,
    };
  }
}
