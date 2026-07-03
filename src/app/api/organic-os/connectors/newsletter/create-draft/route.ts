import { NextRequest, NextResponse } from 'next/server';
import { getNewsletterService } from '../_service-singleton';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subject, preheader, title, intro, body_html, body_text, cta, audience } = body;

    if (!subject || !preheader || !body_html || !body_text) {
      return NextResponse.json({ success: false, error: 'subject, preheader, body_html, and body_text are required' }, { status: 400 });
    }

    const service = getNewsletterService();
    const result = await service.createDraftCampaign({ subject, preheader, title: title || subject, intro, body_html, body_text, cta, audience, status: 'draft' });
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
