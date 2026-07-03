import { NextResponse } from 'next/server';
import { InfrastructureValidatorService } from '../../../../../src/infrastructure/validator/validator.service';

export async function GET() {
  try {
    const report = await InfrastructureValidatorService.executeAuditory();
    return NextResponse.json({
      overall_health_score: report.overall_health_score,
      status: report.overall_health_score >= 80 ? 'healthy' : report.overall_health_score >= 50 ? 'warning' : 'critical',
      timestamp: report.timestamp
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
