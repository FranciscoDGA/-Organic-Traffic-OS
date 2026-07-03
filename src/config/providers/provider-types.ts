export type ProviderCategory = 'AI' | 'Infraestrutura' | 'Analytics' | 'Comunicação' | 'Publishing';

export interface ProviderInfo {
  provider_id: string;
  name: string;
  category: ProviderCategory;
  required_vars: string[];
  optional_vars: string[];
  status: 'active' | 'inactive' | 'setup_pending';
  documentation_link: string;
}

export interface ProviderHealthStatus {
  provider_id: string;
  configured: boolean;
  missing_variables: string[];
  status: 'active' | 'warning' | 'error';
  last_checked: string;
  error_message?: string;
  recommendation?: string;
}
