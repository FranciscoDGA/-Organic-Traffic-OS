export interface EnvConfig {
  APP: {
    APP_ENV: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_NAME: string;
    NODE_ENV: string;
  };
  SUPABASE: {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    SUPABASE_PROJECT_REF: string;
    DATABASE_URL: string;
  };
  AI_PROVIDERS: {
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    GOOGLE_API_KEY: string;
    GEMINI_API_KEY: string;
    DEFAULT_AI_PROVIDER: string;
    DEFAULT_AI_MODEL: string;
  };
  GITHUB: {
    GITHUB_TOKEN: string;
    GITHUB_OWNER: string;
    GITHUB_REPO: string;
    GITHUB_DEFAULT_BRANCH: string;
  };
  VERCEL: {
    VERCEL_TOKEN: string;
    VERCEL_TEAM_ID: string;
    VERCEL_PROJECT_ID: string;
  };
  AUTH: {
    JWT_SECRET: string;
    SESSION_SECRET: string;
    ADMIN_EMAIL: string;
  };
  PUBLISHER: {
    PUBLISH_SECRET: string;
    ORGANIC_BRIDGE_SECRET: string;
    REVALIDATE_SECRET: string;
  };
  GOOGLE: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_REDIRECT_URI: string;
    GOOGLE_ANALYTICS_PROPERTY_ID: string;
    GOOGLE_SEARCH_CONSOLE_SITE_URL: string;
  };
  EMAIL: {
    RESEND_API_KEY: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    SMTP_FROM: string;
  };
  LOGS_MONITORING: {
    LOG_LEVEL: string;
    METRICS_ENABLED: boolean;
    DEBUG_MODE: boolean;
  };
  BLOGS: {
    PASSACUMARU: { endpoint: string; secret: string };
    QUALOSEGURO: { endpoint: string; secret: string };
    UTILPRO: { endpoint: string; secret: string };
    TABUOMETRO: { endpoint: string; secret: string };
    AIAGENCY: { endpoint: string; secret: string };
  };
}

export const env: EnvConfig = {
  APP: {
    APP_ENV: process.env.APP_ENV || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Organic Traffic OS',
    NODE_ENV: process.env.NODE_ENV || 'development',
  },
  SUPABASE: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF || '',
    DATABASE_URL: process.env.DATABASE_URL || '',
  },
  AI_PROVIDERS: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    DEFAULT_AI_PROVIDER: process.env.DEFAULT_AI_PROVIDER || 'gemini',
    DEFAULT_AI_MODEL: process.env.DEFAULT_AI_MODEL || 'gemini-1.5-pro',
  },
  GITHUB: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GITHUB_OWNER: process.env.GITHUB_OWNER || 'FranciscoDGA',
    GITHUB_REPO: process.env.GITHUB_REPO || 'Organic-Traffic-OS',
    GITHUB_DEFAULT_BRANCH: process.env.GITHUB_DEFAULT_BRANCH || 'main',
  },
  VERCEL: {
    VERCEL_TOKEN: process.env.VERCEL_TOKEN || '',
    VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID || '',
    VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID || '',
  },
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET || 'fallback-jwt-secret-key-12345',
    SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-session-secret-key-12345',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  },
  PUBLISHER: {
    PUBLISH_SECRET: process.env.PUBLISH_SECRET || '',
    ORGANIC_BRIDGE_SECRET: process.env.ORGANIC_BRIDGE_SECRET || '',
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET || '',
  },
  GOOGLE: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || '',
    GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID || '',
    GOOGLE_SEARCH_CONSOLE_SITE_URL: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || '',
  },
  EMAIL: {
    RESEND_API_KEY: process.env.RESEND_API_KEY || '',
    SMTP_HOST: process.env.SMTP_HOST || '',
    SMTP_PORT: process.env.SMTP_PORT || '587',
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || '',
    SMTP_FROM: process.env.SMTP_FROM || 'noreply@organic-os.com',
  },
  LOGS_MONITORING: {
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    METRICS_ENABLED: process.env.METRICS_ENABLED === 'true',
    DEBUG_MODE: process.env.DEBUG_MODE === 'true',
  },
  BLOGS: {
    PASSACUMARU: {
      endpoint: process.env.PASSACUMARU_PUBLISH_ENDPOINT || '',
      secret: process.env.PASSACUMARU_PUBLISH_SECRET || '',
    },
    QUALOSEGURO: {
      endpoint: process.env.QUALOSEGURO_PUBLISH_ENDPOINT || '',
      secret: process.env.QUALOSEGURO_PUBLISH_SECRET || '',
    },
    UTILPRO: {
      endpoint: process.env.UTILPRO_PUBLISH_ENDPOINT || '',
      secret: process.env.UTILPRO_PUBLISH_SECRET || '',
    },
    TABUOMETRO: {
      endpoint: process.env.TABUOMETRO_PUBLISH_ENDPOINT || '',
      secret: process.env.TABUOMETRO_PUBLISH_SECRET || '',
    },
    AIAGENCY: {
      endpoint: process.env.AIAGENCY_PUBLISH_ENDPOINT || '',
      secret: process.env.AIAGENCY_PUBLISH_SECRET || '',
    },
  },
};
