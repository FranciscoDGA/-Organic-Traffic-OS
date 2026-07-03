import { NextResponse } from 'next/server';
import { LanguageService } from '../../../../../../organic-traffic-os/natural-language/engine/language-service';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const service = new LanguageService();
    return NextResponse.json(service.refineDraft(data));
  } catch (err) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
