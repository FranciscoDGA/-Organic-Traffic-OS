import { AIProvider } from './ai-intelligence.types';

export const aiProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    status: 'active',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000, inputCostPer1k: 0.005, outputCostPer1k: 0.015, supportsStreaming: true },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', maxTokens: 128000, inputCostPer1k: 0.00015, outputCostPer1k: 0.0006, supportsStreaming: true },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000, inputCostPer1k: 0.01, outputCostPer1k: 0.03, supportsStreaming: true },
      { id: 'o1', name: 'o1', maxTokens: 200000, inputCostPer1k: 0.015, outputCostPer1k: 0.06, supportsStreaming: false },
    ],
    requestLimit: 10000,
    tokenLimit: 1000000,
    timeout: 60000,
    priority: 1,
    fallbackProviderId: 'anthropic',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    status: 'active',
    models: [
      { id: 'claude-opus-4', name: 'Claude Opus 4', maxTokens: 200000, inputCostPer1k: 0.015, outputCostPer1k: 0.075, supportsStreaming: true },
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', maxTokens: 200000, inputCostPer1k: 0.003, outputCostPer1k: 0.015, supportsStreaming: true },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', maxTokens: 200000, inputCostPer1k: 0.0008, outputCostPer1k: 0.004, supportsStreaming: true },
    ],
    requestLimit: 8000,
    tokenLimit: 800000,
    timeout: 60000,
    priority: 2,
    fallbackProviderId: 'gemini',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    status: 'active',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', maxTokens: 1000000, inputCostPer1k: 0.00125, outputCostPer1k: 0.01, supportsStreaming: true },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', maxTokens: 1000000, inputCostPer1k: 0.000075, outputCostPer1k: 0.0003, supportsStreaming: true },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', maxTokens: 1000000, inputCostPer1k: 0.0001, outputCostPer1k: 0.0004, supportsStreaming: true },
    ],
    requestLimit: 15000,
    tokenLimit: 2000000,
    timeout: 60000,
    priority: 3,
    fallbackProviderId: 'openai',
    apiKeyEnv: 'GOOGLE_AI_API_KEY',
  },
];
