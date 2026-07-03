import { NextResponse } from 'next/server';
import { ProviderHealthChecker } from '../../../../../src/config/providers/provider-health';

export async function GET() {
  try {
    const report = ProviderHealthChecker.getGlobalHealthReport();
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
