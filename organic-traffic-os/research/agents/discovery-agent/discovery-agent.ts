import { DiscoveryInput, DiscoveryOutput } from './discovery-agent.types';
import { DiscoveryAgentValidator } from './discovery-agent.validator';
import { DiscoveryService } from './discovery-agent.service';

export class DiscoveryAgent {
  static async run(input: DiscoveryInput): Promise<DiscoveryOutput> {
    const isValid = DiscoveryAgentValidator.validateInput(input);
    if (!isValid) {
      throw new Error('Invalid DiscoveryInput');
    }

    console.log(`[DISCOVERY AGENT] Starting execution for blog ${input.blog_id} (Mode: ${input.mode})`);

    const service = new DiscoveryService();
    return await service.runDiscovery(input);
  }
}
