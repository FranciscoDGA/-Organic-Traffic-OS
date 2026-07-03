import { ExecutionContext } from './orchestrator.types';

export function createExecutionContext(params: {
  blog_id?: string;
  channel?: string;
  user_id?: string;
  content_id?: string;
  workflow_id: string;
  config?: Record<string, any>;
  ai_provider?: string;
  language?: string;
}): ExecutionContext {
  return {
    blog_id: params.blog_id || 'default-blog',
    channel: params.channel || 'organic-os',
    user_id: params.user_id || 'system',
    content_id: params.content_id,
    workflow_id: params.workflow_id,
    config: params.config || {},
    ai_provider: params.ai_provider || 'openai',
    language: params.language || 'pt-BR',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  };
}
