import { NextResponse } from 'next/server';
import { OpportunityService } from '@shared/opportunities/engine/opportunity-service';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const result = await OpportunityService.generate(blogId);
    return NextResponse.json({ status: 'success', message: 'Pipeline executado', data: result });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
