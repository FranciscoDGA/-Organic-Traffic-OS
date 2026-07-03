import { NextResponse } from 'next/server';
import { OpportunityService } from '@shared/opportunities/engine/opportunity-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const opps = OpportunityService.getOpportunities(blogId);
    return NextResponse.json({ status: 'success', data: opps });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
