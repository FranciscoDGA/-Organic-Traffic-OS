import { NextResponse } from 'next/server';

interface ConnectorInfo {
  id: string;
  name: string;
  provider: string;
  type: 'data' | 'publishing' | 'newsletter';
  status: 'configured' | 'mock' | 'missing_credentials';
  has_env_vars: boolean;
  env_vars: string[];
  api_routes: string[];
  panel_path: string;
  capabilities: string[];
  last_sync?: string;
}

const CONNECTORS: ConnectorInfo[] = [
  {
    id: 'gsc',
    name: 'Google Search Console',
    provider: 'google',
    type: 'data',
    status: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'missing_credentials',
    has_env_vars: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    env_vars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    api_routes: ['/api/organic-os/connectors/google-search-console/connect', '/api/organic-os/connectors/google-search-console/sync', '/api/organic-os/connectors/google-search-console/status', '/api/organic-os/connectors/google-search-console/sites'],
    panel_path: '/organic-os/connectors/google-search-console',
    capabilities: ['search_analytics', 'query_data', 'page_data', 'site_map'],
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    provider: 'google',
    type: 'data',
    status: process.env.GA4_CLIENT_ID ? 'configured' : 'missing_credentials',
    has_env_vars: !!(process.env.GA4_CLIENT_ID && process.env.GA4_CLIENT_SECRET),
    env_vars: ['GA4_CLIENT_ID', 'GA4_CLIENT_SECRET', 'GA4_REDIRECT_URI'],
    api_routes: ['/api/organic-os/connectors/google-analytics-4/connect', '/api/organic-os/connectors/google-analytics-4/sync', '/api/organic-os/connectors/google-analytics-4/status', '/api/organic-os/connectors/google-analytics-4/properties', '/api/organic-os/connectors/google-analytics-4/pages'],
    panel_path: '/organic-os/connectors/google-analytics-4',
    capabilities: ['traffic_data', 'user_behavior', 'page_views', 'conversions'],
  },
  {
    id: 'trends',
    name: 'Google Trends',
    provider: 'google',
    type: 'data',
    status: 'mock',
    has_env_vars: false,
    env_vars: [],
    api_routes: ['/api/organic-os/connectors/google-trends/sync', '/api/organic-os/connectors/google-trends/status', '/api/organic-os/connectors/google-trends/interest', '/api/organic-os/connectors/google-trends/related', '/api/organic-os/connectors/google-trends/compare'],
    panel_path: '/organic-os/connectors/google-trends',
    capabilities: ['trend_analysis', 'interest_over_time', 'related_queries', 'comparison'],
  },
  {
    id: 'bing',
    name: 'Bing Webmaster',
    provider: 'bing',
    type: 'data',
    status: process.env.BING_API_KEY ? 'configured' : 'missing_credentials',
    has_env_vars: !!process.env.BING_API_KEY,
    env_vars: ['BING_API_KEY'],
    api_routes: ['/api/organic-os/connectors/bing-webmaster/connect', '/api/organic-os/connectors/bing-webmaster/sync', '/api/organic-os/connectors/bing-webmaster/status', '/api/organic-os/connectors/bing-webmaster/sites', '/api/organic-os/connectors/bing-webmaster/queries', '/api/organic-os/connectors/bing-webmaster/pages'],
    panel_path: '/organic-os/connectors/bing-webmaster',
    capabilities: ['search_analytics', 'query_data', 'page_data', 'crawl_stats'],
  },
  {
    id: 'rss',
    name: 'RSS & Sitemap',
    provider: 'generic',
    type: 'data',
    status: 'configured',
    has_env_vars: true,
    env_vars: [],
    api_routes: ['/api/organic-os/connectors/rss-sitemap/feeds', '/api/organic-os/connectors/rss-sitemap/sync', '/api/organic-os/connectors/rss-sitemap/status', '/api/organic-os/connectors/rss-sitemap/urls'],
    panel_path: '/organic-os/connectors/rss-sitemap',
    capabilities: ['rss_parsing', 'atom_parsing', 'sitemap_parsing', 'robots_txt', 'feed_discovery'],
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    provider: 'wordpress',
    type: 'publishing',
    status: process.env.WP_SITE_URL ? 'configured' : 'missing_credentials',
    has_env_vars: !!(process.env.WP_SITE_URL && process.env.WP_USERNAME && process.env.WP_APP_PASSWORD),
    env_vars: ['WP_SITE_URL', 'WP_USERNAME', 'WP_APP_PASSWORD'],
    api_routes: ['/api/organic-os/connectors/wordpress/connect', '/api/organic-os/connectors/wordpress/create-draft', '/api/organic-os/connectors/wordpress/update-draft', '/api/organic-os/connectors/wordpress/publish', '/api/organic-os/connectors/wordpress/status', '/api/organic-os/connectors/wordpress/posts', '/api/organic-os/connectors/wordpress/categories', '/api/organic-os/connectors/wordpress/tags'],
    panel_path: '/organic-os/connectors/wordpress',
    capabilities: ['create_draft', 'update_draft', 'publish', 'list_posts', 'list_categories', 'list_tags'],
  },
  {
    id: 'headless',
    name: 'Headless CMS',
    provider: 'strapi|directus|sanity|mock',
    type: 'publishing',
    status: process.env.HEADLESS_CMS_PROVIDER === 'mock' || !process.env.HEADLESS_CMS_PROVIDER ? 'mock' : 'configured',
    has_env_vars: !!process.env.HEADLESS_CMS_API_TOKEN,
    env_vars: ['HEADLESS_CMS_PROVIDER', 'HEADLESS_CMS_API_URL', 'HEADLESS_CMS_API_TOKEN', 'HEADLESS_CMS_PROJECT_ID'],
    api_routes: ['/api/organic-os/connectors/headless-cms/connect', '/api/organic-os/connectors/headless-cms/create-draft', '/api/organic-os/connectors/headless-cms/update-draft', '/api/organic-os/connectors/headless-cms/publish', '/api/organic-os/connectors/headless-cms/status', '/api/organic-os/connectors/headless-cms/collections', '/api/organic-os/connectors/headless-cms/content'],
    panel_path: '/organic-os/connectors/headless-cms',
    capabilities: ['create_draft', 'update_draft', 'publish', 'list_collections', 'list_content'],
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    provider: 'brevo|mailchimp|resend|convertkit|mock',
    type: 'newsletter',
    status: process.env.NEWSLETTER_PROVIDER === 'mock' || !process.env.NEWSLETTER_PROVIDER ? 'mock' : 'configured',
    has_env_vars: !!process.env.NEWSLETTER_API_KEY,
    env_vars: ['NEWSLETTER_PROVIDER', 'NEWSLETTER_API_KEY'],
    api_routes: ['/api/organic-os/connectors/newsletter/connect', '/api/organic-os/connectors/newsletter/create-draft', '/api/organic-os/connectors/newsletter/update-draft', '/api/organic-os/connectors/newsletter/status', '/api/organic-os/connectors/newsletter/audiences', '/api/organic-os/connectors/newsletter/campaigns'],
    panel_path: '/organic-os/connectors/newsletter',
    capabilities: ['create_draft_campaign', 'update_draft_campaign', 'list_audiences', 'list_campaigns'],
  },
];

export async function GET() {
  const data_connectors = CONNECTORS.filter(c => c.type === 'data');
  const publishing_connectors = CONNECTORS.filter(c => c.type === 'publishing');
  const newsletter_connectors = CONNECTORS.filter(c => c.type === 'newsletter');

  const summary = {
    total: CONNECTORS.length,
    configured: CONNECTORS.filter(c => c.status === 'configured').length,
    mock: CONNECTORS.filter(c => c.status === 'mock').length,
    missing_credentials: CONNECTORS.filter(c => c.status === 'missing_credentials').length,
    data_connectors: data_connectors.length,
    publishing_connectors: publishing_connectors.length,
    newsletter_connectors: newsletter_connectors.length,
  };

  return NextResponse.json({
    success: true,
    data: {
      summary,
      connectors: CONNECTORS,
      groups: {
        data: data_connectors,
        publishing: publishing_connectors,
        newsletter: newsletter_connectors,
      },
    },
  });
}
