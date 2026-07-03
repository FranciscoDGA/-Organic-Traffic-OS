export interface AppConfig {
  app: {
    name: string;
    version: string;
    description: string;
  };
  domains: {
    primary: string;
    staging: string;
    development: string;
  };
  database: {
    schemas: string[];
  };
  storage: {
    buckets: string[];
  };
  security: {
    corsOrigins: string[];
    rateLimitWindowMs: number;
    rateLimitMaxRequests: number;
    httpsRequired: boolean;
    jwtSecret: string;
    sessionSecret: string;
  };
  monitoring: {
    healthCheckIntervalMs: number;
    metricsEnabled: boolean;
    logLevel: string;
  };
  bootstrap: {
    autoRun: boolean;
    skipDatabase: boolean;
    skipStorage: boolean;
    skipSecrets: boolean;
  };
}

export const defaultConfig: AppConfig = {
  app: {
    name: 'Organic Traffic OS',
    version: '1.0.0',
    description: 'Autonomous Organic Traffic Management Platform',
  },
  domains: {
    primary: 'organic.aiagencyos.com.br',
    staging: 'staging.organic.aiagencyos.com.br',
    development: 'dev.organic.aiagencyos.com.br',
  },
  database: {
    schemas: [
      'core', 'workspaces', 'missions', 'agents', 'runtime',
      'publisher', 'campaigns', 'knowledge', 'memory', 'playbooks',
      'business', 'analytics', 'audit', 'system', 'security',
      'logs', 'settings', 'users',
    ],
  },
  storage: {
    buckets: [
      'articles', 'images', 'reports', 'playbooks', 'knowledge',
      'logs', 'backups', 'exports', 'imports', 'temporary',
    ],
  },
  security: {
    corsOrigins: ['http://localhost:3000'],
    rateLimitWindowMs: 60000,
    rateLimitMaxRequests: 100,
    httpsRequired: false,
    jwtSecret: '',
    sessionSecret: '',
  },
  monitoring: {
    healthCheckIntervalMs: 30000,
    metricsEnabled: true,
    logLevel: 'info',
  },
  bootstrap: {
    autoRun: false,
    skipDatabase: false,
    skipStorage: false,
    skipSecrets: false,
  },
};

export function loadConfig(): AppConfig {
  return { ...defaultConfig };
}
