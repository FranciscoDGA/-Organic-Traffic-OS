import { DiscoveryInput, DiscoveryOutput } from './discovery-agent.types';

export class DiscoveryAgentValidator {
  static validateInput(input: any): input is DiscoveryInput {
    if (!input || typeof input !== 'object') return false;
    if (typeof input.blog_id !== 'string') return false;
    if (typeof input.topic !== 'string') return false;
    if (!['manual', 'mock', 'pipeline'].includes(input.mode)) return false;
    if (typeof input.limit !== 'number' || input.limit < 1) return false;
    return true;
  }

  static validateOutput(output: any): output is DiscoveryOutput {
    if (!output || typeof output !== 'object') return false;
    if (output.agent !== 'discovery-agent') return false;
    if (!Array.isArray(output.opportunities)) return false;
    return true;
  }
}
