import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, subject, preheader, body_html, body_text, cta } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const service = getNewsletterService();
    const result = await service.updateDraftCampaign(id, { subject, preheader, title: subject, body_html, body_text, cta, status: 'draft' });
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
