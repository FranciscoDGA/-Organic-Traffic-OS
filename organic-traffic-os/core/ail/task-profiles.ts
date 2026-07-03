import { TaskProfileConfig, TaskProfile } from './ai-intelligence.types';

export const taskProfiles: Record<TaskProfile, TaskProfileConfig> = {
  research: { id: 'research', name: 'Pesquisa', preferredProviderId: 'openai', preferredModelId: 'gpt-4o', fallbackProviderId: 'anthropic', fallbackModelId: 'claude-sonnet-4', maxTokens: 4000, temperature: 0.3 },
  planning: { id: 'planning', name: 'Planejamento', preferredProviderId: 'anthropic', preferredModelId: 'claude-sonnet-4', fallbackProviderId: 'openai', fallbackModelId: 'gpt-4o', maxTokens: 4000, temperature: 0.4 },
  writing: { id: 'writing', name: 'Escrita', preferredProviderId: 'anthropic', preferredModelId: 'claude-opus-4', fallbackProviderId: 'openai', fallbackModelId: 'gpt-4o', maxTokens: 8000, temperature: 0.7 },
  editorial_review: { id: 'editorial_review', name: 'Revisao Editorial', preferredProviderId: 'anthropic', preferredModelId: 'claude-sonnet-4', fallbackProviderId: 'openai', fallbackModelId: 'gpt-4o', maxTokens: 4000, temperature: 0.3 },
  qa: { id: 'qa', name: 'QA', preferredProviderId: 'openai', preferredModelId: 'gpt-4o', fallbackProviderId: 'anthropic', fallbackModelId: 'claude-sonnet-4', maxTokens: 3000, temperature: 0.2 },
  seo: { id: 'seo', name: 'SEO', preferredProviderId: 'openai', preferredModelId: 'gpt-4o', fallbackProviderId: 'gemini', fallbackModelId: 'gemini-2.5-pro', maxTokens: 4000, temperature: 0.3 },
  ai_visibility: { id: 'ai_visibility', name: 'AI Visibility', preferredProviderId: 'anthropic', preferredModelId: 'claude-sonnet-4', fallbackProviderId: 'openai', fallbackModelId: 'gpt-4o', maxTokens: 3000, temperature: 0.2 },
  title_generation: { id: 'title_generation', name: 'Geracao de Titulos', preferredProviderId: 'openai', preferredModelId: 'gpt-4o-mini', fallbackProviderId: 'gemini', fallbackModelId: 'gemini-2.5-flash', maxTokens: 1000, temperature: 0.8 },
  faq_generation: { id: 'faq_generation', name: 'Geracao de FAQ', preferredProviderId: 'openai', preferredModelId: 'gpt-4o', fallbackProviderId: 'anthropic', fallbackModelId: 'claude-sonnet-4', maxTokens: 4000, temperature: 0.4 },
  schema_generation: { id: 'schema_generation', name: 'Geracao de Schema', preferredProviderId: 'openai', preferredModelId: 'gpt-4o-mini', fallbackProviderId: 'gemini', fallbackModelId: 'gemini-2.5-flash', maxTokens: 2000, temperature: 0.1 },
  data_analysis: { id: 'data_analysis', name: 'Analise de Dados', preferredProviderId: 'openai', preferredModelId: 'gpt-4o', fallbackProviderId: 'gemini', fallbackModelId: 'gemini-2.5-pro', maxTokens: 4000, temperature: 0.2 },
  executive_summary: { id: 'executive_summary', name: 'Resumo Executivo', preferredProviderId: 'anthropic', preferredModelId: 'claude-sonnet-4', fallbackProviderId: 'openai', fallbackModelId: 'gpt-4o', maxTokens: 3000, temperature: 0.3 },
};
