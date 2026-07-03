export interface AgentManifest {
  id: string;
  name: string;
  category: string;
  version: string;
  default_provider: string;
  capabilities: string[];
  input_schema: Record<string, any>;
  output_schema: Record<string, any>;
  dependencies: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  timeout_ms: number;
}
