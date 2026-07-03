import { NextResponse } from 'next/server';
import { LanguageService } from '../../../../../../organic-traffic-os/natural-language/engine/language-service';

export async function GET() {
  const service = new LanguageService();
  return NextResponse.json(service.listReports());
}
