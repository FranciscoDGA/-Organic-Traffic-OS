import { env, EnvConfig } from './env';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEnv(environment: string = env.APP.APP_ENV): ValidationResult {
  const errors: string[] = [];

  // 1. Regras básicas comuns para todos os ambientes (inclusive Development)
  if (!env.APP.NEXT_PUBLIC_APP_NAME) {
    errors.push('NEXT_PUBLIC_APP_NAME é obrigatório em todos os ambientes.');
  }

  // 2. Validação para Staging
  if (environment === 'staging' || environment === 'production') {
    // Exigir Supabase
    if (!env.SUPABASE.NEXT_PUBLIC_SUPABASE_URL) errors.push('Supabase URL é obrigatória em Staging/Production (NEXT_PUBLIC_SUPABASE_URL).');
    if (!env.SUPABASE.NEXT_PUBLIC_SUPABASE_ANON_KEY) errors.push('Supabase Anon Key é obrigatória em Staging/Production (NEXT_PUBLIC_SUPABASE_ANON_KEY).');
    if (!env.SUPABASE.SUPABASE_SERVICE_ROLE_KEY) errors.push('Supabase Service Role Key é obrigatória em Staging/Production (SUPABASE_SERVICE_ROLE_KEY).');
    if (!env.SUPABASE.DATABASE_URL) errors.push('Database Connection URL é obrigatória em Staging/Production (DATABASE_URL).');

    // Exigir App URL
    if (!env.APP.NEXT_PUBLIC_APP_URL || env.APP.NEXT_PUBLIC_APP_URL.includes('localhost')) {
      errors.push('NEXT_PUBLIC_APP_URL não pode ser localhost em Staging/Production.');
    }

    // Exigir Secrets internos de publicação
    if (!env.PUBLISHER.PUBLISH_SECRET) errors.push('PUBLISH_SECRET é obrigatório em Staging/Production.');
    if (!env.PUBLISHER.ORGANIC_BRIDGE_SECRET) errors.push('ORGANIC_BRIDGE_SECRET é obrigatório em Staging/Production.');
    if (!env.PUBLISHER.REVALIDATE_SECRET) errors.push('REVALIDATE_SECRET é obrigatório em Staging/Production.');

    // Exigir JWT & Session Secrets
    if (env.AUTH.JWT_SECRET === 'fallback-jwt-secret-key-12345') {
      errors.push('JWT_SECRET não pode usar valor de fallback em Staging/Production.');
    }
    if (env.AUTH.SESSION_SECRET === 'fallback-session-secret-key-12345') {
      errors.push('SESSION_SECRET não pode usar valor de fallback em Staging/Production.');
    }
  }

  // 3. Validação estrita para Production
  if (environment === 'production') {
    // Exigir AI Keys
    if (!env.AI_PROVIDERS.OPENAI_API_KEY && !env.AI_PROVIDERS.GEMINI_API_KEY && !env.AI_PROVIDERS.GOOGLE_API_KEY) {
      errors.push('Production exige pelo menos uma chave de provedor de IA ativa (OPENAI_API_KEY ou GEMINI_API_KEY/GOOGLE_API_KEY).');
    }

    // Exigir GitHub e Vercel Integration
    if (!env.GITHUB.GITHUB_TOKEN) errors.push('GITHUB_TOKEN é obrigatório em Production.');
    if (!env.VERCEL.VERCEL_TOKEN) errors.push('VERCEL_TOKEN é obrigatório em Production.');

    // Exigir credenciais de e-mail (SMTP ou Resend)
    if (!env.EMAIL.RESEND_API_KEY && !env.EMAIL.SMTP_PASSWORD) {
      errors.push('Production exige credenciais de e-mail válidas (RESEND_API_KEY ou SMTP_PASSWORD).');
    }

    // Exigir chaves dos blogs para Organic Bridge
    if (!env.BLOGS.PASSACUMARU.endpoint || !env.BLOGS.PASSACUMARU.secret) {
      errors.push('Endereço e chave de publicação do blog PassaCumaru são obrigatórios em Production.');
    }
    if (!env.BLOGS.QUALOSEGURO.endpoint || !env.BLOGS.QUALOSEGURO.secret) {
      errors.push('Endereço e chave de publicação do blog QualOSeguro são obrigatórios em Production.');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
