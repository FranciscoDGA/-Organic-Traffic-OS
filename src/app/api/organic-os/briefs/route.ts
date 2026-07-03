import { NextResponse } from 'next/server';
import { BriefService } from '@shared/briefs/brief-engine/brief-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id') || 'passacumaru';

    const briefs = BriefService.getAllBriefs(blogId);
    return NextResponse.json({ status: 'success', data: briefs });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
