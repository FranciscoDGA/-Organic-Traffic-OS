import { ProviderInfo } from './provider-types';

export const PROVIDER_REGISTRY: ProviderInfo[] = [
  // === AI ===
  {
    provider_id: 'openai',
    name: 'OpenAI',
    category: 'AI',
    required_vars: ['OPENAI_API_KEY'],
    optional_vars: [],
    status: 'active',
    documentation_link: '/docs/providers/AI_PROVIDERS_GUIDE.md',
  },
  {
    provider_id: 'anthropic',
    name: 'Anthropic',
    category: 'AI',
    required_vars: ['ANTHROPIC_API_KEY'],
    optional_vars: [],
    status: 'active',
    documentation_link: '/docs/providers/AI_PROVIDERS_GUIDE.md',
  },
  {
    provider_id: 'gemini',
    name: 'Google Gemini',
    category: 'AI',
    required_vars: ['GEMINI_API_KEY'],
    optional_vars: ['GOOGLE_API_KEY'],
    status: 'active',
    documentation_link: '/docs/providers/AI_PROVIDERS_GUIDE.md',
  },

  // === Infraestrutura ===
  {
    provider_id: 'github',
    name: 'GitHub',
    category: 'Infraestrutura',
    required_vars: ['GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'],
    optional_vars: ['GITHUB_DEFAULT_BRANCH'],
    status: 'active',
    documentation_link: '/docs/providers/GITHUB_VERCEL_SETUP.md',
  },
  {
    provider_id: 'vercel',
    name: 'Vercel',
    category: 'Infraestrutura',
    required_vars: ['VERCEL_TOKEN', 'VERCEL_PROJECT_ID'],
    optional_vars: ['VERCEL_TEAM_ID'],
    status: 'active',
    documentation_link: '/docs/providers/GITHUB_VERCEL_SETUP.md',
  },
  {
    provider_id: 'supabase',
    name: 'Supabase',
    category: 'Infraestrutura',
    required_vars: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'DATABASE_URL'],
    optional_vars: ['SUPABASE_PROJECT_REF'],
    status: 'active',
    documentation_link: '/docs/database/SUPABASE_DATABASE_SETUP.md',
  },

  // === Analytics ===
  {
    provider_id: 'google-analytics-4',
    name: 'Google Analytics 4',
    category: 'Analytics',
    required_vars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_ANALYTICS_PROPERTY_ID'],
    optional_vars: [],
    status: 'active',
    documentation_link: '/docs/providers/GOOGLE_SETUP_GUIDE.md',
  },
  {
    provider_id: 'google-search-console',
    name: 'Google Search Console',
    category: 'Analytics',
    required_vars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'GOOGLE_SEARCH_CONSOLE_SITE_URL'],
    optional_vars: [],
    status: 'active',
    documentation_link: '/docs/providers/GOOGLE_SETUP_GUIDE.md',
  },

  // === Comunicação ===
  {
    provider_id: 'resend',
    name: 'Resend',
    category: 'Comunicação',
    required_vars: ['RESEND_API_KEY'],
    optional_vars: ['SMTP_FROM'],
    status: 'active',
    documentation_link: '/docs/providers/EMAIL_PROVIDER_GUIDE.md',
  },
  {
    provider_id: 'smtp',
    name: 'SMTP Email Server',
    category: 'Comunicação',
    required_vars: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'],
    optional_vars: [],
    status: 'inactive',
    documentation_link: '/docs/providers/EMAIL_PROVIDER_GUIDE.md',
  },

  // === Publishing ===
  {
    provider_id: 'organic-bridge',
    name: 'Organic Bridge (Blogs)',
    category: 'Publishing',
    required_vars: ['ORGANIC_BRIDGE_SECRET'],
    optional_vars: [],
    status: 'active',
    documentation_link: '/ORGANIC_BRIDGE_SETUP.md',
  },
  {
    provider_id: 'revalidate',
    name: 'Next.js Revalidate Service',
    category: 'Publishing',
    required_vars: ['REVALIDATE_SECRET'],
    optional_vars: [],
    status: 'active',
    documentation_link: '/ORGANIC_BRIDGE_SETUP.md',
  }
];

export function getProviderById(id: string): ProviderInfo | undefined {
  return PROVIDER_REGISTRY.find(p => p.provider_id === id);
}

export function getProvidersByCategory(category: ProviderInfo['category']): ProviderInfo[] {
  return PROVIDER_REGISTRY.filter(p => p.category === category);
}
