import { NextResponse } from 'next/server';
import { BriefService } from '@shared/briefs/brief-engine/brief-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { blogId = 'passacumaru', itemId, itemTitle } = body;

    if (!itemId || !itemTitle) {
      return NextResponse.json({ error: 'itemId and itemTitle required' }, { status: 400 });
    }

    const result = await BriefService.createBrief(blogId, itemId, itemTitle);
    return NextResponse.json({ status: 'success', message: 'Brief gerado', data: result });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
  }
}
