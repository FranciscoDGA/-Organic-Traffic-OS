import { NextResponse } from 'next/server';

interface HealthCheck {
  connector: string;
  status: 'healthy' | 'degraded' | 'unavailable';
  has_credentials: boolean;
  env_vars_set: string[];
  env_vars_missing: string[];
  api_routes_available: boolean;
  message: string;
}

function checkConnector(id: string, envVars: string[]): HealthCheck {
  const set = envVars.filter(v => !!process.env[v]);
  const missing = envVars.filter(v => !process.env[v]);
  const hasAll = missing.length === 0;

  const baseStatus: HealthCheck['status'] = hasAll ? 'healthy' : envVars.length === 0 ? 'healthy' : 'degraded';

  const messages: Record<string, string> = {
    gsc: hasAll ? 'Google Search Console connected' : 'Missing Google OAuth credentials',
    ga4: hasAll ? 'Google Analytics 4 connected' : 'Missing GA4 OAuth credentials',
    trends: 'Google Trends uses mock adapter (no official API)',
    bing: hasAll ? 'Bing Webmaster connected' : 'Missing BING_API_KEY',
    rss: 'RSS & Sitemap always available (no credentials needed)',
    wordpress: hasAll ? 'WordPress connected' : 'Missing WordPress credentials',
    headless: hasAll ? 'Headless CMS connected' : 'Using mock adapter',
    newsletter: hasAll ? 'Newsletter connected' : 'Using mock adapter',
  };

  return {
    connector: id,
    status: baseStatus,
    has_credentials: hasAll,
    env_vars_set: set,
    env_vars_missing: missing,
    api_routes_available: true,
    message: messages[id] || 'Unknown',
  };
}

export async function GET() {
  const checks: HealthCheck[] = [
    checkConnector('gsc', ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']),
    checkConnector('ga4', ['GA4_CLIENT_ID', 'GA4_CLIENT_SECRET']),
    checkConnector('trends', []),
    checkConnector('bing', ['BING_API_KEY']),
    checkConnector('rss', []),
    checkConnector('wordpress', ['WP_SITE_URL', 'WP_USERNAME', 'WP_APP_PASSWORD']),
    checkConnector('headless', ['HEADLESS_CMS_API_TOKEN']),
    checkConnector('newsletter', ['NEWSLETTER_API_KEY']),
  ];

  const healthy = checks.filter(c => c.status === 'healthy').length;
  const degraded = checks.filter(c => c.status === 'degraded').length;
  const unavailable = checks.filter(c => c.status === 'unavailable').length;

  return NextResponse.json({
    success: true,
    data: {
      overall: degraded === 0 ? 'healthy' : healthy > degraded ? 'degraded' : 'unhealthy',
      timestamp: new Date().toISOString(),
      summary: { healthy, degraded, unavailable, total: checks.length },
      checks,
    },
  });
}
