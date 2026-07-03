export type AgentCategory = 
  | 'traffic'
  | 'discovery'
  | 'intelligence'
  | 'planning'
  | 'execution'
  | 'review'
  | 'seo'
  | 'sales'
  | 'finance'
  | 'automation';

export interface AgentExecutionInput {
  blog_id?: string;
  intent: string;
  input: Record<string, any>;
}

export interface AgentExecutionOutput {
  status: AgentRunStatus;
  data?: Record<string, any>;
  error?: string;
  logs: string[];
}

export type AgentRunStatus = 'pending' | 'running' | 'completed' | 'failed';

export type AgentPriority = 'low' | 'medium' | 'high' | 'critical';

// --- DB TYPES (Sprint 01.5) ---

export interface Blog {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  niche?: string;
  audience?: string;
  main_goal?: string;
  monetization?: string;
  tone_of_voice?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrganicKeyword {
  id: string;
  blog_id: string;
  keyword: string;
  search_intent?: string;
  estimated_volume?: number;
  estimated_difficulty?: string;
  monetization_potential?: string;
  priority?: string;
  cluster?: string;
  source?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentIdea {
  id: string;
  blog_id: string;
  keyword_id?: string;
  title: string;
  content_type?: string;
  cluster?: string;
  priority?: string;
  status: string;
  suggested_date?: string;
  cta?: string;
  related_product?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SeoBrief {
  id: string;
  blog_id: string;
  content_idea_id: string;
  title: string;
  primary_keyword?: string;
  secondary_keywords?: any;
  search_intent?: string;
  outline?: any;
  faq?: any;
  internal_links?: any;
  external_references?: any;
  cta?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AgentTask {
  id: string;
  blog_id: string;
  agent_name: string;
  task_type: string;
  input?: any;
  output?: any;
  status: string;
  error_message?: string;
  started_at?: string;
  finished_at?: string;
  created_at: string;
}

export interface AgentLog {
  id: string;
  task_id: string;
  agent_name?: string;
  level: string;
  message: string;
  metadata?: any;
  created_at: string;
}

export interface AiUsageLog {
  id: string;
  task_id: string;
  provider?: string;
  model?: string;
  input_tokens?: number;
  output_tokens?: number;
  estimated_cost?: number;
  created_at: string;
}

export type AiProvider = 'openai' | 'anthropic' | 'mistral' | 'gemini';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

