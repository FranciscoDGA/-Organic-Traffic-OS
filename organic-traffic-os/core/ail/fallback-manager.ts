import { AIProvider } from './ai-intelligence.types';
import { aiProviders } from './ai-providers';

export class FallbackManager {
  getFallbackChain(providerId: string): AIProvider[] {
    const chain: AIProvider[] = [];
    const visited = new Set<string>();
    let current = aiProviders.find(p => p.id === providerId);

    while (current && !visited.has(current.id)) {
      chain.push(current);
      visited.add(current.id);
      current = current.fallbackProviderId ? aiProviders.find(p => p.id === current!.fallbackProviderId) : undefined;
    }

    return chain;
  }

  getNextAvailable(currentProviderId: string): AIProvider | undefined {
    const chain = this.getFallbackChain(currentProviderId);
    return chain.find(p => p.status === 'active' && p.id !== currentProviderId);
  }

  logFallback(from: string, to: string, reason: string): void {
    console.log(`[AIL Fallback] ${from} -> ${to} | Reason: ${reason}`);
  }
}
