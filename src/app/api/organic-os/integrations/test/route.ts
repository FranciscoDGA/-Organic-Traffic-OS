import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { connector } = body;

    if (!connector) {
      return NextResponse.json({ success: false, error: 'connector is required' }, { status: 400 });
    }

    const validConnectors = ['gsc', 'ga4', 'trends', 'bing', 'rss', 'wordpress', 'headless', 'newsletter'];
    if (!validConnectors.includes(connector)) {
      return NextResponse.json({ success: false, error: `Invalid connector. Valid: ${validConnectors.join(', ')}` }, { status: 400 });
    }

    const testResults: Record<string, any> = {
      gsc: { connector: 'gsc', name: 'Google Search Console', test: 'connection', result: process.env.GOOGLE_CLIENT_ID ? 'credentials_available' : 'missing_credentials', message: process.env.GOOGLE_CLIENT_ID ? 'Ready to connect via OAuth' : 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET' },
      ga4: { connector: 'ga4', name: 'Google Analytics 4', test: 'connection', result: process.env.GA4_CLIENT_ID ? 'credentials_available' : 'missing_credentials', message: process.env.GA4_CLIENT_ID ? 'Ready to connect via OAuth' : 'Set GA4_CLIENT_ID and GA4_CLIENT_SECRET' },
      trends: { connector: 'trends', name: 'Google Trends', test: 'mock_adapter', result: 'mock_available', message: 'Using mock adapter (no official API available)' },
      bing: { connector: 'bing', name: 'Bing Webmaster', test: 'connection', result: process.env.BING_API_KEY ? 'credentials_available' : 'missing_credentials', message: process.env.BING_API_KEY ? 'Ready to connect via API Key' : 'Set BING_API_KEY' },
      rss: { connector: 'rss', name: 'RSS & Sitemap', test: 'always_available', result: 'available', message: 'No credentials needed - always available' },
      wordpress: { connector: 'wordpress', name: 'WordPress', test: 'connection', result: process.env.WP_SITE_URL ? 'credentials_available' : 'missing_credentials', message: process.env.WP_SITE_URL ? 'Ready to connect via Application Password' : 'Set WP_SITE_URL, WP_USERNAME, WP_APP_PASSWORD' },
      headless: { connector: 'headless', name: 'Headless CMS', test: 'connection', result: process.env.HEADLESS_CMS_API_TOKEN ? 'credentials_available' : 'mock_available', message: process.env.HEADLESS_CMS_API_TOKEN ? `Ready to connect with ${process.env.HEADLESS_CMS_PROVIDER || 'mock'}` : 'Using mock adapter' },
      newsletter: { connector: 'newsletter', name: 'Newsletter', test: 'connection', result: process.env.NEWSLETTER_API_KEY ? 'credentials_available' : 'mock_available', message: process.env.NEWSLETTER_API_KEY ? `Ready to connect with ${process.env.NEWSLETTER_PROVIDER || 'mock'}` : 'Using mock adapter' },
    };

    const result = testResults[connector];

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
