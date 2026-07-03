import { NextRequest, NextResponse } from 'next/server';
import { getRssSitemapService } from '../_service-singleton';

export async function GET(req: NextRequest) {
  try {
    const domain = req.nextUrl.searchParams.get('domain');
    if (!domain) {
      return NextResponse.json({ success: false, error: 'Domain is required' }, { status: 400 });
    }

    const service = getRssSitemapService(domain);
    const result = service.getLastSyncResult();

    if (!result) {
      return NextResponse.json({
        success: true,
        data: {
          connected: false,
          domain,
          total_urls: 0,
          posts: 0,
          pages: 0,
          errors: [],
          warnings: [],
          logs: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        connected: true,
        domain: result.domain,
        feedFormat: result.feedFormat,
        feedUrl: result.feedUrl,
        sitemapsFound: result.sitemapsFound,
        robotsFound: result.robotsFound,
        total_urls: result.totalUrls,
        posts: result.posts,
        pages: result.pages,
        categories: result.categories,
        tags: result.tags,
        errors: result.errors,
        warnings: result.warnings,
        logs: result.logs,
        last_sync: result.timestamp,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
