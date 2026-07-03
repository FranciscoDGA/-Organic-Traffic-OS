import { ProviderConfig, ProviderName } from './execution.types';

const providers: ProviderConfig[] = [
  { name: 'openai', available: true, costPerInputToken: 0.000015, costPerOutputToken: 0.00006, models: [
    { name: 'gpt-4o', provider: 'openai', maxTokens: 128000, quality: 95, speed: 85, costTier: 'high' },
    { name: 'gpt-4o-mini', provider: 'openai', maxTokens: 128000, quality: 80, speed: 95, costTier: 'low' },
    { name: 'gpt-4-turbo', provider: 'openai', maxTokens: 128000, quality: 92, speed: 80, costTier: 'high' },
  ]},
  { name: 'anthropic', available: true, costPerInputToken: 0.000015, costPerOutputToken: 0.000075, models: [
    { name: 'claude-sonnet-4-20250514', provider: 'anthropic', maxTokens: 200000, quality: 94, speed: 82, costTier: 'high' },
    { name: 'claude-3-5-haiku-20241022', provider: 'anthropic', maxTokens: 200000, quality: 82, speed: 92, costTier: 'low' },
  ]},
  { name: 'mistral', available: true, costPerInputToken: 0.000008, costPerOutputToken: 0.000024, models: [
    { name: 'mistral-large', provider: 'mistral', maxTokens: 128000, quality: 88, speed: 88, costTier: 'medium' },
    { name: 'mistral-small', provider: 'mistral', maxTokens: 32000, quality: 75, speed: 95, costTier: 'low' },
  ]},
  { name: 'google', available: true, costPerInputToken: 0.0000075, costPerOutputToken: 0.00003, models: [
    { name: 'gemini-2.5-pro', provider: 'google', maxTokens: 1000000, quality: 93, speed: 87, costTier: 'medium' },
    { name: 'gemini-2.0-flash', provider: 'google', maxTokens: 1000000, quality: 80, speed: 96, costTier: 'low' },
  ]},
  { name: 'openrouter', available: true, costPerInputToken: 0.00001, costPerOutputToken: 0.00003, models: [
    { name: 'auto', provider: 'openrouter', maxTokens: 200000, quality: 85, speed: 90, costTier: 'medium' },
  ]},
];

export function getProviders(): ProviderConfig[] {
  return providers;
}

export function getAvailableProviders(): ProviderConfig[] {
  return providers.filter(p => p.available);
}

export function getProvider(name: ProviderName): ProviderConfig | undefined {
  return providers.find(p => p.name === name);
}
