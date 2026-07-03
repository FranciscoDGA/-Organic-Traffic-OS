import { NextResponse } from 'next/server';
import { getAuthorityIntelligenceService } from './_service-singleton';

export async function GET() {
  try {
    const service = getAuthorityIntelligenceService();
    const report = service.getLastReport();

    if (!report) {
      return NextResponse.json({
        success: true,
        data: {
          status: 'not_analyzed',
          message: 'No analysis has been run yet. POST to /analyze to start.',
          overall_scores: null,
          total_items: 0,
          total_clusters: 0,
          total_entities: 0,
          total_internal_links: 0,
          total_pillar_pages: 0,
          recommendations_count: 0,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: 'analyzed',
        timestamp: report.timestamp,
        total_items: report.total_items,
        total_clusters: report.total_clusters,
        total_entities: report.total_entities,
        total_internal_links: report.total_internal_links,
        total_pillar_pages: report.total_pillar_pages,
        overall_scores: report.overall_scores,
        recommendations_count: report.recommendations.length,
        pillar_gaps_count: report.pillar_gaps.length,
        weak_clusters_count: report.weak_clusters.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
