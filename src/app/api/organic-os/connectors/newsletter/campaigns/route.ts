import { NextResponse } from 'next/server';
import { getNewsletterService } from '../_service-singleton';

export async function GET() {
  try {
    const service = getNewsletterService();
    const campaigns = await service.listCampaigns();
    return NextResponse.json({ success: true, data: campaigns });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
