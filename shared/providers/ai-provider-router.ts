import { AiProvider } from '../types';

export class SharedAIProviderRouter {
  static getDefaultProvider(): AiProvider {
    const provider = process.env.DEFAULT_AI_PROVIDER as AiProvider;
    if (['openai', 'anthropic', 'mistral', 'gemini'].includes(provider)) {
      return provider;
    }
    return 'mistral'; // default fallback
  }

  static getProviderConfig(provider: AiProvider) {
    switch (provider) {
      case 'openai':
        return { key: process.env.OPENAI_API_KEY };
      case 'anthropic':
        return { key: process.env.ANTHROPIC_API_KEY };
      case 'mistral':
        return { key: process.env.MISTRAL_API_KEY };
      case 'gemini':
        return { key: process.env.GEMINI_API_KEY };
      default:
        return { key: null };
    }
  }

  static validateProviderConfig(provider: AiProvider): boolean {
    const config = this.getProviderConfig(provider);
    return !!config.key;
  }
}
