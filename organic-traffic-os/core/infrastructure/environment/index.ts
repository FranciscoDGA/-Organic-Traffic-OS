export interface EnvironmentConfig {
  name: string;
  domain: string;
  vercelProject: string;
  supabaseProject: string;
  databaseUrl: string;
  storageUrl: string;
  apiUrl: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  metricsEnabled: boolean;
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

export type Environment = 'development' | 'staging' | 'production';

export const environments: Record<Environment, EnvironmentConfig> = {
  development: {
    name: 'Development',
    domain: 'dev.organic.aiagencyos.com.br',
    vercelProject: 'organic-traffic-os-dev',
    supabaseProject: 'organic-traffic-os-dev',
    databaseUrl: process.env.DEV_SUPABASE_URL || '',
    storageUrl: process.env.DEV_SUPABASE_STORAGE_URL || '',
    apiUrl: 'http://localhost:3000',
    logLevel: 'debug',
    metricsEnabled: true,
    corsOrigins: ['http://localhost:3000', 'http://localhost:3001'],
    rateLimitWindowMs: 60000,
    rateLimitMaxRequests: 200,
  },
  staging: {
    name: 'Staging',
    domain: 'staging.organic.aiagencyos.com.br',
    vercelProject: 'organic-traffic-os-staging',
    supabaseProject: 'organic-traffic-os-staging',
    databaseUrl: process.env.STAGING_SUPABASE_URL || '',
    storageUrl: process.env.STAGING_SUPABASE_STORAGE_URL || '',
    apiUrl: 'https://staging.organic.aiagencyos.com.br',
    logLevel: 'info',
    metricsEnabled: true,
    corsOrigins: ['https://staging.organic.aiagencyos.com.br'],
    rateLimitWindowMs: 60000,
    rateLimitMaxRequests: 100,
  },
  production: {
    name: 'Production',
    domain: 'organic.aiagencyos.com.br',
    vercelProject: 'organic-traffic-os',
    supabaseProject: 'organic-traffic-os',
    databaseUrl: process.env.PROD_SUPABASE_URL || '',
    storageUrl: process.env.PROD_SUPABASE_STORAGE_URL || '',
    apiUrl: 'https://organic.aiagencyos.com.br',
    logLevel: 'warn',
    metricsEnabled: true,
    corsOrigins: ['https://organic.aiagencyos.com.br'],
    rateLimitWindowMs: 60000,
    rateLimitMaxRequests: 60,
  },
};

export function getEnvironment(): Environment {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
  if (env === 'production' || env === 'staging') return env;
  return 'development';
}

export function getCurrentConfig(): EnvironmentConfig {
  return environments[getEnvironment()];
}
