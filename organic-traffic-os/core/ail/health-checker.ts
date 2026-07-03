import { ProviderHealth } from './ai-intelligence.types';
import { aiProviders } from './ai-providers';

class HealthChecker {
  private health: Map<string, ProviderHealth> = new Map();

  constructor() {
    for (const provider of aiProviders) {
      this.health.set(provider.id, {
        providerId: provider.id,
        available: provider.status === 'active',
        latencyMs: 0,
        remainingRequests: provider.requestLimit,
        remainingTokens: provider.tokenLimit,
        recentFailures: 0,
        lastChecked: new Date().toISOString(),
      });
    }
  }

  check(providerId: string): ProviderHealth {
    const existing = this.health.get(providerId);
    if (existing) return { ...existing };
    return { providerId, available: false, latencyMs: 0, remainingRequests: 0, remainingTokens: 0, recentFailures: 0, lastChecked: new Date().toISOString() };
  }

  checkAll(): ProviderHealth[] {
    return Array.from(this.health.values());
  }

  recordSuccess(providerId: string, latencyMs: number): void {
    const h = this.health.get(providerId);
    if (h) {
      h.latencyMs = latencyMs;
      h.recentFailures = Math.max(0, h.recentFailures - 1);
      h.lastChecked = new Date().toISOString();
    }
  }

  recordFailure(providerId: string): void {
    const h = this.health.get(providerId);
    if (h) {
      h.recentFailures++;
      h.lastChecked = new Date().toISOString();
      if (h.recentFailures >= 5) h.available = false;
    }
  }

  getAvailable(): string[] {
    return Array.from(this.health.values()).filter(h => h.available).map(h => h.providerId);
  }
}

export const healthChecker = new HealthChecker();
