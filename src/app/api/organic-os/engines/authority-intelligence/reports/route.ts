import { NextResponse } from 'next/server';
import { getAuthorityIntelligenceService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getAuthorityIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({ success: true, data: { reports: [], message: 'No reports yet.' } });
    }

    const history = service.getHistory();
    return NextResponse.json({
      success: true,
      data: {
        latest: {
          timestamp: report.timestamp,
          total_items: report.total_items,
          total_clusters: report.total_clusters,
          total_entities: report.total_entities,
          total_pillar_pages: report.total_pillar_pages,
          overall_scores: report.overall_scores,
        },
        history,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
